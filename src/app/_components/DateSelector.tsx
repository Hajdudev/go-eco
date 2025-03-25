'use client';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppProvider';

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format date as YYYY-MM-DD for the input
  const formattedDate = selectedDate.toISOString().split('T')[0];

  // Format date for display in a user-friendly way
  const displayDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Get today and max date (6 months from today)
  const today = new Date();
  const minDateStr = today.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Check if selected date is today
  const isToday = selectedDate.toDateString() === today.toDateString();

  // Check if selected date is tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setIsOpen(false);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
    setIsOpen(false);
  };

  const handleTomorrowClick = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
    setIsOpen(false);
  };

  const handleNextDayClick = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
    setIsOpen(false);
  };

  const handlePrevDayClick = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);

    // Don't allow selecting dates before today
    if (prevDay >= today) {
      setSelectedDate(prevDay);
    }
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={handlePrevDayClick}
          className='rounded-full p-1 text-gray-600 hover:bg-gray-100'
          disabled={isToday}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 text-blue-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <span>
            {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : displayDate}
          </span>
        </button>

        <button
          type='button'
          onClick={handleNextDayClick}
          className='rounded-full p-1 text-gray-600 hover:bg-gray-100'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className='ring-opacity-5 absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white p-4 ring-1 shadow-lg ring-black'>
          <div className='mb-3'>
            <h3 className='mb-2 text-sm font-medium text-gray-900'>
              Select date
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              <button
                onClick={handleTodayClick}
                className={`rounded-md px-3 py-2 text-sm font-medium ${isToday ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Today
              </button>
              <button
                onClick={handleTomorrowClick}
                className={`rounded-md px-3 py-2 text-sm font-medium ${isTomorrow ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          <div className='space-y-1'>
            <label
              htmlFor='date-picker'
              className='block text-sm font-medium text-gray-700'
            >
              Or choose a specific date:
            </label>
            <input
              id='date-picker'
              type='date'
              value={formattedDate}
              min={minDateStr}
              max={maxDateStr}
              onChange={handleDateChange}
              className='w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
        </div>
      )}
    </div>
  );
}
