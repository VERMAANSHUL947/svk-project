'use client';

export default function Sidebar({ title }) {
  const scrollToServices = () => {
    const element = document.querySelector('.service-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="service-sidebar">
      <h1>{title}</h1>
      <button onClick={scrollToServices}>View Services</button>
    </div>
  );
}
