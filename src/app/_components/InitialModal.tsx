'use client';

import { useState, useEffect } from 'react';

function InitialModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('hasSeenGoEcoModal');

    if (!hasSeenModal) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Store that user has seen the modal
    localStorage.setItem('hasSeenGoEcoModal', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='max-w-md rounded-lg bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
        <div className='mb-4 flex items-center justify-center'>
          <span className='text-2xl font-bold text-green-600'>🌿 GoEco</span>
          <div className='ml-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black uppercase'>
            Demo Version
          </div>
        </div>

        <h2 className='mb-3 text-xl font-bold'>
          Welcome to GoEco Transit Demo
        </h2>

        <p className='mb-4 text-gray-700'>
          This application is a <strong>personal project</strong> and is not
          intended for production use. It demonstrates public transport routing
          in Bratislava and serves as a portfolio piece.
        </p>

        <div className='mb-4 rounded-lg bg-blue-50 p-3'>
          <h3 className='mb-2 font-semibold'>Sample Routes:</h3>
          <ul className='list-disc pl-5 text-sm text-gray-600'>
            <li>Hlavná stanica → Námestie Ľ. Štúra</li>
            <li>Pod stanicou → Aupark</li>
            <li>Trnavské mýto → IKEA</li>
            <li>Račianske mýto → Most SNP</li>
          </ul>
        </div>

        <p className='text-sm text-gray-500'>
          Data is based on public transport schedules but may not reflect
          current real-time information. This project was created for
          educational and demonstration purposes only.
        </p>

        <button
          onClick={handleClose}
          className='mt-4 w-full rounded-md bg-green-600 py-2 font-bold text-white transition-colors hover:bg-green-700'
        >
          I Understand - Let&apos;s Explore
        </button>
      </div>
    </div>
  );
}

export default InitialModal;
