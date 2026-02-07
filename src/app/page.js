'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PromoCarousel from '@/components/PromoCarousel';
import OffersSection from '@/components/OffersSection';
import HomeRenovationSection from '@/components/HomeRenovationSection';
import DynamicSectionRenderer from '@/components/DynamicSectionRenderer';
import Footer from '@/components/Footer';

export default function Home() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch('/api/sections?t=' + Date.now()).then(res => res.json()).then(data => {
      if (data.success) setSections(data.sections);
    });
  }, []);

  return (
    <div className="app">
      <Header />
      <PromoCarousel />
      <OffersSection />
      <HomeRenovationSection />
      {sections.length > 0 && <DynamicSectionRenderer sections={sections} />}
      <Footer />
    </div>
  );
}