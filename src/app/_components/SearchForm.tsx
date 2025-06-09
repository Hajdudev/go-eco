import Input from './Input';
import { Button } from './Button';
import ModalProvider from './ModalProvider';

type MarkerType = {
  stop_lat: number;
  stop_lon: number;
  stop_name: string;
};

async function getStopNames(): Promise<MarkerType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/names`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function SearchForm() {
  const stopNames = await getStopNames();
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  return (
    <>
      <ModalProvider />
      <form
        action="/find"
        method="GET"
        className="flex flex-col items-center justify-center gap-5"
      >
        <Input
          name="from"
          placeholder="From where?"
        />
        <datalist id="from-stops">
          {stopNames.map((marker) => (
            <option key={marker.stop_name} value={marker.stop_name} />
          ))}
        </datalist>

        <Input
          name="to"
          placeholder="To where?"
        />
        <datalist id="to-stops">
          {stopNames.map((marker) => (
            <option key={marker.stop_name} value={marker.stop_name} />
          ))}
        </datalist>

        <div className="w-full px-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              When do you want to travel?
            </div>
            <input
              type="date"
              name="date"
              defaultValue={formattedDate}
              className="border rounded px-2 py-1"
              required
            />
          </div>
        </div>

        <Button
          className="transition-all duration-100 hover:scale-110"
          text="Search a route"
          color="primary"
          value="search"
        />
      </form>
    </>
  );
}
