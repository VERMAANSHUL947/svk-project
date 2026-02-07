'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './partner-premium.css';
import {
    FaWallet, FaCalendarAlt, FaStar, FaUser, FaBox, FaLayerGroup, FaImage, FaTicketAlt,
    FaSearch, FaBell, FaMoon, FaPlus, FaFilter, FaSort, FaEllipsisV, FaCheckCircle,
    FaClock, FaSpinner, FaArrowUp, FaCreditCard, FaFileInvoiceDollar, FaList, FaUserCircle, FaBars
} from 'react-icons/fa';

export default function PartnerDashboardPremium() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [partner, setPartner] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [activeBookingTab, setActiveBookingTab] = useState('All Bookings');

    const [errorMsg, setErrorMsg] = useState('');
    const [bookings, setBookings] = useState([]);

    // --- BANNER STATE ---
    const [bannerForm, setBannerForm] = useState({
        title: '',
        placement: 'Main Home Screen',
        linkToCategory: 'Deep Cleaning',
        imageUrl: '',
        activeDuration: '',
        price: '',
        _id: null
    });
    const [isPublishing, setIsPublishing] = useState(false);
    const [myBanners, setMyBanners] = useState([]);

    // --- CATEGORY STATE ---
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [isCatLoading, setIsCatLoading] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [catForm, setCatForm] = useState({
        name: '',
        icon: '',
        image: '',
        parentId: null,
        level: 0,
        price: '',
        details: ''
    });

    const [pickingFor, setPickingFor] = useState('banner'); // 'banner', 'category-icon', 'category-image'

    // --- MOBILE MENU STATE ---
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // --- OFFERS STATE ---
    const [myOffers, setMyOffers] = useState([]);
    const [offerForm, setOfferForm] = useState({
        title: '',
        discountValue: '',
        discountType: 'Percentage',
        validityStart: '',
        validityEnd: '',
        _id: null
    });
    const [isSavingOffer, setIsSavingOffer] = useState(false);

    const handleFolderImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const dataUrl = reader.result;
            // First add to gallery so it's saved in DB
            const savedItem = await addToGallery(dataUrl);
            const urlToUse = savedItem ? savedItem.url : dataUrl;

            // Set the appropriate form
            if (pickingFor === 'category-icon') {
                setCatForm(prev => ({ ...prev, icon: urlToUse }));
            } else if (pickingFor === 'category-image') {
                setCatForm(prev => ({ ...prev, image: urlToUse }));
            } else if (pickingFor === 'section-item') {
                setSectionItem(prev => ({ ...prev, image: urlToUse }));
            } else {
                setBannerForm(prev => ({ ...prev, imageUrl: urlToUse }));
            }
            alert('Image Selected from Folder!');
        };
        reader.readAsDataURL(file);
    };

    const fetchCategories = async () => {
        setIsCatLoading(true);
        try {
            const res = await fetch(`/api/categories?all=true&t=${Date.now()}`);
            const data = await res.json();
            if (data.success) setDynamicCategories(data.categories);
        } catch (e) {
            console.error('Fetch categories error:', e);
        } finally {
            setIsCatLoading(false);
        }
    };

    const fetchOffers = async () => {
        if (!partner?._id) return;
        try {
            const res = await fetch('/api/offers?partnerId=' + partner._id);
            const data = await res.json();
            if (data.success) setMyOffers(data.offers);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSaveCategory = async () => {
        if (!catForm.name) return;
        try {
            const method = catForm._id ? 'PATCH' : 'POST';
            const payload = {
                ...catForm,
                price: catForm.price ? Number(catForm.price) : 0,
                details: catForm.details.split('\n').filter(d => d.trim() !== '')
            };

            // For PATCH, we need to send 'id' as a separate field in body based on API route
            if (catForm._id) {
                payload.id = catForm._id;
            }

            const res = await fetch('/api/categories', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert(catForm._id ? 'Category Updated!' : 'Category Created!');
                setShowCatModal(false);
                setCatForm({ name: '', icon: '', image: '', parentId: null, level: 0, price: '', details: '', _id: null });
                fetchCategories();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleEditOffer = (o) => {
        setOfferForm({
            title: o.title,
            discountValue: o.discountValue,
            discountType: o.discountType || 'Percentage',
            validityStart: o.validityStart ? o.validityStart.split('T')[0] : '',
            validityEnd: o.validityEnd ? o.validityEnd.split('T')[0] : '',
            _id: o._id
        });
    };

    const handleDeleteOffer = async (id) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        try {
            const res = await fetch(`/api/offers?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                alert('Offer deleted');
                fetchOffers();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSaveOffer = async () => {
        if (!offerForm.title || !offerForm.discountValue) return alert('Kripya saari details bharein');
        setIsSavingOffer(true);
        try {
            const method = offerForm._id ? 'PATCH' : 'POST';
            const payload = { ...offerForm, partnerId: partner._id };

            if (offerForm._id) {
                payload.id = offerForm._id;
            }

            const res = await fetch('/api/offers', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert(offerForm._id ? 'Offer Updated!' : 'Offer Activated!');
                setOfferForm({ title: '', discountValue: '', discountType: 'Percentage', validityStart: '', validityEnd: '', _id: null });
                fetchOffers();
            }
        } catch (e) { console.error(e); }
        finally { setIsSavingOffer(false); }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm('Are you sure? This will delete all sub-categories too.')) return;
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchCategories();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleCatStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            const res = await fetch('/api/categories', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (data.success) fetchCategories();
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMyBanners = async () => {
        if (!partner?._id) return;
        try {
            const res = await fetch(`/api/banners?partnerId=${partner._id}&t=${Date.now()}`);
            const data = await res.json();
            if (data.success) setMyBanners(data.banners);
        } catch (e) {
            console.error('Fetch banners error:', e);
        }
    };

    useEffect(() => {
        fetchMyBanners();
        fetchOffers();
    }, [partner]);

    const handleDeleteBanner = async (id) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;
        try {
            const res = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                alert('Banner Removed!');
                fetchMyBanners();
            }
        } catch (e) {
            console.error('Delete error:', e);
        }
    };

    // --- MEDIA / GALLERY STATE ---
    const [gallery, setGallery] = useState([]);
    const [showGalleryModal, setShowGalleryModal] = useState(false);

    const fetchGallery = async () => {
        if (!partner?._id) return;
        try {
            const res = await fetch(`/api/media?partnerId=${partner._id}`);
            const data = await res.json();
            if (data.success) setGallery(data.gallery);
        } catch (e) {
            console.error('Fetch gallery error:', e);
        }
    };

    const handleDeleteGallery = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                alert('Media deleted');
                fetchGallery();
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [partner]);

    const addToGallery = async (url) => {
        if (!url) return;
        try {
            const res = await fetch('/api/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, partnerId: partner._id, title: 'New Upload' })
            });
            const data = await res.json();
            if (data.success) {
                setGallery(prev => [data.item, ...prev]);
                return data.item;
            } else {
                alert('Upload fail: ' + data.message);
            }
        } catch (error) {
            console.error('Gallery add error:', error);
            alert('Upload error: Connection failed or image too large');
        }
        return null;
    };

    // --- CUSTOM SECTIONS STATE ---
    const [mySections, setMySections] = useState([]);
    const [sectionForm, setSectionForm] = useState({ title: '', items: [], _id: null });
    const [sectionItem, setSectionItem] = useState({ name: '', price: '', image: '', description: '', badge: '' });
    const [editingItemIdx, setEditingItemIdx] = useState(null);
    const [showSectionModal, setShowSectionModal] = useState(false);

    const fetchMySections = async () => {
        if (!partner?._id) return;
        try {
            const res = await fetch(`/api/sections?partnerId=${partner._id}`);
            const data = await res.json();
            if (data.success) setMySections(data.sections);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchMySections();
    }, [partner]);

    const addSectionItem = () => {
        if (!sectionItem.name || !sectionItem.price) return alert('Name and Price required');

        if (editingItemIdx !== null) {
            // Update existing item
            const newItems = [...sectionForm.items];
            newItems[editingItemIdx] = sectionItem;
            setSectionForm(prev => ({ ...prev, items: newItems }));
            setEditingItemIdx(null);
        } else {
            // Add new item
            setSectionForm(prev => ({ ...prev, items: [...prev.items, sectionItem] }));
        }

        setSectionItem({ name: '', price: '', image: '', description: '', badge: '' });
    };

    const handleEditSection = (sec) => {
        setSectionForm({
            title: sec.title,
            items: sec.services || [], // Map backend 'services' to frontend 'items'
            _id: sec._id
        });
        setShowSectionModal(true);
    };

    const handleSaveSection = async () => {
        if (!sectionForm.title || sectionForm.items.length === 0) return alert('Title and at least 1 item required');
        try {
            const method = sectionForm._id ? 'PATCH' : 'POST';

            const payload = {
                title: sectionForm.title,
                services: sectionForm.items, // Map frontend 'items' to backend 'services'
                partnerId: partner._id,
                isActive: true
            };

            if (sectionForm._id) {
                payload.id = sectionForm._id;
            }

            const res = await fetch('/api/sections', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert(sectionForm._id ? 'Success: Section Updated!' : 'Success: Section Published!');
                setShowSectionModal(false);
                setSectionForm({ title: '', items: [], _id: null });
                setEditingItemIdx(null);
                fetchMySections();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to save section. Check console.');
        }
    };

    const handleDeleteSection = async (id) => {
        if (!confirm('Delete this section?')) return;
        await fetch(`/api/sections?id=${id}`, { method: 'DELETE' });
        fetchMySections();
    };

    useEffect(() => {
        if (partner && partner.serviceCategory) {
            // Fetch Bookings for this partner's category
            const fetchBookings = async () => {
                try {
                    console.log('🔍 Fetching bookings for partner:', partner.fullName);
                    console.log('📦 Service Category:', partner.serviceCategory);

                    // Fetch all bookings as requested by user ("sb patner ko show hoo")
                    const url = `/api/bookings?role=partner&category=All`;
                    console.log('🌐 API URL:', url);

                    const res = await fetch(url);
                    const data = await res.json();

                    console.log('📊 API Response:', data);

                    if (data.success) {
                        console.log('✅ Bookings found:', data.bookings.length);
                        // Transform DB data to UI format if needed
                        const formattedBookings = data.bookings.map(b => ({
                            dbId: b._id, // Store real DB ID
                            id: '#' + b._id.substring(b._id.length - 6).toUpperCase(), // Short ID
                            customer: b.userDetails?.name || 'Guest User',
                            phone: b.userDetails?.phone || 'N/A',
                            email: b.userDetails?.email || '',
                            address: b.userDetails?.address ? (
                                b.userDetails.address.fullAddress ||
                                `${b.userDetails.address.street || ''} ${b.userDetails.address.suburb || ''} ${b.userDetails.address.city || b.userDetails.address.town || ''}`.trim() ||
                                'Address not found'
                            ) : (b.userDetails?.fullAddress || 'Address not found'), // Fallback for old data
                            service: b.items && b.items.length > 0 ? b.items.map(i => i.name).join(', ') : b.category,
                            time: `${b.scheduledDate || ''} ${b.scheduledTimeSlot || ''}`.trim() || 'Scheduled',
                            status: b.status,
                            icon: b.category === 'Plumber' ? '🔧' : b.category === 'Electrician' ? '⚡' : '🧹'
                        }));
                        console.log('📋 Formatted bookings:', formattedBookings);
                        setBookings(formattedBookings);
                    } else {
                        console.warn('⚠️ API returned error:', data.message);
                    }
                } catch (err) {
                    console.error('❌ Error fetching bookings:', err);
                }
            };
            fetchBookings();
        } else {
            console.warn('⚠️ Partner or serviceCategory not available:', { partner: partner?.fullName, category: partner?.serviceCategory });
        }
    }, [partner]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/partner/me');
                const data = await res.json();
                if (data.success) {
                    setPartner(data.partner);
                } else {
                    console.warn('Profile fetch failed:', data.message);
                    setErrorMsg(data.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setErrorMsg('Network or Server Error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/partner/logout', { method: 'POST' });
            router.push('/partner/login');
        } catch (error) {
            console.error('Logout failed');
        }
    };

    if (loading) return <div className="loading-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaSpinner className="spin" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} /></div>;

    if (!partner) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Something went wrong.</h2>
                <p>Could not load profile data.</p>
                {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>Error: {errorMsg}</p>}
                <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Go to Login (Reset)</button>
            </div>
        );
    }

    // --- WAITING SCREEN ---
    if (partner.status !== 'Verified' && partner.status !== 'Active') {
        const isRejected = partner.status === 'Rejected';
        return (
            <div className="waiting-container" style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F8FAFC',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999
            }}>
                <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', color: isRejected ? '#EF4444' : '#2563EB' }}>
                        {isRejected ? '✕' : <FaClock />}
                    </div>
                    <h2 style={{ marginTop: '0', color: '#1F2937' }}>Verification Status: <span style={{ color: isRejected ? '#EF4444' : '#F59E0B' }}>{partner.status}</span></h2>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        {isRejected ? "Your application was not approved. Please contact support." : "Thanks for registering! We are reviewing your documents. Once verified, you'll get full access to the dashboard."}
                    </p>
                    <button onClick={handleLogout} style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
                    {!isRejected && <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', marginLeft: '1rem', padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Check Status</button>}
                </div>
            </div>
        );
    }

    // --- MOCK DATA FOR UI ---
    const services = [
        { id: 1, title: 'Deep Cleaning', price: 99, status: 'Active', rating: 4.8, reviews: 120, image: '🧹' },
        { id: 2, title: 'Plumbing Checkup', price: 35, status: 'Active', rating: 4.5, reviews: 0, image: '🔧' },
        { id: 3, title: 'Electrician Visit', price: 45, status: 'Active', rating: 4.9, reviews: 42, image: '⚡' },
    ];

    const categories = [
        {
            id: 1, name: 'Home Renovation', type: 'Parent', status: true, expanded: true, icon: '🏠', subs: [
                { id: 11, name: 'Painting Services', status: true },
                { id: 12, name: 'Flooring & Tiling', status: true }
            ]
        },
        {
            id: 2, name: 'Plumbing & HVAC', type: 'Parent', status: true, expanded: true, icon: '🔧', subs: [
                { id: 21, name: 'Pipe Fittings', status: true },
                { id: 22, name: 'AC Service', status: false }
            ]
        }
    ];

    const offers = [
        { id: 1, name: 'Summer Deep Clean', discount: '20%', type: 'Percentage', valid: 'Jun 01 - Jun 15', status: 'Live' },
        { id: 2, name: 'First Time Electrician', discount: '$15.00', type: 'Flat', valid: 'May 10 - Jun 30', status: 'Live' },
        { id: 3, name: 'Spring Plumbing', discount: '10%', type: 'Percentage', valid: 'Apr 01 - Apr 30', status: 'Expired' }
    ];

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            // Find the database ID from the formatted ID
            // In a real app, you'd store the _id in the formatted object
            const realId = bookings.find(b => b.id === bookingId)?.dbId;
            if (!realId) return;

            const res = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: realId,
                    status: newStatus,
                    partnerId: partner._id,
                    partnerName: partner.fullName
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state
                setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
                alert(`Booking ${newStatus} successfully!`);
            }
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const handleEditBanner = (b) => {
        setBannerForm({
            title: b.title,
            placement: b.placement,
            linkToCategory: b.linkToCategory,
            imageUrl: b.imageUrl,
            activeDuration: b.activeDuration || '',
            price: b.price || '',
            _id: b._id
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    };

    const handlePublishBanner = async () => {
        if (!bannerForm.title || !bannerForm.imageUrl) {
            alert('Please provide a title and image URL');
            return;
        }

        setIsPublishing(true);
        const method = bannerForm._id ? 'PATCH' : 'POST';

        const payload = {
            title: bannerForm.title,
            placement: bannerForm.placement,
            linkToCategory: bannerForm.linkToCategory,
            imageUrl: bannerForm.imageUrl,
            activeDuration: bannerForm.activeDuration,
            price: bannerForm.price ? Number(bannerForm.price) : 0,
            partnerId: partner._id,
            isActive: true
        };

        if (bannerForm._id) {
            payload.id = bannerForm._id;
        }

        try {
            const res = await fetch('/api/banners', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert(bannerForm._id ? 'Banner Updated Successfully!' : 'Banner Published Successfully!');
                fetchMyBanners(); // Refresh list
                // Reset form
                setBannerForm({
                    title: '',
                    placement: 'Main Home Screen',
                    linkToCategory: 'Deep Cleaning',
                    imageUrl: '',
                    activeDuration: '',
                    price: '',
                    _id: null
                });
            }
        } catch (error) {
            console.error('Publish error:', error);
            alert('Failed to save banner');
        } finally {
            setIsPublishing(false);
        }
    };

    // --- ACTIVE DASHBOARD ---
    console.log('Rendering Active Dashboard for:', partner.fullName);

    return (
        <div className="dashboard-container">
            {/* MOBILE OVERLAY */}
            <div
                className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* SIDEBAR */}
            <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="brand">
                    <div className="brand-logo">{partner.fullName?.charAt(0) || 'P'}</div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Service Partner</div>
                        <div style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: '600', letterSpacing: '0.5px' }}>VERIFIED PROVIDER</div>
                    </div>
                </div>

                <nav className="nav-links">
                    <a className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}>
                        <FaLayerGroup /> Dashboard
                    </a>
                    <a className={`nav-item ${activeTab === 'Categories' ? 'active' : ''}`} onClick={() => setActiveTab('Categories')}>
                        <FaBox /> Categories
                    </a>
                    <a className={`nav-item ${activeTab === 'Custom Sections' ? 'active' : ''}`} onClick={() => setActiveTab('Custom Sections')}>
                        <FaLayerGroup /> Custom Sections
                    </a>
                    <a className={`nav-item ${activeTab === 'Bookings' ? 'active' : ''}`} onClick={() => setActiveTab('Bookings')}>
                        <FaCalendarAlt /> Bookings
                    </a>
                    <a className={`nav-item ${activeTab === 'Home Renovation' ? 'active' : ''}`} onClick={() => setActiveTab('Home Renovation')}>
                        <FaLayerGroup /> Home Renovation
                    </a>
                    <a className={`nav-item ${activeTab === 'Banners' ? 'active' : ''}`} onClick={() => setActiveTab('Banners')}>
                        <FaImage /> Banners
                    </a>
                    <a className={`nav-item ${activeTab === 'Gallery' ? 'active' : ''}`} onClick={() => setActiveTab('Gallery')}>
                        <FaImage /> Media Gallery
                    </a>
                    <a className={`nav-item ${activeTab === 'Earnings' ? 'active' : ''}`} onClick={() => setActiveTab('Earnings')}>
                        <FaWallet /> Earnings
                    </a>
                </nav>

                <button className="profile-btn" onClick={() => router.push('/partner/profile')}>View My Profile</button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                {/* HEADER */}
                <header className="top-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
                            <FaBars />
                        </button>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{activeTab} Overview</h1>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar">
                            <FaSearch color="#9CA3AF" />
                            <input type="text" placeholder="Search metrics..." />
                        </div>
                        <div className="icon-btn"><FaBell /></div>
                        <div className="icon-btn" onClick={handleLogout} title="Logout"><FaUser /></div>
                    </div>
                </header>

                {/* --- DASHBOARD TAB --- */}
                {activeTab === 'Dashboard' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}><FaBox /></div>
                                </div>
                                <div className="stat-label">Total Services</div>
                                <div className="stat-value">0</div>
                                <div className="stat-trend">Set up your catalog</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}><FaCalendarAlt /></div>
                                </div>
                                <div className="stat-label">Total Bookings</div>
                                <div className="stat-value">{bookings.length}</div>
                                <div className="stat-trend trend-up">All time records</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><FaStar /></div>
                                </div>
                                <div className="stat-label">Avg Rating</div>
                                <div className="stat-value">0.0</div>
                                <div className="stat-trend">(No Reviews)</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#ECFEFF', color: '#0891B2' }}><FaWallet /></div>
                                </div>
                                <div className="stat-label">Monthly Revenue</div>
                                <div className="stat-value">$0.00</div>
                                <div className="stat-trend">Earnings this month</div>
                            </div>
                        </div>

                        <div className="section-header">
                            <div>
                                <h3 className="section-title">Live Service Catalog</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage your active marketplace listings</p>
                            </div>
                            <div className="filter-group">
                                <button className="filter-btn"><FaFilter /> Filter</button>
                                <button className="filter-btn"><FaSort /> Sort</button>
                            </div>
                        </div>

                        <div className="catalog-grid">
                            {services.map(service => (
                                <div className="service-card" key={service.id}>
                                    <div className="card-img-container">
                                        <div style={{ fontSize: '3rem' }}>{service.image}</div>
                                        {service.id === 1 && <span style={{ position: 'absolute', top: 12, left: 12, background: '#2563EB', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>EXCLUSIVE</span>}
                                    </div>
                                    <div className="card-body">
                                        <div className="service-title">
                                            {service.title}
                                            <FaEllipsisV style={{ color: '#9CA3AF', cursor: 'pointer' }} />
                                        </div>
                                        <p className="service-desc">Professional service provided by verified expert. Includes all safety checks.</p>
                                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                                            <span style={{ color: '#10B981', fontWeight: 600 }}>● {service.status}</span>
                                            <span style={{ color: '#F59E0B' }}>★ {service.rating} ({service.reviews})</span>
                                        </div>
                                        <div className="service-meta">
                                            <div className="service-price">${service.price}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="create-new-card">
                                <div className="create-icon"><FaPlus /></div>
                                <div style={{ fontWeight: 600 }}>Create New Service</div>
                                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.5rem', textAlign: 'center' }}>Increase earnings by<br />adding more categories</div>
                            </div>
                        </div>
                    </>
                )}

                {/* --- CATEGORIES TAB (Dynamic) --- */}
                {activeTab === 'Categories' && (
                    <div className="category-container-full">
                        <div className="section-header">
                            <div>
                                <h3 className="section-title">Partner Category & Hierarchy Manager</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Manage Parent, Sub, and Co-categories (Services)</p>
                            </div>
                            <button className="profile-btn" style={{ width: 'auto' }} onClick={() => {
                                setCatForm({ name: '', icon: '', parentId: null, level: 0, price: '', details: '' });
                                setShowCatModal(true);
                            }}>+ Create Parent Category</button>
                        </div>

                        {isCatLoading ? (
                            <div style={{ textAlign: 'center', padding: '5rem' }}><FaSpinner className="spin" /> Loading categories...</div>
                        ) : dynamicCategories.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem', background: '#F8FAFC', borderRadius: '16px', color: '#64748b' }}>
                                <FaLayerGroup size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No categories found. Start by creating a parent category.</p>
                            </div>
                        ) : (
                            dynamicCategories.map(cat => (
                                <div key={cat._id} className="category-card-parent">
                                    <div className="cat-header-row">
                                        <div className="cat-info-group">
                                            <div className="cat-icon-box" style={{ overflow: 'hidden' }}>
                                                {cat.icon ? ((cat.icon.startsWith('http') || cat.icon.startsWith('data:')) ? <img src={cat.icon} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : cat.icon) : '📁'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {cat.name}
                                                    <span style={{ fontSize: '0.65rem', background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>PARENT</span>
                                                    {(cat.name.toLowerCase().includes('home renovation') || cat.name.toLowerCase().includes('renovation')) && (
                                                        <span style={{ fontSize: '0.65rem', background: '#F0FDF4', color: '#16A34A', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, border: '1px solid #BBF7D0' }}>✨ HOMEPAGE SECTION</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cat-controls">
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>STATUS</span>
                                            <label className="switch">
                                                <input type="checkbox" checked={cat.status === 'Active'} onChange={() => toggleCatStatus(cat._id, cat.status)} />
                                                <span className="slider"></span>
                                            </label>
                                            <button className="text-btn-blue" onClick={() => {
                                                setCatForm({ ...catForm, level: 1, parentId: cat._id, name: '' });
                                                setShowCatModal(true);
                                            }}>+ Add Sub-category</button>
                                            <div className="icon-action-small" onClick={() => handleDeleteCategory(cat._id)}>🗑</div>
                                        </div>
                                    </div>

                                    <div className="cat-children-container">
                                        <div className="cat-vertical-line"></div>
                                        {cat.children?.map(sub => (
                                            <div key={sub._id} className="sub-cat-wrapper">
                                                <div className="sub-cat-card">
                                                    <div className="cat-info-group">
                                                        <div className="sub-cat-icon" style={{ overflow: 'hidden' }}>
                                                            {sub.icon ? ((sub.icon.startsWith('http') || sub.icon.startsWith('data:')) ? <img src={sub.icon} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : sub.icon) : '📄'}
                                                        </div>
                                                        <div style={{ fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            {sub.name}
                                                            {sub.image && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                    <div style={{ width: '40px', height: '25px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                                                        <img src={sub.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                    <span style={{ fontSize: '0.6rem', color: '#6366F1', fontWeight: 700 }}>COVER IMAGE ✅</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="cat-controls">
                                                        <label className="switch" style={{ transform: 'scale(0.85)' }}>
                                                            <input type="checkbox" checked={sub.status === 'Active'} onChange={() => toggleCatStatus(sub._id, sub.status)} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <button className="text-btn-blue" onClick={() => {
                                                            setCatForm({ ...catForm, level: 2, parentId: sub._id, name: '' });
                                                            setShowCatModal(true);
                                                        }}>+ Add Service (Co-cat)</button>
                                                        <div className="icon-action-small" onClick={() => handleDeleteCategory(sub._id)}>🗑</div>
                                                    </div>
                                                </div>

                                                {sub.children && sub.children.length > 0 && (
                                                    <div className="co-cat-list">
                                                        <div className="co-cat-vertical-line"></div>
                                                        {sub.children.map(co => (
                                                            <div key={co._id} className="co-cat-item">
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <div style={{ width: 24, height: 24, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        {co.icon ? ((co.icon.startsWith('http') || co.icon.startsWith('data:')) ? <img src={co.icon} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : co.icon) : '⚡'}
                                                                    </div>
                                                                    <div>
                                                                        <div style={{ fontSize: '0.9rem', color: '#1F2937', fontWeight: 600 }}>{co.name}</div>
                                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Starts at ₹{co.price}</div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <label className="switch" style={{ transform: 'scale(0.75)' }}>
                                                                        <input type="checkbox" checked={co.status === 'Active'} onChange={() => toggleCatStatus(co._id, co.status)} />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                    <div style={{ color: '#EF4444', cursor: 'pointer' }} onClick={() => handleDeleteCategory(co._id)}>×</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}


                    </div>
                )}

                {/* --- BOOKINGS TAB --- */}
                {activeTab === 'Bookings' && (
                    <div className="bookings-view-container">
                        {/* 1. Top Stats for Bookings */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}><FaCalendarAlt /></div>
                                    <div style={{ background: '#DBEAFE', padding: '4px', borderRadius: '6px' }}><FaList size={12} color="#2563EB" /></div>
                                </div>
                                <div className="stat-label">New Bookings</div>
                                <div className="stat-value">{bookings.filter(b => b.status === 'Pending').length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#FFF7ED', color: '#EA580C' }}><FaFileInvoiceDollar /></div>
                                </div>
                                <div className="stat-label">In-Progress</div>
                                <div className="stat-value">{bookings.filter(b => b.status === 'In-Progress').length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}><FaCheckCircle /></div>
                                </div>
                                <div className="stat-label">Total Completed</div>
                                <div className="stat-value">{bookings.filter(b => b.status === 'Completed').length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#FAF5FF', color: '#9333EA' }}><FaStar /></div>
                                </div>
                                <div className="stat-label">Avg Rating</div>
                                <div className="stat-value">0.0</div>
                            </div>
                        </div>

                        {/* 2. Main Booking Content */}
                        <div className="section-header" style={{ alignItems: 'flex-end', marginTop: '1rem' }}>
                            <div>
                                <h3 className="section-title">Bookings & Schedule</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage and track your service appointments in real-time.</p>
                            </div>
                            <div className="filter-group">
                                <button className="filter-btn" style={{ padding: '0.5rem' }}><FaList /></button>
                                <button className="filter-btn" style={{ padding: '0.5rem' }}><FaCalendarAlt /></button>
                                <div style={{ width: '1px', background: '#E5E7EB', margin: '0 5px' }}></div>
                                <button className="filter-btn"><FaFilter /> Filter</button>
                                <button className="filter-btn"><FaSort /> Sort</button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="tabs-row" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
                            {['All Bookings', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled'].map(tab => (
                                <div
                                    key={tab}
                                    onClick={() => setActiveBookingTab(tab)}
                                    style={{
                                        padding: '10px 0',
                                        cursor: 'pointer',
                                        borderBottom: activeBookingTab === tab ? '2px solid #2563EB' : '2px solid transparent',
                                        color: activeBookingTab === tab ? '#2563EB' : '#6B7280',
                                        fontWeight: activeBookingTab === tab ? 600 : 500,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Contact & Address</th>
                                        <th>Service & Schedule</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings
                                        .filter(b => activeBookingTab === 'All Bookings' || b.status === activeBookingTab)
                                        .map((row, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280' }}>{row.id}</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 600, color: '#1F2937' }}>{row.customer}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{row.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>👤 {row.customer}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 500 }}>✉️ {row.email}</div>
                                                        <a href={`tel:${row.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                                                            📞 {row.phone}
                                                        </a>
                                                        <div style={{ fontSize: '0.85rem', color: '#374151', maxWidth: '220px', lineHeight: '1.3', fontWeight: 500, borderTop: '1px solid #F3F4F6', paddingTop: '4px', marginTop: '2px' }}>
                                                            📍 {row.address}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{row.service}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>⏰ {row.time}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${row.status === 'Completed' ? 'status-green' : row.status === 'In-Progress' ? 'status-yellow' : 'status-blue'}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        {row.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(row.id, 'Confirmed')}
                                                                style={{ padding: '6px 12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                            >
                                                                Confirm
                                                            </button>
                                                        )}
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.address)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ padding: '6px', background: '#EFF6FF', color: '#2563EB', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
                                                            title="View on Map"
                                                        >
                                                            🗺️
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    {bookings.filter(b => activeBookingTab === 'All Bookings' || b.status === activeBookingTab).length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                                                No bookings found with status "{activeBookingTab}".
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6B7280', fontSize: '0.85rem' }}>
                            <span>Showing 1 to 4 of 24 results</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button style={{ border: '1px solid #E5E7EB', background: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>{'<'}</button>
                                <button style={{ border: '1px solid #2563EB', background: '#2563EB', color: 'white', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>1</button>
                                <button style={{ border: '1px solid #E5E7EB', background: 'white', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>2</button>
                                <button style={{ border: '1px solid #E5E7EB', background: 'white', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>3</button>
                                <button style={{ border: '1px solid #E5E7EB', background: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>{'>'}</button>
                            </div>
                        </div>

                        {/* FAB */}
                        <button className="fab-btn" style={{ position: 'fixed', bottom: '30px', right: '30px', background: '#2563EB', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 600, boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', zIndex: 100 }}>
                            <FaPlus /> Add New Service
                        </button>
                    </div>
                )}

                {/* --- OFFERS TAB --- */}
                {activeTab === 'Offers' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead><tr><th>Offer Name</th><th>Discount</th><th>Validity</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {myOffers.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No offers created yet.</td></tr>
                                    ) : (
                                        myOffers.map(offer => (
                                            <tr key={offer._id}>
                                                <td style={{ fontWeight: 600 }}>{offer.title} <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{offer.discountType}</div></td>
                                                <td><span style={{ background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{offer.discountValue}</span></td>
                                                <td className="offer-validity">
                                                    <span className="offer-dates">
                                                        {offer.validityStart ? new Date(offer.validityStart).toLocaleDateString() : 'N/A'} -
                                                        {offer.validityEnd ? new Date(offer.validityEnd).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td><span className="status-dot" style={{ background: offer.status === 'Live' ? '#10B981' : '#9CA3AF' }}></span>{offer.status || 'Live'}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button onClick={() => handleEditOffer(offer)} style={{ color: '#2563EB', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                                        <button onClick={() => handleDeleteOffer(offer._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="editor-form">
                            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{offerForm._id ? 'Edit Offer' : 'Create New Offer'}</h3>
                            <div className="form-group">
                                <label className="form-label">Offer Title</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. Weekend Special"
                                    value={offerForm.title || ''}
                                    onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Discount Value & Type</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. 20"
                                        value={offerForm.discountValue || ''}
                                        onChange={e => setOfferForm({ ...offerForm, discountValue: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                    <select
                                        className="form-select"
                                        value={offerForm.discountType || 'Percentage'}
                                        onChange={e => setOfferForm({ ...offerForm, discountType: e.target.value })}
                                        style={{ width: '120px' }}
                                    >
                                        <option value="Percentage">Percentage %</option>
                                        <option value="Flat">Flat ₹</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Validity Period</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        className="form-input"
                                        type="date"
                                        value={offerForm.validityStart || ''}
                                        onChange={e => setOfferForm({ ...offerForm, validityStart: e.target.value })}
                                    />
                                    <input
                                        className="form-input"
                                        type="date"
                                        value={offerForm.validityEnd || ''}
                                        onChange={e => setOfferForm({ ...offerForm, validityEnd: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="profile-btn" style={{ marginTop: '1rem', flex: 1 }} onClick={handleSaveOffer} disabled={isSavingOffer}>
                                    {isSavingOffer ? 'Saving...' : (offerForm._id ? 'Update Promotion' : 'Activate Promotion')}
                                </button>
                                {offerForm._id && (
                                    <button
                                        className="cancel-btn"
                                        style={{ marginTop: '1rem', background: '#f3f4f6' }}
                                        onClick={() => setOfferForm({ title: '', discountValue: '', discountType: 'Percentage', validityStart: '', validityEnd: '', _id: null })}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- HOME RENOVATION TAB --- */}
                {activeTab === 'Home Renovation' && (
                    <div className="category-container-full">
                        <div className="section-header">
                            <div>
                                <h3 className="section-title">Home Renovation Manager</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Dedicated view for managing the renovation grid on homepage</p>
                            </div>
                            <button className="profile-btn" style={{ width: 'auto', background: '#2563EB' }} onClick={() => {
                                const parent = dynamicCategories.find(c => c.name.toLowerCase().includes('home renovation') || c.name.toLowerCase().includes('renovation'));
                                if (parent) {
                                    setCatForm({ name: '', icon: '', image: '', parentId: parent._id, level: 1, price: '', details: '' });
                                } else {
                                    setCatForm({ name: 'Home Renovation', icon: '🏠', image: '', parentId: null, level: 0, price: '', details: '' });
                                }
                                setShowCatModal(true);
                            }}>+ Add Renovation Category</button>
                        </div>

                        {isCatLoading ? (
                            <div style={{ textAlign: 'center', padding: '5rem' }}><FaSpinner className="spin" /> Loading renovation data...</div>
                        ) : (() => {
                            const parent = dynamicCategories.find(c => c.name.toLowerCase().includes('home renovation') || c.name.toLowerCase().includes('renovation'));
                            if (!parent) return (
                                <div style={{ textAlign: 'center', padding: '5rem', background: '#F8FAFC', borderRadius: '16px' }}>
                                    <FaLayerGroup size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                    <p>Home Renovation parent category not found in your catalog.</p>
                                    <button className="profile-btn" style={{ marginTop: '1rem', width: 'auto' }} onClick={() => {
                                        setCatForm({ name: 'Home Renovation', icon: '🏠', image: '', parentId: null, level: 0, price: '', details: '' });
                                        setShowCatModal(true);
                                    }}>Initialize Renovation Section</button>
                                </div>
                            );

                            return (
                                <div className="category-card-parent" style={{ border: '2px solid #2563EB', boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)' }}>
                                    <div className="cat-header-row" style={{ background: '#EFF6FF', borderBottom: '1px solid #DBEAFE' }}>
                                        <div className="cat-info-group">
                                            <div className="cat-icon-box" style={{ background: '#2563EB', color: 'white' }}>{parent.icon || '🏠'}</div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {parent.name}
                                                    <span style={{ fontSize: '0.7rem', background: '#2563EB', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>MAIN HUB</span>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#60A5FA' }}>This content is currently live on your Homepage grid</div>
                                            </div>
                                        </div>
                                        <button className="text-btn-blue" style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #BFDBFE' }} onClick={() => {
                                            setCatForm({ name: '', icon: '', image: '', parentId: parent._id, level: 1, price: '', details: '' });
                                            setShowCatModal(true);
                                        }}>+ Add Sub-category</button>
                                    </div>

                                    <div className="cat-children-container" style={{ padding: '1.5rem', background: '#FEFEFE' }}>
                                        {parent.children?.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                                                <p>No renovation categories yet. Add items like "Bathroom", "Painting", etc.</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                                                {parent.children.map(sub => (
                                                    <div key={sub._id} className="sub-cat-wrapper" style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', height: 'fit-content' }}>
                                                        <div className="sub-cat-card" style={{ border: 'none', padding: 0, marginBottom: '15px' }}>
                                                            <div className="cat-info-group">
                                                                <div className="sub-cat-icon" style={{ background: '#F8FAFC' }}>
                                                                    {sub.icon ? ((sub.icon.startsWith('http') || sub.icon.startsWith('data:')) ? <img src={sub.icon} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : sub.icon) : '📁'}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{sub.name}</div>
                                                                    {sub.image && (
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                                            <div style={{ width: 30, height: 20, borderRadius: '3px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                                                                <img src={sub.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                            </div>
                                                                            <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 600 }}>Grid Cover Active</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="cat-controls">
                                                                <button style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} onClick={() => {
                                                                    setCatForm({
                                                                        name: sub.name, icon: sub.icon, image: sub.image || '',
                                                                        parentId: sub.parentId, level: sub.level, price: sub.price,
                                                                        details: sub.details ? sub.details.join('\n') : '', _id: sub._id
                                                                    });
                                                                    setShowCatModal(true);
                                                                }}>✏️</button>
                                                                <button className="icon-action-small" onClick={() => handleDeleteCategory(sub._id)} title="Delete Category">🗑</button>
                                                            </div>
                                                        </div>

                                                        <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '10px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 5px' }}>
                                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Services</span>
                                                                <button style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                                                                    setCatForm({ ...catForm, level: 2, parentId: sub._id, name: '', _id: null });
                                                                    setShowCatModal(true);
                                                                }}>+ Add Service</button>
                                                            </div>
                                                            {sub.children && sub.children.length > 0 ? (
                                                                <div className="co-cat-list" style={{ marginLeft: 0, border: 'none' }}>
                                                                    {sub.children.map(co => (
                                                                        <div key={co._id} className="co-cat-item" style={{ background: 'white', margin: '4px 0', border: '1px solid #F1F5F9' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <span style={{ fontSize: '1rem' }}>{co.icon || '⚡'}</span>
                                                                                <div>
                                                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{co.name}</div>
                                                                                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>₹{co.price}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <label className="switch" style={{ transform: 'scale(0.7)' }}>
                                                                                    <input type="checkbox" checked={co.status === 'Active'} onChange={() => toggleCatStatus(co._id, co.status)} />
                                                                                    <span className="slider"></span>
                                                                                </label>
                                                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => {
                                                                                    setCatForm({
                                                                                        name: co.name, icon: co.icon, image: co.image || '',
                                                                                        parentId: co.parentId, level: co.level, price: co.price,
                                                                                        details: co.details ? co.details.join('\n') : '', _id: co._id
                                                                                    });
                                                                                    setShowCatModal(true);
                                                                                }}>✏️</button>
                                                                                <div style={{ color: '#EF4444', cursor: 'pointer', padding: '5px' }} onClick={() => handleDeleteCategory(co._id)}>×</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div style={{ padding: '10px', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>No services added yet</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* --- BANNERS TAB --- */}
                {activeTab === 'Banners' && (
                    <div className="banner-editor-container">
                        <div className="editor-form">
                            <div className="section-header">
                                <div>
                                    <h3 style={{ margin: 0 }}>New Campaign Banner</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>Recommended Size: <b>1200 x 600 px</b> (Ratio 2:1)</p>
                                </div>
                                <div>
                                    <button className="filter-btn" style={{ display: 'inline-flex' }}>Save Draft</button>
                                    <button
                                        onClick={handlePublishBanner}
                                        disabled={isPublishing}
                                        className="profile-btn"
                                        style={{ width: 'auto', marginLeft: '10px' }}
                                    >
                                        {isPublishing ? 'Publishing...' : 'Publish New'}
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'stretch' }}>
                                <div className="dash-upload-area" style={{ flex: 1 }} onClick={() => setShowGalleryModal(true)}>
                                    {bannerForm.imageUrl ? (
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <img src={bannerForm.imageUrl} alt="Banner" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                                            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>Change from Gallery</div>
                                        </div>
                                    ) : (
                                        <>
                                            <FaImage style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#2563EB' }} />
                                            <p style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.9rem' }}>Choose from Gallery</p>
                                        </>
                                    )}
                                </div>

                                <label className="dash-upload-area" style={{ flex: 1, cursor: 'pointer', borderStyle: 'dashed', background: '#F9FAFB' }}>
                                    <FaPlus style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#059669' }} />
                                    <p style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.9rem' }}>Upload from Folder</p>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={(e) => {
                                            setPickingFor('banner');
                                            handleFolderImageUpload(e);
                                        }}
                                    />
                                </label>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Banner Title</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. Summer Special 20% Off"
                                        value={bannerForm.title || ''}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Placement</label>
                                    <select
                                        className="form-select"
                                        value={bannerForm.placement || 'Main Home Screen'}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, placement: e.target.value }))}
                                    >
                                        <option>Main Home Screen</option>
                                        <option>Offers Page</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Link to Category</label>
                                    <select
                                        className="form-select"
                                        value={bannerForm.linkToCategory || 'Deep Cleaning'}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, linkToCategory: e.target.value }))}
                                    >
                                        <option>Deep Cleaning</option>
                                        <option>Plumbing Checkup</option>
                                        <option>Electrician Visit</option>
                                        <option>AC Repair</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price / Starting at (₹)</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        placeholder="e.g. 199"
                                        value={bannerForm.price || ''}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, price: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Active Duration</label>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <input
                                            className="form-input"
                                            type="date"
                                            value={bannerForm.activeDuration}
                                            onChange={(e) => setBannerForm(prev => ({ ...prev, activeDuration: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="preview-pane">
                            <h4 style={{ marginBottom: '1rem' }}>App Live Preview</h4>
                            <div className="mobile-frame">
                                <div className="mobile-screen">
                                    <div className="mobile-notch"></div>
                                    <div style={{ padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eee' }}></div>
                                        <div style={{ height: 10, width: 100, background: '#f0f0f0', borderRadius: 4 }}></div>
                                    </div>
                                    <div className="mobile-banner-preview" style={{ backgroundImage: bannerForm.imageUrl ? `url(${bannerForm.imageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', height: '140px' }}>
                                        <div style={{ textAlign: 'center', background: bannerForm.imageUrl ? 'rgba(255,255,255,0.7)' : 'transparent', padding: '10px', borderRadius: '8px' }}>
                                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>{bannerForm.title || 'BANNER TITLE'}</div>
                                            <div style={{ color: '#475569', fontSize: '0.8rem' }}>{bannerForm.linkToCategory || 'Category Link'}</div>
                                            {bannerForm.price && <div style={{ fontWeight: 700, color: '#2563EB', marginTop: '4px' }}>Starts at ₹{bannerForm.price}</div>}
                                        </div>
                                    </div>
                                    <div className="mobile-app-grid">
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- MANAGEMENT SECTION --- */}
                        <div style={{ marginTop: '3rem', borderTop: '2px solid #F3F4F6', paddingTop: '2rem', width: '100%' }}>
                            <div className="section-header">
                                <div>
                                    <h3 style={{ margin: 0 }}>Live Banners Management</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Currently active on the customer website</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '1.5rem' }}>
                                {myBanners.length === 0 ? (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: '#F9FAFB', borderRadius: '12px', color: '#9CA3AF' }}>
                                        <FaImage size={30} style={{ marginBottom: '10px' }} />
                                        <p>No active banners found. Publish one above!</p>
                                    </div>
                                ) : (
                                    myBanners.map((b, idx) => (
                                        <div key={idx} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <div style={{ height: '120px', position: 'relative' }}>
                                                <img src={b.imageUrl} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px' }}>
                                                    <button
                                                        style={{ background: '#2563EB', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                                        onClick={() => handleEditBanner(b)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        style={{ background: '#EF4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                                        onClick={() => handleDeleteBanner(b._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ padding: '15px' }}>
                                                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{b.title}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: '#6B7280' }}>
                                                    <span>{b.linkToCategory}</span>
                                                    <span style={{ fontWeight: 700, color: '#059669' }}>
                                                        {b.price ? `₹${b.price}` : '₹0 / No Price'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- GALLERY TAB --- */}
                {activeTab === 'Gallery' && (
                    <div className="gallery-view" style={{ background: 'white', padding: '2rem', borderRadius: '16px', minHeight: '600px' }}>
                        <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 className="section-title">Media Library</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Upload and manage your business photos</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    id="gallery-url-main"
                                    className="form-input"
                                    placeholder="Paste Image URL..."
                                    style={{ width: '300px' }}
                                />
                                <button className="profile-btn" style={{ width: 'auto' }} onClick={async () => {
                                    const input = document.getElementById('gallery-url-main');
                                    if (input.value) {
                                        await addToGallery(input.value);
                                        input.value = '';
                                        alert('Photo added via URL!');
                                    }
                                }}>Add via URL</button>

                                <label className="profile-btn" style={{ width: 'auto', background: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaPlus /> Upload from Computer
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = async () => {
                                                    await addToGallery(reader.result);
                                                    alert('Uploaded successfully from folder!');
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                            {gallery.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#9CA3AF' }}>
                                    <FaImage size={50} style={{ marginBottom: '15px' }} />
                                    <h3>No Photos Yet</h3>
                                    <p>Start by adding some image URLs to your gallery.</p>
                                </div>
                            ) : (
                                gallery.map((item, idx) => (
                                    <div key={idx} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
                                        <img src={item.url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white', padding: '12px', fontSize: '0.75rem' }}>
                                            <div style={{ fontWeight: 600 }}>Added on {new Date(item.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => {
                                                    setBannerForm(prev => ({ ...prev, imageUrl: item.url }));
                                                    alert('URL copied to Banner Form!');
                                                    setActiveTab('Banners');
                                                }}
                                                style={{ background: '#2563EB', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Use
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGallery(item._id)}
                                                style={{ background: '#EF4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )
                }

                {/* --- EARNINGS TAB --- */}
                {
                    activeTab === 'Earnings' && (
                        <div className="earnings-container">
                            {/* Top Stats Row */}
                            <div className="earnings-stats-grid">
                                <div className="balance-card-blue">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: '5px' }}>Available Balance</div>
                                            <div style={{ fontSize: '2rem', fontWeight: 700 }}>$2,840.50</div>
                                        </div>
                                        <div style={{ opacity: 0.8 }}><FaWallet size={24} /></div>
                                    </div>
                                    <button className="withdraw-btn">Withdraw Funds</button>
                                </div>

                                <div className="stat-card-simple">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div className="label">Total Lifetime Earnings</div>
                                            <div className="value">$14,250.00</div>
                                            <div className="trend positive">↑ 12.5% from last month</div>
                                        </div>
                                        <div className="icon-box-green"><FaArrowUp /></div>
                                    </div>
                                </div>

                                <div className="stat-card-simple">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div className="label">Platform Fees (15%)</div>
                                            <div className="value">$2,137.50</div>
                                            <div className="sub-text">Deducted from gross earnings</div>
                                        </div>
                                        <div className="icon-box-red">%</div>
                                    </div>
                                </div>

                                <div className="stat-card-simple">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div className="label">Pending Clearances</div>
                                            <div className="value">$850.00</div>
                                            <div className="sub-text">Next payout in 3 days</div>
                                        </div>
                                        <div className="icon-box-blue">⏳</div>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Row: Trends & Categories */}
                            <div className="earnings-mid-grid">
                                <div className="chart-panel">
                                    <div className="panel-header">
                                        <h3>Revenue Trends</h3>
                                        <div className="time-toggles">
                                            <span className="active">Weekly</span>
                                            <span>Monthly</span>
                                            <span>Yearly</span>
                                        </div>
                                    </div>
                                    <div className="chart-placeholder">
                                        {/* Mock Chart Visualization */}
                                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%', paddingBottom: '20px' }}>
                                            <div style={{ width: '8%', height: '30%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                            <div style={{ width: '8%', height: '45%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                            <div style={{ width: '8%', height: '35%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                            <div style={{ width: '8%', height: '60%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                            <div style={{ width: '8%', height: '50%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                            <div style={{ width: '8%', height: '75%', background: '#C7D2FE', borderRadius: '6px' }}></div>
                                            <div style={{ width: '8%', height: '65%', background: '#2563EB', borderRadius: '6px' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', color: '#9CA3AF' }}>
                                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                        </div>
                                        <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '0.75rem', color: '#6B7280' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }}></span> Net Partner Payout</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E0E7FF' }}></span> Platform Commission</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="category-breakdown-panel">
                                    <h3>Revenue by Category</h3>
                                    <div className="breakdown-list">
                                        <div className="breakdown-item">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Home Cleaning</span>
                                                <span style={{ fontWeight: 600 }}>$8,400 (45%)</span>
                                            </div>
                                            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '45%', background: '#2563EB' }}></div></div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Plumbing</span>
                                                <span style={{ fontWeight: 600 }}>$3,562 (25%)</span>
                                            </div>
                                            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '25%', background: '#3B82F6' }}></div></div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Electrical</span>
                                                <span style={{ fontWeight: 600 }}>$2,050 (20%)</span>
                                            </div>
                                            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '20%', background: '#60A5FA' }}></div></div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Other Services</span>
                                                <span style={{ fontWeight: 600 }}>$1,425 (10%)</span>
                                            </div>
                                            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '10%', background: '#93C5FD' }}></div></div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{ color: '#6B7280' }}>Total Gross Bookings</span>
                                        <span style={{ fontWeight: 700, color: '#1F2937' }}>124</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Recent Payouts */}
                            <div className="payouts-section">
                                <div className="section-header" style={{ marginBottom: '1rem' }}>
                                    <h3 className="section-title">Recent Payouts</h3>
                                    <button className="text-btn-blue">Download CSV</button>
                                </div>
                                <div className="table-container">
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Transaction ID</th>
                                                <th>Payout Date</th>
                                                <th>Bank Account</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { id: '#TRX-9482183', date: 'Oct 24, 2023', bank: '**** 4242', amount: '$1,240.00', status: 'Completed' },
                                                { id: '#TRX-9482182', date: 'Oct 17, 2023', bank: '**** 4242', amount: '$980.50', status: 'Completed' },
                                                { id: '#TRX-9482181', date: 'Oct 10, 2023', bank: '**** 4242', amount: '$1,105.20', status: 'In-Progress' },
                                            ].map((trx, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ color: '#6B7280' }}>{trx.id}</td>
                                                    <td style={{ fontWeight: 500 }}>{trx.date}</td>
                                                    <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaCreditCard color="#9CA3AF" /> {trx.bank}</td>
                                                    <td style={{ fontWeight: 700 }}>{trx.amount}</td>
                                                    <td>
                                                        <span className={`status-badge ${trx.status === 'Completed' ? 'status-green' : 'status-blue'}`}>
                                                            {trx.status}
                                                        </span>
                                                    </td>
                                                    <td><FaFileInvoiceDollar style={{ color: '#9CA3AF', cursor: 'pointer' }} title="View Receipt" /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <span className="text-btn-blue" style={{ cursor: 'pointer' }}>View all transaction history ›</span>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* --- CATEGORY MODAL (Moved to root for global access) --- */}
                {showCatModal && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 10001
                    }}>
                        <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: '500px', borderRadius: '16px', padding: '2rem' }}>
                            <h3>{catForm.level === 0 ? 'New Parent Category' : catForm.level === 1 ? 'New Sub-category' : 'New Service (Co-category)'}</h3>

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label className="form-label">Name</label>
                                <input className="form-input" value={catForm.name || ''} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="Enter name" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Icon (Emoji ya Small Icon)</label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <input className="form-input" value={catForm.icon || ''} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} placeholder="e.g. 🚿 or URL" style={{ flex: '1 1 auto' }} />

                                    <button className="profile-btn" style={{ width: 'auto', background: '#6366f1' }} onClick={() => {
                                        setPickingFor('category-icon');
                                        setShowGalleryModal(true);
                                    }}>Gallery</button>

                                    <label className="profile-btn" style={{ width: 'auto', background: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaPlus /> Folder
                                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                                            setPickingFor('category-icon');
                                            handleFolderImageUpload(e);
                                        }} />
                                    </label>
                                </div>
                            </div>

                            {catForm.level === 1 && (
                                <div className="form-group">
                                    <label className="form-label">Cover Image (For Sub-category Grid)</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <input className="form-input" value={catForm.image || ''} onChange={e => setCatForm({ ...catForm, image: e.target.value })} placeholder="Large Image URL" style={{ flex: '1 1 auto' }} />

                                        <button className="profile-btn" style={{ width: 'auto', background: '#6366f1' }} onClick={() => {
                                            setPickingFor('category-image');
                                            setShowGalleryModal(true);
                                        }}>Gallery</button>

                                        <label className="profile-btn" style={{ width: 'auto', background: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaPlus /> Folder
                                            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                                                setPickingFor('category-image');
                                                handleFolderImageUpload(e);
                                            }} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {catForm.level === 2 && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Base Price (₹)</label>
                                        <input className="form-input" type="number" value={catForm.price || ''} onChange={e => setCatForm({ ...catForm, price: e.target.value })} placeholder="e.g. 599" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Service Details (One per line)</label>
                                        <textarea
                                            className="form-input"
                                            style={{ height: '100px', resize: 'none' }}
                                            value={catForm.details || ''}
                                            onChange={e => setCatForm({ ...catForm, details: e.target.value })}
                                            placeholder="e.g. Filter & coil cleaning&#10;Gas pressure check"
                                        />
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                                <button className="profile-btn" style={{ background: '#E5E7EB', color: '#4B5563' }} onClick={() => setShowCatModal(false)}>Cancel</button>
                                <button className="profile-btn" onClick={handleSaveCategory}>{catForm._id ? 'Update Category' : 'Save Category'}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- GALLERY MODAL --- */}
                {
                    showGalleryModal && (
                        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
                            <div className="modal-content" style={{ background: 'white', width: '90%', maxWidth: '800px', height: '80vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0 }}>Media Gallery & Photos</h3>
                                    <button onClick={() => setShowGalleryModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6B7280' }}>×</button>
                                </div>
                                <div className="modal-body" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <input
                                            id="photo-url-input"
                                            className="form-input"
                                            placeholder="Paste Photo URL here..."
                                            style={{ flex: 1, minWidth: '200px' }}
                                        />
                                        <button className="profile-btn" style={{ width: 'auto' }} onClick={async () => {
                                            const input = document.getElementById('photo-url-input');
                                            const url = input.value;
                                            if (url) {
                                                const savedItem = await addToGallery(url);
                                                const finalUrl = savedItem ? savedItem.url : url;

                                                // Sync with form
                                                if (pickingFor === 'category-icon' || pickingFor === 'category') {
                                                    setCatForm(prev => ({ ...prev, icon: finalUrl }));
                                                } else if (pickingFor === 'category-image') {
                                                    setCatForm(prev => ({ ...prev, image: finalUrl }));
                                                } else if (pickingFor === 'section-item') {
                                                    setSectionItem(prev => ({ ...prev, image: finalUrl }));
                                                } else {
                                                    setBannerForm(prev => ({ ...prev, imageUrl: finalUrl }));
                                                }

                                                input.value = '';
                                                setShowGalleryModal(false);
                                                alert('URL added and selected!');
                                            }
                                        }}>Add URL</button>

                                        <label className="profile-btn" style={{ width: 'auto', background: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaPlus /> Folder Upload
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={(e) => {
                                                    handleFolderImageUpload(e);
                                                    setShowGalleryModal(false);
                                                }}
                                            />
                                        </label>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                                        {gallery.length === 0 ? (
                                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                                                <FaImage size={40} style={{ marginBottom: '10px' }} />
                                                <p>Your Gallery is empty. Add some photos!</p>
                                            </div>
                                        ) : (
                                            gallery.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        const url = item.url;
                                                        if (pickingFor === 'category-icon' || pickingFor === 'category') {
                                                            setCatForm(prev => ({ ...prev, icon: url }));
                                                        } else if (pickingFor === 'category-image') {
                                                            setCatForm(prev => ({ ...prev, image: url }));
                                                        } else if (pickingFor === 'section-item') {
                                                            setSectionItem(prev => ({ ...prev, image: url }));
                                                        } else if (pickingFor === 'banner') {
                                                            setBannerForm(prev => ({ ...prev, imageUrl: url }));
                                                        } else {
                                                            // Fallback for any other banner-like pickers
                                                            setBannerForm(prev => ({ ...prev, imageUrl: url }));
                                                        }
                                                        setShowGalleryModal(false);
                                                    }}
                                                    className="gallery-item-card"
                                                    style={{
                                                        aspectRatio: '1',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        border: '2px solid transparent',
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563EB'}
                                                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                                >
                                                    <img src={item.url} alt="Gallery Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer" style={{ padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button className="filter-btn" onClick={() => setShowGalleryModal(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* --- CUSTOM SECTIONS --- */}
                {activeTab === 'Custom Sections' && (
                    <div style={{ padding: '20px' }}>
                        <div className="section-header">
                            <div>
                                <h3 className="section-title">Custom Section Builder</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Create entire sections with multiple services that appear on Home & Profile.</p>
                            </div>
                            <button className="profile-btn" onClick={() => setShowSectionModal(true)}>+ New Section</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            {mySections.map(sec => (
                                <div key={sec._id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h3 style={{ margin: 0 }}>{sec.title}</h3>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleEditSection(sec)} style={{ color: '#2563EB', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                                            <button onClick={() => handleDeleteSection(sec._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{sec.services?.length || 0} items</p>
                                    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                                        {sec.services?.slice(0, 4).map((i, idx) => (
                                            <img key={idx} src={i.image || 'https://via.placeholder.com/50'} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal */}
                        {showSectionModal && (
                            <div className="modal-overlay">
                                <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                                    <h2>Create Custom Section</h2>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Section Title (e.g. Premium Spa Package)"
                                        value={sectionForm.title}
                                        onChange={e => setSectionForm({ ...sectionForm, title: e.target.value })}
                                        style={{ marginBottom: '20px' }}
                                    />

                                    <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                        <h4>Add Item</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <input type="text" className="form-input" placeholder="Service Name" value={sectionItem.name || ''} onChange={e => setSectionItem({ ...sectionItem, name: e.target.value })} />
                                            <input type="number" className="form-input" placeholder="Price" value={sectionItem.price || ''} onChange={e => setSectionItem({ ...sectionItem, price: e.target.value })} />
                                            <input type="text" className="form-input" placeholder="Badge (e.g. FLASH SALE)" value={sectionItem.badge || ''} onChange={e => setSectionItem({ ...sectionItem, badge: e.target.value })} />
                                            <input type="text" className="form-input" placeholder="Short Description" value={sectionItem.description || ''} onChange={e => setSectionItem({ ...sectionItem, description: e.target.value })} />
                                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <input type="text" className="form-input" placeholder="Image URL (or pick below)" value={sectionItem.image || ''} onChange={e => setSectionItem({ ...sectionItem, image: e.target.value })} style={{ flex: 1 }} />
                                                {sectionItem.image && <img src={sectionItem.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ddd' }} alt="Preview" />}
                                            </div>
                                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => {
                                                        setPickingFor('section-item');
                                                        setShowGalleryModal(true);
                                                    }}
                                                    className="filter-btn"
                                                    style={{ flex: 1, justifyContent: 'center' }}
                                                >
                                                    <FaImage /> Gallery
                                                </button>
                                                <label className="filter-btn" style={{ flex: 1, justifyContent: 'center', background: '#059669', color: 'white', cursor: 'pointer' }}>
                                                    <FaPlus /> Folder
                                                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                                                        setPickingFor('section-item');
                                                        handleFolderImageUpload(e);
                                                    }} />
                                                </label>
                                            </div>
                                            <button onClick={addSectionItem} style={{ background: editingItemIdx !== null ? '#059669' : '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', gridColumn: '1 / -1' }}>
                                                {editingItemIdx !== null ? 'Update Item' : 'Add Item to List'}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {sectionForm.items.map((it, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{it.name} - ₹{it.price}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{it.badge && `[${it.badge}] `}{it.description}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <span onClick={() => {
                                                        setSectionItem({
                                                            name: it.name || '',
                                                            price: it.price || '',
                                                            image: it.image || '',
                                                            description: it.description || '',
                                                            badge: it.badge || ''
                                                        });
                                                        setEditingItemIdx(i);
                                                    }} style={{ color: '#2563EB', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</span>
                                                    <span
                                                        onClick={() => {
                                                            if (editingItemIdx === i) { setEditingItemIdx(null); setSectionItem({ name: '', price: '', image: '', description: '', badge: '' }); }
                                                            setSectionForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }))
                                                        }}
                                                        style={{ color: 'red', cursor: 'pointer', fontSize: '1.1rem' }}
                                                    >
                                                        ×
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="modal-actions">
                                        <button className="cancel-btn" onClick={() => { setShowSectionModal(false); setSectionForm({ title: '', items: [], _id: null }); setSectionItem({ name: '', price: '', image: '', description: '', badge: '' }); setEditingItemIdx(null); }}>Cancel</button>
                                        <button className="save-btn" onClick={handleSaveSection}>{sectionForm._id ? 'Update Section' : 'Publish Section'}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
