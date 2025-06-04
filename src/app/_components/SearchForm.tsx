'use client';

import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { useAppContext } from '../context/AppProvider';
import Link from 'next/link';
import ModalProvider from './ModalProvider';
import DateSelector from './DateSelector';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type MarkerType = {
  stop_lat: number;
  stop_lon: number;
  stop_name: string;
};

const removeDiacritics = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function SearchForm() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stopNames'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/names`).then((res) => res.json()),
  });
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);
  const {
    activeSuggestionPosition,
    setActiveSuggestionPosition,
    showSuggestions,
    setShowSuggestions,
    fromValue,
    toValue,
    setFromValue,
    setToValue,
    selectedDate,
  } = useAppContext();

  const handleFocus =
    (inputName: 'from' | 'to') =>
    (event: React.FocusEvent<HTMLInputElement>) => {
      const rect = event.target.getBoundingClientRect();
      setActiveSuggestionPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setActiveInput(inputName);
      setShowSuggestions(true);
    };

  const handleBlur = () => {
    setShowSuggestions(false);
    setActiveSuggestionPosition(null);
    setActiveInput(null);
  };

  const handleClick = (marker: MarkerType) => {
    if (activeInput === 'from') {
      setFromValue(marker.stop_name);
    } else if (activeInput === 'to') {
      setToValue(marker.stop_name);
    }

    setShowSuggestions(false);
    setActiveSuggestionPosition(null);
    setActiveInput(null);
  };
  const queryClient = useQueryClient();

  // Format date as YYYY-MM-DD for the URL
  const formattedDate = selectedDate.toISOString().split('T')[0];

  return (
    <>
      <ModalProvider />
      <form>
        <div className='flex flex-col items-center justify-center gap-5'>
          <Input
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            name='from'
            placeholder='From where?'
            onFocus={handleFocus('from')}
            onBlur={handleBlur}
          />
          <Input
            value={toValue}
            onChange={(e) => setToValue(e.target.value)}
            name='to'
            placeholder='To where?'
            onFocus={handleFocus('to')}
            onBlur={handleBlur}
          />

          {/* Better date selector presentation */}
          <div className='w-full px-2'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                When do you want to travel?
              </div>
              <DateSelector />
            </div>
          </div>

          {isLoading ? (
            <Button
              className='hover:scale-50'
              text='loading...'
              color='primary'
              value='search'
            />
          ) : (
            <Link
              href={`/find/route?from=${encodeURIComponent(fromValue)}&to=${encodeURIComponent(toValue)}&date=${formattedDate}`}
            >
              <Button
                className='transition-all duration-100 hover:scale-110'
                text='Search a route'
                color='primary'
                value='search'
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ['routes'],
                  })
                }
              />
            </Link>
          )}

          {showSuggestions && activeSuggestionPosition && (
            <div
              className='bg-secondary scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary absolute z-50 max-h-40 w-67 overflow-y-auto rounded-xl p-4 font-bold shadow-lg'
              style={{
                top: `${activeSuggestionPosition.top + 10}px`,
                left: `${activeSuggestionPosition.left}px`,
              }}
            >
              {isLoading && <p className='text-white'>Loading...</p>}
              {isError && <p className='text-white'>Error loading stops</p>}
              {!isLoading &&
                !isError &&
                data
                  // filter based on stop_name property
                  .filter((marker: MarkerType) => {
                    const value = activeInput === 'from' ? fromValue : toValue;
                    if (value.length < 3) return true;
                    const normalizedName = removeDiacritics(
                      marker.stop_name.toLowerCase(),
                    );
                    const normalizedInput = removeDiacritics(
                      value.toLowerCase(),
                    );
                    return normalizedName.includes(normalizedInput);
                  })
                  .map((marker: MarkerType) => (
                    <p
                      key={marker.stop_name}
                      className='hover:bg-primary/20 cursor-pointer rounded-lg px-2 py-2 text-center text-white'
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(marker); // pass full marker object
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {marker.stop_name}
                    </p>
                  ))}
            </div>
          )}
        </div>
      </form>
    </>
  );
}

export default SearchForm;
