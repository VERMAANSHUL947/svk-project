'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import '../admin.css'; // Inherit admin styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FeaturedServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            // Fetch all services (level 2 categories)
            const res = await fetch('/api/categories?level=2');
            const data = await res.json();
            if (data.success) {
                setServices(data.categories);
            } else {
                toast.error('Failed to load services');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching services');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id, field, value) => {
        // Optimistic update
        setServices(prev => prev.map(s =>
            s._id === id ? { ...s, [field]: value } : s
        ));

        try {
            const res = await fetch('/api/categories', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, [field]: value })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Updated successfully');
            } else {
                // Revert if failed
                setServices(prev => prev.map(s =>
                    s._id === id ? { ...s, [field]: !value } : s
                ));
                toast.error(data.message || 'Update failed');
            }
        } catch (error) {
            // Revert if error
            setServices(prev => prev.map(s =>
                s._id === id ? { ...s, [field]: !value } : s
            ));
            toast.error('Connection error');
        }
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar />

            <main className="main-content">
                <AdminHeader />

                <div className="page-header">
                    <h1 className="page-title">Featured Services Management</h1>
                    <p className="page-subtitle">Manage "Essential Services" and "Most Booked" sections on the homepage.</p>
                </div>

                <div className="section-card">
                    <div className="section-header">
                        <h3 className="section-title">All Services</h3>
                    </div>
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Service Name</th>
                                    <th>Price</th>
                                    <th>Essential Service?</th>
                                    <th>Most Booked?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading services...</td></tr>
                                ) : services.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No services found. Please create categories first.</td></tr>
                                ) : (
                                    services.map(service => (
                                        <tr key={service._id}>
                                            <td style={{ fontWeight: 500 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {service.icon && <span style={{ fontSize: '1.2rem' }}>{service.icon}</span>}
                                                    {service.name}
                                                </div>
                                            </td>
                                            <td>₹{service.price}</td>
                                            <td>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={service.isEssential || false}
                                                        onChange={(e) => handleToggle(service._id, 'isEssential', e.target.checked)}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                            <td>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={service.isMostBooked || false}
                                                        onChange={(e) => handleToggle(service._id, 'isMostBooked', e.target.checked)}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #374151;
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #2563EB;
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
            `}</style>
        </div>
    );
}
