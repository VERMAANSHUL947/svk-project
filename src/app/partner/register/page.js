'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import {
    FaBolt, FaTools, FaBroom, FaHammer, FaPaintRoller, FaFan, FaTree, FaEllipsisH,
    FaCheck, FaArrowRight, FaLock, FaSpinner, FaCamera as Camera
} from 'react-icons/fa';
import { BsShieldCheck, BsClockHistory, BsCashStack } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PartnerRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        experience: 'Less than 1 year',
        serviceCategory: '',
        // Verification
        idCardFront: null,
        idCardBack: null,
        professionalLicense: null,
        // Bank
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: ''
    });

    // Verification State
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationType, setVerificationType] = useState('phone'); // 'phone' or 'email'
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({ ...prev, serviceCategory: category }));
    };

    // --- OTP Logic ---
    const handleSendOtp = async () => {
        if (!formData.phoneNumber) {
            toast.error('Please enter a phone number');
            return;
        }
        setOtpLoading(true);
        try {
            const res = await fetch('/api/partner/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: formData.phoneNumber })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('OTP sent successfully!');
                setVerificationType('phone');
                setShowOtpModal(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to send OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyPhoneOtp = async () => {
        if (!otp) {
            toast.error('Please enter OTP');
            return;
        }
        setOtpLoading(true);
        try {
            const res = await fetch('/api/partner/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: formData.phoneNumber, otp })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Phone verified!');
                setIsPhoneVerified(true);
                setShowOtpModal(false);
                setOtp('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to verify OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const confirmOtp = () => {
        if (verificationType === 'phone') {
            handleVerifyPhoneOtp();
        } else {
            handleVerifyEmailOtp();
        }
    };

    // --- Email OTP Logic ---
    const handleSendEmailOtp = async () => {
        if (!formData.email) {
            toast.error('Please enter an email');
            return;
        }
        setOtpLoading(true); // Reuse loading state or create new one? reuse is fine if sequential
        try {
            const res = await fetch('/api/auth/email/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, type: 'register' })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Email OTP sent! Check your inbox (or console if dev).');
                // We need a way to input Email OTP. 
                // Creating a specific modal or state for it?
                // For simplicity, let's use the same OTP modal but track which one we are verifying.
                setVerificationType('email');
                setShowOtpModal(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to send Email OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (!otp) {
            toast.error('Please enter OTP');
            return;
        }
        setOtpLoading(true);
        try {
            const res = await fetch('/api/auth/email/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Email verified!');
                setIsEmailVerified(true);
                setShowOtpModal(false);
                setOtp('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to verify Email OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    // --- File Upload Logic ---
    const handleFileUploadClick = (field) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    toast.error('File size should be less than 2MB');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    const base64 = readerEvent.target.result;
                    setFormData(prev => ({ ...prev, [field]: base64 }));
                    toast.success('File attached successfully');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // --- Submission ---
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/partner/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Application Submitted Successfully!');
                // Redirect to success page or login
                setTimeout(() => router.push('/partner/login'), 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!isPhoneVerified) {
                toast.warning('Please verify your phone number first.');
                return;
            }
            if (!isEmailVerified) {
                toast.warning('Please verify your email address.');
                return;
            }
            if (!formData.fullName || !formData.email || !formData.serviceCategory) {
                toast.warning('Please fill in all fields.');
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Left Box */}
            <div className={styles.leftPanel}>
                <div>
                    <div className={styles.brand}>
                        <FaBolt /> PartnerPortal
                    </div>
                    <div className={styles.heroText}>
                        <br /> <br />
                        <h1>Grow your <br /> professional <br /> business with us.</h1>
                        <p>Join thousands of professionals who have increased their revenue by 40% in their first three months.</p>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><BsCashStack /></div>
                            <div className={styles.featureContent}>
                                <h3>Weekly Payouts</h3>
                                <p>Reliable earnings deposited directly to your bank account every Friday.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><BsClockHistory /></div>
                            <div className={styles.featureContent}>
                                <h3>24/7 Dedicated Support</h3>
                                <p>Our partner success team is always here to help you navigate your growth.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><BsShieldCheck /></div>
                            <div className={styles.featureContent}>
                                <h3>Verified Leads Only</h3>
                                <p>Stop wasting time on fake requests. We verify every customer before they reach you.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.testimonial}>
                    <p className={styles.testimonialText}>"Joining this portal was the best decision for my plumbing business. The flow of work is steady and the app is seamless."</p>
                    <div className={styles.testimonialAuthor}>
                        <div className={styles.authorAvatar}></div>
                        <div className={styles.authorInfo}>
                            <h4>David Chen</h4>
                            <span>Master Plumber</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className={styles.rightPanel}>
                <div className={styles.header}>
                    Already have an account? <a href="/partner/login" className={styles.link}>Log In</a>
                </div>

                <div className={styles.stepContainer}>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressTitle}>Registration Progress</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                            <span>Step {step} of 3: {step === 1 ? 'Personal & Service Details' : step === 2 ? 'Verification & Compliance' : 'Bank Details'}</span>
                            <span>{Math.round((step / 3) * 100)}% Complete</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className={styles.sectionTitle}><span style={{ color: '#0066ff' }}>1.</span> Basic Information</h2>
                            <p className={styles.helperText} style={{ marginBottom: '1.5rem' }}>Let's start with the basics.</p>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Legal Name</label>
                                <input
                                    className={styles.input}
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Business Email</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`${styles.input} ${isEmailVerified ? styles.verified : ''}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@business.com"
                                        disabled={isEmailVerified}
                                    />
                                    {isEmailVerified ? (
                                        <span className={styles.verifiedBadge}><FaCheck /> Verified</span>
                                    ) : (
                                        <button
                                            className={styles.verifyBtn}
                                            onClick={handleSendEmailOtp}
                                            disabled={!formData.email || otpLoading}
                                        >
                                            {otpLoading ? 'Sending...' : 'Verify'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone Number</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={`${styles.input} ${isPhoneVerified ? styles.verified : ''}`}
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            disabled={isPhoneVerified}
                                        />
                                        {isPhoneVerified ? (
                                            <span className={styles.verifiedBadge}><FaCheck /> Verified</span>
                                        ) : (
                                            <button
                                                className={styles.verifyBtn}
                                                onClick={handleSendOtp}
                                                disabled={!formData.phoneNumber || otpLoading}
                                            >
                                                {otpLoading ? 'Sending...' : 'Verify'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Years of Experience</label>
                                    <select
                                        className={styles.select}
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                    >
                                        <option>Less than 1 year</option>
                                        <option>1-3 years</option>
                                        <option>3-5 years</option>
                                        <option>5+ years</option>
                                    </select>
                                </div>
                            </div>

                            <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}><span style={{ color: '#0066ff' }}>2.</span> Service Category</h2>
                            <div className={styles.categoryGrid}>
                                {[
                                    { id: 'Plumbing', icon: <FaBolt />, label: 'Plumbing' },
                                    { id: 'Electrical', icon: <FaTools />, label: 'Electrical' },
                                    { id: 'Cleaning', icon: <FaBroom />, label: 'Cleaning' },
                                    { id: 'Carpentry', icon: <FaHammer />, label: 'Carpentry' },
                                    { id: 'Painting', icon: <FaPaintRoller />, label: 'Painting' },
                                    { id: 'HVAC', icon: <FaFan />, label: 'HVAC' },
                                    { id: 'Gardening', icon: <FaTree />, label: 'Gardening' },
                                    { id: 'Other', icon: <FaEllipsisH />, label: 'Other' }
                                ].map((cat) => (
                                    <div
                                        key={cat.id}
                                        className={`${styles.categoryCard} ${formData.serviceCategory === cat.id ? styles.selected : ''}`}
                                        onClick={() => handleCategorySelect(cat.id)}
                                    >
                                        <span className={styles.categoryIcon}>{cat.icon}</span>
                                        <span>{cat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className={styles.sectionTitle}><span style={{ color: '#0066ff' }}>3.</span> Identity Verification</h2>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Upload ID Card (Front)</label>
                                <div
                                    className={`${styles.fileUploadArea} ${formData.idCardFront ? styles.hasFile : ''}`}
                                    onClick={() => handleFileUploadClick('idCardFront')}
                                    style={formData.idCardFront ? { backgroundImage: `url(${formData.idCardFront})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '180px' } : {}}
                                >
                                    {formData.idCardFront ? null : (
                                        <div className={styles.uploadPlaceholder}>
                                            <Camera size={32} />
                                            <span>Click to Upload Front of ID</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Upload ID Card (Back)</label>
                                <div
                                    className={`${styles.fileUploadArea} ${formData.idCardBack ? styles.hasFile : ''}`}
                                    onClick={() => handleFileUploadClick('idCardBack')}
                                    style={formData.idCardBack ? { backgroundImage: `url(${formData.idCardBack})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '180px' } : {}}
                                >
                                    {formData.idCardBack ? null : (
                                        <div className={styles.uploadPlaceholder}>
                                            <Camera size={32} />
                                            <span>Click to Upload Back of ID</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}><span style={{ color: '#0066ff' }}>4.</span> Professional Certification</h2>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Upload License or Certificate</label>
                                <div
                                    className={`${styles.fileUploadArea} ${formData.professionalLicense ? styles.hasFile : ''}`}
                                    onClick={() => handleFileUploadClick('professionalLicense')}
                                    style={formData.professionalLicense ? { backgroundImage: `url(${formData.professionalLicense})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '180px' } : {}}
                                >
                                    {formData.professionalLicense ? null : (
                                        <div className={styles.uploadPlaceholder}>
                                            <Camera size={32} />
                                            <span>Click to Upload Document</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className={styles.sectionTitle}><span style={{ color: '#0066ff' }}>5.</span> Payout Information</h2>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Account Holder Name</label>
                                <input
                                    className={styles.input}
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Bank Name</label>
                                <input
                                    className={styles.input}
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Account Number</label>
                                    <input
                                        className={styles.input}
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleInputChange}
                                        type="password"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>IFSC / SWIFT Code</label>
                                    <input
                                        className={styles.input}
                                        name="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#0369a1' }}>
                                    <FaLock /> All data is encrypted and stored securely (PCI DSS Compliant)
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        {step > 1 ? (
                            <button className={styles.backBtn} onClick={prevStep}>Previous</button>
                        ) : (
                            <div></div> // Spacer
                        )}

                        {step < 3 ? (
                            <button className={styles.nextBtn} onClick={nextStep} disabled={step === 1 && (!isPhoneVerified || !isEmailVerified)}>
                                Next Step <FaArrowRight />
                            </button>
                        ) : (
                            <button className={styles.nextBtn} onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Application'} <FaArrowRight />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Verify {verificationType === 'phone' ? 'Phone Number' : 'Email Address'}</h3>
                        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#64748b' }}>
                            Enter the code sent to {verificationType === 'phone' ? formData.phoneNumber : formData.email}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <input
                                className={`${styles.input} ${styles.otpInput}`}
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                            />
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>
                            (Use 123456 for testing)
                        </p>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button
                                className={styles.backBtn}
                                style={{ flex: 1 }}
                                onClick={() => setShowOtpModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.nextBtn}
                                style={{ flex: 1, justifyContent: 'center' }}
                                onClick={confirmOtp}
                                disabled={otpLoading}
                            >
                                {otpLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
