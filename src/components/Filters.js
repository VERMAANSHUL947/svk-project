'use client';
import { Filter, MapPin } from 'lucide-react';
import './Filter.css';

const categories = ['All', 'Electrical', 'Plumbing', 'AC Services', 'Painting', 'Woodwork'];
const locations = ['All', 'Ghaziabad', 'Noida', 'Delhi', 'Greater Noida', 'Vaishali'];

export default function Filters({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedLocation, 
  setSelectedLocation 
}) {
  return (
    <section className="filters-section">
      <div className="container">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Service Category</label>
            <select 
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Location</label>
            <select 
              className="filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-buttons">
            <button className="filter-btn secondary">
              <Filter className="btn-icon" />
              More Filters
            </button>
            <button className="filter-btn primary">
              <MapPin className="btn-icon" />
              Near Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}