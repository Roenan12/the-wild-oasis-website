import DateSelector from "@/app/_components/DateSelector";
import LoginMessage from "@/app/_components/LoginMessage";
import ReservationForm from "@/app/_components/ReservationForm";
import { auth } from "@/app/_lib/auth";
import {
  Cabin,
  getBookedDatesByCabinId,
  getSettings,
} from "@/app/_lib/data-service";

type ReservationProps = {
  cabin: Cabin;
};

async function Reservation({ cabin }: ReservationProps) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(cabin.id),
    getBookedDatesByCabinId(cabin.id),
  ]);
  const session = await auth();
  const user = session?.user as {
    name: string;
    email: string;
    image: string;
  };

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
