import BookingForm from "@/app/components/BookingForm";

export default async function BookingFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingForm />;
}