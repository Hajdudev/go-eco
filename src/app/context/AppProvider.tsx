'use client';
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type LatLngLiteral = {
  lat: number;
  lng: number;
};

type AppContextType = {
  markers: google.maps.LatLngLiteral[];
  selectedPlace: google.maps.LatLngLiteral | null;
  setMarkers: (value: google.maps.LatLngLiteral[]) => void;
  setSelectedPlace: (value: google.maps.LatLngLiteral | null) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  shapes: LatLngLiteral[][];
  setShapes: (value: LatLngLiteral[][]) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shapes, setShapes] = useState<LatLngLiteral[][]>([]);

  const value = useMemo(
    () => ({
      markers,
      setMarkers,
      selectedPlace,
      setSelectedPlace,
      isMenuOpen,
      setIsMenuOpen,
      shapes,
      setShapes,
    }),
    [markers, selectedPlace, isMenuOpen, shapes],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
