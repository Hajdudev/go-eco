import { MapPinIcon } from '@heroicons/react/24/solid';
import Button from './_components/Button';
import Input from './_components/Input';
import DynamicMap from './_components/DynamicMap';
import LoadingSpinner from './loading'; // Import the loading spinner
import { Suspense } from 'react';

export default function Home() {
  const falseData = new Array(7).fill('Nove zamky es Idk ');
  return (
    <div className='flex h-screen w-screen gap-26 px-8 py-8 md:py-20'>
      <main className='w-full lg:w-[40%]'>
        <form>
          <div className='flex flex-col items-center justify-center gap-8'>
            <Input name='from' placeholder='From where?' />
            <Input name='to' placeholder='To where?' />
            <Button text='Search a route' color='primary' value='search' />
          </div>
        </form>
        <div className='bg-secondary mt-8 max-h-[650px] w-full rounded-4xl p-6 text-center'>
          <div className='bg-primary rounded-t-2xl px-6 py-2 text-xl font-bold'>
            <span>Favorite Routes</span>
            <MapPinIcon className='inline-block h-6 w-6' />
          </div>
          {falseData.map((data, index) => (
            <>
              {index === falseData.length - 1 && (
                <>
                  <div key={data} className='bg-slateblack h-1 w-full'></div>
                  <div
                    key={index}
                    className='bg-mist rounded-b-2xl p-4 font-bold'
                  >
                    {data}
                  </div>
                </>
              )}
              {index !== falseData.length - 1 && (
                <>
                  <div key={data} className='bg-slateblack h-1 w-full'></div>
                  <div key={index} className='bg-mist p-4 font-bold'>
                    {data}
                  </div>
                </>
              )}
            </>
          ))}
        </div>
      </main>
      <div className='hidden w-[60%] lg:block'>
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicMap />
        </Suspense>
      </div>
    </div>
  );
}
