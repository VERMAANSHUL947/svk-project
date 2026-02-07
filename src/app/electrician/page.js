import ServiceLayout from '@/components/ServiceLayout';
import Footer from '@/components/Footer'; // Make sure Footer path is correct

export default function ElectricianPage() {
  const services = [
    {
      id: 'elec-1',
      title: 'Switch & Socket Repair',
      price: 249,
      options: 5,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
      points: [
        'Loose connection fix',
        'Switch replacement',
        'Safety check'
      ]
    },
    {
      id: 'elec-2',
      title: 'Fan Installation',
      price: 399,
      options: 3,
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=200&fit=crop',
      points: [
        'Ceiling fan install',
        'Wiring support',
        'Testing included'
      ]
    },
    {
      id: 'elec-3',
      title: 'Light Fixture Installation',
      price: 299,
      options: 4,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop',
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
      <ServiceLayout title="Electrician" services={services} />
      <Footer /> {/* Footer added */}
    </>
  );
}
