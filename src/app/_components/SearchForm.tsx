'use client';

import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { useAppContext } from '../context/AppProvider';

type MarkerType = {
  lat: number;
  lng: number;
  name: string;
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
      <div className='flex flex-col items-center justify-center gap-8'>
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
        <Button text='Search a route' color='primary' value='search' />
        {showSuggestions && activeSuggestionPosition && (
          <div
            className='bg-secondary scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary absolute z-50 max-h-40 w-67 overflow-y-auto rounded-xl p-4 font-bold shadow-lg'
            style={{
              top: `${activeSuggestionPosition.top + 10}px`,
              left: `${activeSuggestionPosition.left}px`,
            }}
          >
            {/* Example of more suggestions to demonstrate scroll */}
            {markers.map((marker, index) => (
              <p
                key={index + 100}
                className='hover:bg-primary/20 cursor-pointer rounded-lg px-2 py-2 text-center text-white'
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(marker);
                }}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur event
              >
                {marker.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
