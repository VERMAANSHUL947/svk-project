'use client';
import { useState } from 'react';
import ServiceLayout from '@/components/ServiceLayout';
import Footer from '@/components/Footer';

export default function ElectricianPage() {
  const [showServices, setShowServices] = useState(false);

  const services = [
    {
      title: 'Switch & Socket Repair',
      price: 249,
      options: 5,
      points: [
        'Loose connection fix',
        'Switch replacement',
        'Safety check'
      ]
    },
    {
      title: 'Fan Installation',
      price: 399,
      options: 3,
      points: [
        'Ceiling fan install',
        'Wiring support',
        'Testing included'
      ]
    },
    {
      title: 'Light Fixture Installation',
      price: 299,
      options: 4,
      points: [
        'LED/Tube light installation',
        'Wiring safety check',
        'Bulb replacement',
        'Testing included'
      ]
    }
  ];

  return (
    <>
      <h1>Electrician Services</h1>
      
      {!showServices ? (
        <button
          onClick={() => setShowServices(true)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          View Services
        </button>
      ) : (
        <ServiceLayout title="Electrician" services={services} />
      )}

      <Footer />
    </>
  );
}
