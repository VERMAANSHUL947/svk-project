import ServiceLayout from '@/components/ServiceLayout';
import Footer from '@/components/Footer';

export default function AppliancePage() {
  const services = [
    {
      title: 'Washing Machine Repair',
      price: 499,
      options: 6,
      points: [
        'Drum issue',
        'Water leakage',
        'Motor repair',
        'Spin problem',
        'Noise issue'
      ]
    },
    {
      title: 'Refrigerator Repair',
      price: 599,
      options: 5,
      points: [
        'Cooling issue',
        'Gas refill',
        'Thermostat fix',
        'Compressor check',
        'Ice build-up issue'
      ]
    },
    {
      title: 'Microwave Repair',
      price: 399,
      options: 4,
      points: [
        'Heating problem',
        'Button panel issue',
        'Turntable repair',
        'Power issue'
      ]
    },
    {
      title: 'RO / Water Purifier Service',
      price: 499,
      options: 5,
      points: [
        'Filter replacement',
        'Water leakage fix',
        'Pump check',
        'TDS level check',
        'Full servicing'
      ]
    },
    {
      title: 'Geyser Repair',
      price: 449,
      options: 4,
      points: [
        'Heating issue',
        'Thermostat repair',
        'Water leakage',
        'Wiring check'
      ]
    }
  ];

  return (
    <>
      <ServiceLayout title="Appliance Repair" services={services} />
      <Footer />
    </>
  );
}
