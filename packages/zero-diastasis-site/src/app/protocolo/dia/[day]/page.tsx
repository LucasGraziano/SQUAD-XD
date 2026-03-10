import DayPageClient from '@/components/protocolo/DayPageClient';

export function generateStaticParams() {
  return Array.from({ length: 29 }, (_, i) => ({ day: String(i) }));
}

export default function DayPage({ params }: { params: { day: string } }) {
  return <DayPageClient day={Number(params.day)} />;
}
