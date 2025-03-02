'use client';

import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { useAppContext } from '../context/AppProvider';
import Link from 'next/link';

type MarkerType = {
  lat: number;
  lng: number;
  name: string;
};

const removeDiacritics = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const SearchForm = () => {
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);
  const {
    activeSuggestionPosition,
    setActiveSuggestionPosition,
    showSuggestions,
    setShowSuggestions,
    markers,
    fromValue,
    toValue,
    setFromValue,
    setToValue,
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
      setFromValue(marker.name);
    } else if (activeInput === 'to') {
      setToValue(marker.name);
    }

    setShowSuggestions(false);
    setActiveSuggestionPosition(null);
    setActiveInput(null);
  };

  return (
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
        <Link href={`/route?from=${fromValue}&to=${toValue}`}>
          <Button text='Search a route' color='primary' value='search' />
        </Link>
        {showSuggestions && activeSuggestionPosition && (
          <div
            className='bg-secondary scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary absolute z-50 max-h-40 w-67 overflow-y-auto rounded-xl p-4 font-bold shadow-lg'
            style={{
              top: `${activeSuggestionPosition.top + 10}px`,
              left: `${activeSuggestionPosition.left}px`,
            }}
          >
            {Array.from(
              new Set(
                markers
                  .filter((marker) => {
                    const normalizedMarkerName = removeDiacritics(
                      marker.name.toLowerCase(),
                    );
                    if (activeInput === 'from') {
                      const normalizedFromValue = removeDiacritics(
                        fromValue.toLowerCase(),
                      );
                      return (
                        fromValue.length < 3 ||
                        normalizedMarkerName.includes(normalizedFromValue)
                      );
                    }
                    if (activeInput === 'to') {
                      const normalizedToValue = removeDiacritics(
                        toValue.toLowerCase(),
                      );
                      return (
                        toValue.length < 3 ||
                        normalizedMarkerName.includes(normalizedToValue)
                      );
                    }
                    return false;
                  })
                  .map((marker) => marker.name),
              ),
            ) // Get unique names
              .map((name) => {
                // Find first marker matching this name
                const marker = markers.find((m) => m.name === name);
                return (
                  <p
                    key={name}
                    className='hover:bg-primary/20 cursor-pointer rounded-lg px-2 py-2 text-center text-white'
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(marker!);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {name}
                  </p>
                );
              })}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
