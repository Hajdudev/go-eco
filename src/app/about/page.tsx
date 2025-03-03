function AboutPage() {
  return (
    <div className='bg-mist'>
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
            Our Mission
          </h2>
          <p className='mx-auto mt-5 max-w-2xl text-xl text-gray-500'>
            At GoEco, we re committed to making public transportation the
            preferred choice for urban commuters by creating intuitive,
            reliable, and user-friendly transit solutions.
          </p>
        </div>

        <div className='mt-16'>
          <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
            <div className='rounded-lg bg-white p-6 shadow-md'>
              <div className='bg-primary flex h-12 w-12 items-center justify-center rounded-md'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
                  />
                </svg>
              </div>
              <h3 className='mt-4 text-lg font-medium text-gray-900'>
                Sustainability
              </h3>
              <p className='mt-2 text-base text-gray-500'>
                We re dedicated to reducing carbon emissions by making public
                transportation more accessible and convenient.
              </p>
            </div>

            <div className='rounded-lg bg-white p-6 shadow-md'>
              <div className='bg-primary flex h-12 w-12 items-center justify-center rounded-md'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='mt-4 text-lg font-medium text-gray-900'>
                Affordability
              </h3>
              <p className='mt-2 text-base text-gray-500'>
                We believe everyone should have access to affordable
                transportation options that don t break the bank.
              </p>
            </div>

            <div className='rounded-lg bg-white p-6 shadow-md'>
              <div className='bg-primary flex h-12 w-12 items-center justify-center rounded-md'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                  />
                </svg>
              </div>
              <h3 className='mt-4 text-lg font-medium text-gray-900'>
                Reliability
              </h3>
              <p className='mt-2 text-base text-gray-500'>
                Our app provides real-time transit data and route planning to
                ensure you get where you need to go, on time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className='bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-extrabold text-gray-900'>Our Team</h2>
          <p className='mx-auto mt-4 max-w-3xl text-xl text-gray-500'>
            Meet the passionate individuals behind GoEco who are dedicated to
            transforming urban mobility.
          </p>

          <div className='mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <div className='mx-auto h-40 w-40 overflow-hidden rounded-full xl:h-56 xl:w-56'>
                <div className='flex h-full w-full items-center justify-center bg-gray-300 text-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-16 w-16'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              </div>
              <h3 className='mt-6 text-xl font-medium text-gray-900'>
                Emma Johnson
              </h3>
              <p className='text-sm text-gray-500'>Founder & CEO</p>
              <p className='mt-2 text-base text-gray-500'>
                Urban planning expert with a passion for sustainable cities.
              </p>
            </div>

            <div>
              <div className='mx-auto h-40 w-40 overflow-hidden rounded-full xl:h-56 xl:w-56'>
                <div className='flex h-full w-full items-center justify-center bg-gray-300 text-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-16 w-16'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              </div>
              <h3 className='mt-6 text-xl font-medium text-gray-900'>
                Marcus Chen
              </h3>
              <p className='text-sm text-gray-500'>Lead Developer</p>
              <p className='mt-2 text-base text-gray-500'>
                Tech innovator focused on creating intuitive transit solutions.
              </p>
            </div>

            <div>
              <div className='mx-auto h-40 w-40 overflow-hidden rounded-full xl:h-56 xl:w-56'>
                <div className='flex h-full w-full items-center justify-center bg-gray-300 text-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-16 w-16'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              </div>
              <h3 className='mt-6 text-xl font-medium text-gray-900'>
                Sophia Patel
              </h3>
              <p className='text-sm text-gray-500'>UX Designer</p>
              <p className='mt-2 text-base text-gray-500'>
                Creating beautiful, accessible interfaces for users of all
                abilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900'>Our Journey</h2>
        </div>

        <div className='relative'>
          {/* Vertical line */}
          <div
            className='absolute left-1/2 -ml-0.5 h-full w-0.5 bg-gray-200'
            aria-hidden='true'
          ></div>

          <div className='relative'>
            {/* 2020 */}
            <div className='mb-12 flex items-center justify-between'>
              <div className='w-5/12'>
                <div className='rounded-lg bg-white p-5 shadow-md'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    GoEco Founded
                  </h3>
                  <p className='mt-2 text-gray-600'>
                    Our journey began with a mission to make public
                    transportation more accessible.
                  </p>
                </div>
              </div>
              <div className='bg-primary z-10 flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white'>
                <span className='text-sm'>1</span>
              </div>
              <div className='w-5/12'>
                <div className='font-medium text-gray-600'>2020</div>
              </div>
            </div>

            {/* 2021 */}
            <div className='mb-12 flex items-center justify-between'>
              <div className='w-5/12 text-right'>
                <div className='font-medium text-gray-600'>2021</div>
              </div>
              <div className='bg-primary z-10 flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white'>
                <span className='text-sm'>2</span>
              </div>
              <div className='w-5/12'>
                <div className='rounded-lg bg-white p-5 shadow-md'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    First City Partnership
                  </h3>
                  <p className='mt-2 text-gray-600'>
                    We launched our first partnership with the city
                    transportation authority.
                  </p>
                </div>
              </div>
            </div>

            {/* 2022 */}
            <div className='mb-12 flex items-center justify-between'>
              <div className='w-5/12'>
                <div className='rounded-lg bg-white p-5 shadow-md'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    App Launch
                  </h3>
                  <p className='mt-2 text-gray-600'>
                    Our mobile app was released, helping thousands of commuters
                    navigate public transit.
                  </p>
                </div>
              </div>
              <div className='bg-primary z-10 flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white'>
                <span className='text-sm'>3</span>
              </div>
              <div className='w-5/12'>
                <div className='font-medium text-gray-600'>2022</div>
              </div>
            </div>

            {/* 2023 */}
            <div className='flex items-center justify-between'>
              <div className='w-5/12 text-right'>
                <div className='font-medium text-gray-600'>2023</div>
              </div>
              <div className='bg-primary z-10 flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white'>
                <span className='text-sm'>4</span>
              </div>
              <div className='w-5/12'>
                <div className='rounded-lg bg-white p-5 shadow-md'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Expansion
                  </h3>
                  <p className='mt-2 text-gray-600'>
                    We expanded to five additional cities and reached 100,000
                    monthly active users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
