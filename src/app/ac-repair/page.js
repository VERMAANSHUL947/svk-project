'use client';
import ServiceLayout from '@/components/ServiceLayout';
import Footer from '@/components/Footer';

export default function AcRepairPage() {
  const services = [
    {
      id: 'ac-1',
      title: 'AC General Service',
      price: 599,
      options: 5,
      image: 'https://images.unsplash.com/photo-1621905252507-b35a83013b0b?w=200&h=200&fit=crop',
      points: [
        'Filter & coil cleaning',
        'Gas pressure check',
        'Cooling performance test',
        'Drain pipe cleaning',
        'Minor inspection'
      ]
    },
    {
      id: 'ac-2',
      title: 'AC Installation',
      price: 1499,
      options: 4,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop',
      points: [
        'Indoor & outdoor unit setup',
        'Gas support',
        'Wiring & piping check',
        'Final testing'
      ]
    },
    {
      id: 'ac-3',
      title: 'AC Gas Refill',
      price: 2299,
      options: 3,
      image: 'https://images.unsplash.com/photo-1631545806609-4b0e36d4d7a2?w=200&h=200&fit=crop',
      points: [
        'Leak detection',
        'Gas refilling (R32/R410)',
        'Cooling efficiency test'
      ]
    },
    {
      id: 'ac-4',
      title: 'AC Uninstallation',
      price: 999,
      options: 3,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
      points: [
        'Safe AC removal',
        'Gas protection',
        'Wall sealing support'
      ]
    }
  ];

  return (
    <div className="main-wrapper">
      <ServiceLayout title="AC Repair" services={services} />
      <Footer />
    </div>
  );
}
