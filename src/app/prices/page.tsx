import Link from 'next/link';

function PricingPage() {
  return (
    <div className='bg-mist px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h1 className='text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl'>
            Public Transport Pricing
          </h1>
          <p className='mx-auto mt-5 max-w-xl text-xl text-gray-500'>
            Affordable, sustainable, and convenient travel options for everyone.
          </p>
        </div>

        {/* Tabs for different ticket types */}
        <div className='mb-8 border-b border-gray-200'>
          <nav className='-mb-px flex justify-center space-x-8'>
            <button className='border-b-2 border-green-500 px-1 py-4 text-sm font-medium whitespace-nowrap text-green-600'>
              Regular Tickets
            </button>
            <button className='border-b-2 border-transparent px-1 py-4 text-sm font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700'>
              Tourist Passes
            </button>
            <button className='border-b-2 border-transparent px-1 py-4 text-sm font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700'>
              Student Discounts
            </button>
          </nav>
        </div>

        {/* Pricing Tables */}
        <div className='mt-12 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0'>
          {/* Single Ticket */}
          <div className='overflow-hidden rounded-2xl bg-white shadow-lg lg:flex lg:flex-col'>
            <div className='px-6 py-8 sm:p-10 sm:pb-6'>
              <div className='flex items-baseline'>
                <span className='bg-primary inline-flex rounded-full px-3 py-1 text-sm font-semibold tracking-wide uppercase'>
                  Single Journey
                </span>
              </div>
              <div className='mt-4 flex items-baseline text-5xl font-extrabold'>
                €0.90
                <span className='ml-1 text-lg font-medium text-gray-500'>
                  /ticket
                </span>
              </div>
              <p className='mt-5 text-sm text-gray-500'>
                Valid for a single journey on any city bus, tram, or trolleybus.
              </p>
            </div>
            <div className='flex-1 px-6 py-8 sm:p-10 sm:pt-6'>
              <ul className='space-y-4'>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Valid for 30 minutes
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Transfer between lines allowed
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Available via SMS ticket
                  </p>
                </li>
              </ul>
              <div className='mt-8'>
                <Link href='/find'>
                  <div className='bg-primary block w-full rounded-lg px-4 py-3 text-center font-medium text-white'>
                    Buy Single Ticket
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Day Pass */}
          <div className='overflow-hidden rounded-2xl border-2 border-green-500 bg-white shadow-lg lg:flex lg:flex-col'>
            <div className='absolute inset-x-0 top-0 translate-y-px transform'></div>
            <div className='px-6 py-8 pt-12 sm:p-10 sm:pb-6'>
              <div className='flex items-baseline'>
                <span className='bg-primary inline-flex rounded-full px-3 py-1 text-sm font-semibold tracking-wide uppercase'>
                  Day Pass
                </span>
              </div>
              <div className='mt-4 flex items-baseline text-5xl font-extrabold'>
                €3.50
                <span className='ml-1 text-lg font-medium text-gray-500'>
                  /day
                </span>
              </div>
              <p className='mt-5 text-sm text-gray-500'>
                Unlimited travel on all public transport for 24 hours.
              </p>
            </div>
            <div className='flex-1 px-6 py-8 sm:p-10 sm:pt-6'>
              <ul className='space-y-4'>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Unlimited rides for 24 hours
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Valid on all routes including night buses
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Digital ticket via mobile app
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Family discount available
                  </p>
                </li>
              </ul>
              <div className='mt-8'>
                <Link href='/find'>
                  <div className='bg-secondary block w-full rounded-lg px-4 py-3 text-center font-medium text-white'>
                    Buy Day Pass
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Monthly Pass */}
          <div className='overflow-hidden rounded-2xl bg-white shadow-lg lg:flex lg:flex-col'>
            <div className='px-6 py-8 sm:p-10 sm:pb-6'>
              <div className='flex items-baseline'>
                <span className='bg-primary inline-flex rounded-full px-3 py-1 text-sm font-semibold tracking-wide uppercase'>
                  Monthly Pass
                </span>
              </div>
              <div className='mt-4 flex items-baseline text-5xl font-extrabold'>
                €26.90
                <span className='ml-1 text-lg font-medium text-gray-500'>
                  /month
                </span>
              </div>
              <p className='mt-5 text-sm text-gray-500'>
                Best value for regular commuters. Unlimited travel for a full
                month.
              </p>
            </div>
            <div className='flex-1 px-6 py-8 sm:p-10 sm:pt-6'>
              <ul className='space-y-4'>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Calendar month validity
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    All routes and services included
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Auto-renewal option available
                  </p>
                </li>
                <li className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-6 w-6 text-green-500'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                  <p className='ml-3 text-base text-gray-700'>
                    Includes weekend travel
                  </p>
                </li>
              </ul>
              <div className='mt-8'>
                <Link href='/find'>
                  <div className='bg-primary block w-full rounded-lg px-4 py-3 text-center font-medium text-white'>
                    Buy Monthly Pass
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='mt-20'>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>
            Frequently Asked Questions
          </h2>

          <div className='mx-auto mt-12 max-w-3xl'>
            <div className='space-y-8'>
              <div>
                <h3 className='text-xl font-medium text-gray-900'>
                  Where can I purchase tickets?
                </h3>
                <p className='mt-2 text-base text-gray-500'>
                  Tickets can be purchased through our mobile app, at ticket
                  machines located at major stops, from bus drivers, or at our
                  customer service centers throughout the city.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-medium text-gray-900'>
                  Are there discounts for students?
                </h3>
                <p className='mt-2 text-base text-gray-500'>
                  Yes! Students with valid ID can receive up to 50% discount on
                  monthly passes. Check our student discount tab for more
                  information.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-medium text-gray-900'>
                  Can I share my pass with others?
                </h3>
                <p className='mt-2 text-base text-gray-500'>
                  Single and day passes are transferable. Monthly passes are
                  issued to individuals and cannot be shared.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
