import DynamicMap from '../_components/DynamicMap';
import ContextProvider from './ContextProvider';

async function MapWithData() {
  return (
    <>
      <ContextProvider />
      <DynamicMap />
    </>
  );
}

export default MapWithData;
