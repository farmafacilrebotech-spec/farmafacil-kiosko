import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return [
    { id: '001' },
    { id: '002' },
    { id: '003' }
  ];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
