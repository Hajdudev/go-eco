'use client';
import {
  CalendarDate,
  Stop,
  StopTime,
  Trip,
  ActiveServiceIds,
} from '@/types/gtfs';
import { User } from '@/types/session';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type LatLngLiteral = {
  lat: number;
  lng: number;
  name?: string;
};

type AppContextType = {
  markers: Stop[];
  selectedPlace: Stop | null;
  setMarkers: (value: Stop[]) => void;
  setSelectedPlace: (value: Stop | null) => void;
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
  stopTimes: StopTime[];
  setStopTimes: (value: StopTime[]) => void;
  trips: Trip[];
  setTrips: (value: Trip[]) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  todayDay: CalendarDate | CalendarDate[];
  setTodayDay: (value: CalendarDate | CalendarDate[]) => void;
  activeServiceIds: ActiveServiceIds;
  setActiveServiceIds: (value: ActiveServiceIds) => void;
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [markers, setMarkers] = useState<Stop[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Stop | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shapes, setShapes] = useState<LatLngLiteral[][]>([]);
  const [activeSuggestionPosition, setActiveSuggestionPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [stopTimes, setStopTimes] = useState<StopTime[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [todayDay, setTodayDay] = useState<CalendarDate | CalendarDate[]>({
    service_id: '',
    date: '',
  });
  const [activeServiceIds, setActiveServiceIds] = useState<ActiveServiceIds>(
    [],
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const value = useMemo(
    () => ({
      user,
      setUser,
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
      stopTimes,
      setStopTimes,
      trips,
      setTrips,
      isLoading,
      setIsLoading,
      todayDay,
      setTodayDay,
      activeServiceIds,
      setActiveServiceIds,
      selectedDate,
      setSelectedDate,
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
      stopTimes,
      trips,
      isLoading,
      user,
      todayDay,
      activeServiceIds,
      selectedDate,
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
