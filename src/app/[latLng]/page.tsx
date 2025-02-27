// import { getStops } from '@/services/apiStops'; // Adjust the import path as necessary

export default function Page() {
  // const stops = await getStops();
  // {
  //   console.log(stops);
  // }
  return (
    <div className='bg-secondary mt-8 min-h-[550px] w-full rounded-4xl p-6 text-center'>
      {/* {stops.map((stop, index) => (
        <div key={index}>{stop.stop_name}</div>
      ))} */}
      Hello
    </div>
  );
}

// const uniqueStops = Array.from(
//   new Set(data.map((stop) => stop.stop_name)),
// ).map((stop_name) => {
//   const stop = data.find((s) => s.stop_name === stop_name);
//   return {
//     name: stop.stop_name,
//     lat: parseFloat(stop.stop_lat),
//     lng: parseFloat(stop.stop_lon),
//   };
// });
