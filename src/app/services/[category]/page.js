'use client';
import { useParams, useRouter } from 'next/navigation';
import { categories } from '../../../data/categories';
import './style.css';

export default function ServicePage() {
    const params = useParams();
    const router = useRouter();
    const categoryKey = params.category;
    const category = categories[categoryKey];

    if (!category) {
        return (
            <div className="service-not-found">
                <h1>Service Not Found</h1>
                <button onClick={() => router.push('/')}>Go Back Home</button>
            </div>
        );
    }

    return (
        <div className="service-page">
            <div className="service-header">
                <button className="back-btn" onClick={() => router.push('/')}>← Back</button>
                <h1>{category.name}</h1>
            </div>

            <div className="subcategory-list">
                {category.subcategories.map((sub, index) => (
                    <div key={index} className="subcategory-item-card">
                        <div className="sub-icon">{sub.icon}</div>
                        <h3>{sub.name}</h3>
                        <button className="book-btn">Book Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
