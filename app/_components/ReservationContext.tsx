"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type ReservationState = {
  range: { from: Date | undefined; to: Date | undefined };
  setRange: Dispatch<
    SetStateAction<{ from: Date | undefined; to: Date | undefined }>
  >;
  resetRange: () => void;
};

export const initialState: { from: Date | undefined; to: Date | undefined } = {
  from: undefined,
  to: undefined,
};

const ReservationContext = createContext<ReservationState | undefined>(
  undefined
);

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState(initialState);
  const resetRange = (): void => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");
  return context;
}

export { ReservationProvider, useReservation };
