import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

// export const metadata = {
//   title: "Cabin",
// };
type Params = {
  cabinId: number;
};

export async function generateMetadata({ params }: { params: Params }) {
  const cabin = await getCabin(params.cabinId);

  if (!cabin) {
    throw new Error("Cabin not found");
  }

  const { name } = cabin;
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins: Cabin[] = await getCabins();

  if (!cabins) {
    throw new Error("Cabins could not be found");
  }

  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));

  return ids;
}

export default async function Page({ params }: { params: Params }) {
  const cabin: Cabin | null = await getCabin(params.cabinId);

  if (!cabin) {
    throw new Error("Failed to load cabin details");
  }

  // console.log(params);
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
