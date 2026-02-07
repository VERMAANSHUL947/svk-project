import ServiceLayout from '@/components/ServiceLayout';
import Footer from '@/components/Footer';

export default function PlumberPage() {
  const services = [
    {
      id: 'plumber-1',
      title: 'Tap Repair',
      price: 299,
      options: 5,
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop',
      points: [
        'Leakage fixing',
        'Pipe inspection',
        'Quality fittings'
      ]
    },
    {
      id: 'plumber-2',
      title: 'Bathroom Plumbing',
      price: 499,
      options: 4,
      image: 'https://images.unsplash.com/photo-1621905252507-b35a83013b0b?w=200&h=200&fit=crop',
      points: [
        'Flush repair',
        'Blockage removal',
        'Water pressure fix'
      ]
    }
  ];

  return (
    <>
      <ServiceLayout title="Plumber" services={services} />
      <Footer />
    </>
  );
}
