import NearestSpotsClient from "./NearestSpotsClient";

export default function Page() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Nearest Parking Spots</h1>
      <NearestSpotsClient />
    </main>
  );
}
