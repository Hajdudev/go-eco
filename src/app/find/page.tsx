import { auth } from '@/auth';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function Page() {
  const falseData = new Array(7).fill('Nove zamky es Idk ');
  const session = await auth();

  return (
    <div className='bg-secondary mt-8 max-h-[650px] w-full rounded-4xl p-6 text-center'>
      <div className='bg-primary rounded-t-2xl px-6 py-2 text-xl font-bold'>
        <span>Recent Routes</span>
        <MapPinIcon className='inline-block h-6 w-6' />
      </div>
      {session ? (
        falseData.map((data, index) => (
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
        ))
      ) : (
        <div>
          <div className='bg-slateblack h-1 w-full'></div>
          <div className='bg-mist flex min-h-[200px] flex-col rounded-b-2xl p-4 text-center font-bold md:min-h-[300px] lg:min-h-[400px] xl:min-h-[500px]'>
            <span>You are not logged in</span>
            <Link href='/auth/signin'>
              <button className='bg-primary hover:bg-opacity-90 mt-4 rounded-md px-4 py-2 text-black'>
                Sign in
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
