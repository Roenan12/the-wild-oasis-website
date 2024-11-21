import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

type Params = {
  cabinId: number;
};

export async function GET(request: Request, { params }: { params: Params }) {
  const { cabinId } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "cabin not found" });
  }
}
