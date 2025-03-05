import { Suspense } from 'react';
import DynamicMap from '../_components/DynamicMap';
import ContextProvider from './ContextProvider';

async function MapWithData() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ContextProvider />
      </Suspense>
      <DynamicMap />
    </>
  );
}

export default MapWithData;
