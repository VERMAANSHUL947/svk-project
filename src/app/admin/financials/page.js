'use client';
import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { transactionsData } from '@/lib/admin-data';
import '../admin.css';

export default function FinancialsPage() {
    const [timeRange, setTimeRange] = useState('Yearly');

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="page-title">Financial Analytics</h1>
                            <p className="page-subtitle">Track revenue, commissions, and platform growth</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></span>
                            <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: '600' }}>Live Feed</span>
                        </div>
                    </div>
                </div>

                {/* Financial Stats */}
                <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="stat-card" style={{ background: '#151A23' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                📄
                            </div>
                            <span className="growth-badge positive">+12.4%</span>
                        </div>
                        <div className="stat-value">$482,921.50</div>
                        <div className="stat-subtext">Total Revenue</div>
                    </div>

                    <div className="stat-card" style={{ background: '#151A23' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                💲
                            </div>
                            <span className="growth-badge positive">+8.2%</span>
                        </div>
                        <div className="stat-value" style={{ color: '#10B981' }}>$72,438.20</div>
                        <div className="stat-subtext">Platform Commission (15%)</div>
                    </div>

                    <div className="stat-card" style={{ background: '#151A23' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                💳
                            </div>
                            <span className="growth-badge neutral">Weekly</span>
                        </div>
                        <div className="stat-value">$398,200.00</div>
                        <div className="stat-subtext">Total Payouts</div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="section-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h3 className="section-title">Revenue Trends</h3>
                            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>Monthly breakdown of platform earnings</p>
                        </div>
                        <div style={{ background: '#1F2937', borderRadius: '8px', padding: '4px' }}>
                            <button onClick={() => setTimeRange('6 Months')} style={{ background: timeRange === '6 Months' ? '#2563EB' : 'transparent', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>6 Months</button>
                            <button onClick={() => setTimeRange('Yearly')} style={{ background: timeRange === 'Yearly' ? '#2563EB' : 'transparent', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Yearly</button>
                        </div>
                    </div>

                    {/* Simple SVG Line Chart */}
                    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="250" x2="1000" y2="250" stroke="#1F2937" strokeWidth="1" />
                            <line x1="0" y1="150" x2="1000" y2="150" stroke="#1F2937" strokeWidth="1" strokeDasharray="5,5" />
                            <line x1="0" y1="50" x2="1000" y2="50" stroke="#1F2937" strokeWidth="1" strokeDasharray="5,5" />

                            {/* Line Path */}
                            <path d="M0,250 C100,250 150,220 200,200 C300,160 400,180 500,140 C600,100 700,120 800,80 C900,40 950,60 1000,50"
                                fill="none" stroke="#2563EB" strokeWidth="4" />

                            {/* Area under curve */}
                            <path d="M0,250 C100,250 150,220 200,200 C300,160 400,180 500,140 C600,100 700,120 800,80 C900,40 950,60 1000,50 V300 H0 Z"
                                fill="url(#gradient)" opacity="0.2" />

                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#2563EB" />
                                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Data Points */}
                            <circle cx="200" cy="200" r="4" fill="#60A5FA" />
                            <circle cx="500" cy="140" r="4" fill="#60A5FA" />
                            <circle cx="800" cy="80" r="4" fill="#60A5FA" />

                            {/* Tooltip-like marker */}
                            <g transform="translate(800, 40)">
                                <rect x="-40" y="-30" width="80" height="24" rx="4" fill="#1F2937" />
                                <text x="0" y="-14" textAnchor="middle" fill="white" fontSize="12">$94,200</text>
                                <line x1="0" y1="0" x2="0" y2="40" stroke="#1F2937" strokeDasharray="2,2" />
                            </g>
                        </svg>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '0.75rem', marginTop: '10px' }}>
                            <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="section-card">
                    <div className="section-header">
                        <h3 className="section-title">Recent Transactions</h3>
                        <a href="#" className="view-all">View All</a>
                    </div>
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Partner Service</th>
                                    <th>Date & Time</th>
                                    <th>Amount</th>
                                    <th>Commission</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionsData.map((txn, i) => (
                                    <tr key={i}>
                                        <td style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>{txn.id}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', background: '#374151', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>⚡</div>
                                                {txn.service}
                                            </div>
                                        </td>
                                        <td style={{ color: '#9CA3AF' }}>{txn.date}</td>
                                        <td style={{ fontWeight: '600' }}>{txn.amount}</td>
                                        <td style={{ color: '#10B981' }}>{txn.commission}</td>
                                        <td><span className={`status-badge status-${txn.status.toLowerCase()}`}>{txn.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #1F2937' }}>
                        <button style={{ background: 'transparent', border: 'none', color: '#9CA3AF', fontSize: '0.8rem', cursor: 'pointer' }}>↻ REFRESH DATA</button>
                    </div>
                </div>

            </main>
        </div>
    );
}
