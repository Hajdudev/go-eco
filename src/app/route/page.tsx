'use client';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  return (
    <div className='bg-secondary mt-8 min-h-[550px] w-full rounded-4xl p-6 text-center'>
      <h2>From value: {from}</h2>
      <h2>To value: {to}</h2>
    </div>
  );
}
