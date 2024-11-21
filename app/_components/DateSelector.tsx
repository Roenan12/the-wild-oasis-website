"use client";

import { isWithinInterval } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Settings, Cabin } from "@/app/_lib/data-service";
import { useReservation } from "@/app/_components/ReservationContext";

// Utility function to check if a range is already booked
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isAlreadyBooked(range: DateRange, datesArr: Date[]): boolean {
  if (!range.from || !range.to) return false;
  const startDate = range.from;
  const endDate = range.to;

  //returns true if date is within range
  return datesArr.some((date: Date) =>
    isWithinInterval(date, { start: startDate, end: endDate })
  );
}

type DateSelectorProps = {
  settings: Settings;
  bookedDates: Date[];
  cabin: Cabin;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DateSelector({ settings, bookedDates, cabin }: DateSelectorProps) {
  const { range, setRange, resetRange } = useReservation();

  const regularPrice = 23;
  const discount = 23;
  const numNights = 23;
  const cabinPrice = 23;

  // SETTINGS

  const { minBookingLength, maxBookingLength } = settings;

  const handleSelect = (selected: DateRange | undefined) => {
    setRange({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
  };

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={handleSelect}
        selected={range}
        min={minBookingLength}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
