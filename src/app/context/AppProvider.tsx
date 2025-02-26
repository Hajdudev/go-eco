'use client';
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type LatLngLiteral = {
  lat: number;
  lng: number;
  name?: string;
};

type MarkerType = {
  lat: number;
  lng: number;
  name: string;
};

type AppContextType = {
  markers: MarkerType[];
  selectedPlace: MarkerType | null;
  setMarkers: (value: MarkerType[]) => void;
  setSelectedPlace: (value: MarkerType | null) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  shapes: LatLngLiteral[][];
  setShapes: (value: LatLngLiteral[][]) => void;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  activeSuggestionPosition: { top: number; left: number } | null;
  setActiveSuggestionPosition: (
    value: { top: number; left: number } | null,
  ) => void;
  fromValue: string;
  toValue: string;
  setFromValue: (value: string) => void;
  setToValue: (value: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<MarkerType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shapes, setShapes] = useState<LatLngLiteral[][]>([]);
  const [activeSuggestionPosition, setActiveSuggestionPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

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
      showSuggestions,
      setShowSuggestions,
      activeSuggestionPosition,
      setActiveSuggestionPosition,
      fromValue,
      toValue,
      setFromValue,
      setToValue,
    }),
    [
      markers,
      selectedPlace,
      isMenuOpen,
      shapes,
      showSuggestions,
      activeSuggestionPosition,
      fromValue,
      toValue,
    ],
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
