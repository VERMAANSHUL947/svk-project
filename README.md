# 🏠 SVK Home Services Platform

A comprehensive home services booking platform built with Next.js, offering various services like plumbing, electrical work, AC repair, appliance repair, and more. The platform connects users with verified service partners and provides a seamless booking experience.

## ✨ Features

### 🎯 User Features
- **Service Booking**: Browse and book various home services
- **User Authentication**: Secure login/signup with OTP verification
- **Profile Management**: Manage personal information and view booking history
- **Cart System**: Add multiple services to cart before checkout
- **Real-time Booking**: Track booking status and service provider details
- **Responsive Design**: Fully responsive UI for all devices

### 👨‍💼 Partner Features
- **Partner Dashboard**: Dedicated dashboard for service partners
- **Booking Management**: View and manage service requests
- **Profile Management**: Update service offerings and availability
- **OTP-based Login**: Secure authentication for partners

### 🔧 Admin Features
- **Admin Dashboard**: Comprehensive admin panel
- **User Management**: Manage users and partners
- **Booking Oversight**: Monitor all bookings and transactions
- **System Configuration**: Configure system settings and parameters

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1.4, React 19.2.3
- **Styling**: CSS Modules, Framer Motion for animations
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, NextAuth.js, OTP verification
- **Email Service**: Nodemailer
- **Icons**: React Icons, Lucide React
- **Notifications**: React Toastify

## 📁 Project Structure

```
svk-project-main/
├── 📂 src/
│   ├── 📂 app/                      # Next.js App Router
│   │   ├── 📂 api/                  # API Routes
│   │   │   ├── 📂 auth/             # Authentication endpoints
│   │   │   ├── 📂 bookings/         # Booking management APIs
│   │   │   ├── 📂 cart/             # Cart operations
│   │   │   ├── 📂 partner/          # Partner-specific APIs
│   │   │   └── 📂 admin/            # Admin APIs
│   │   ├── 📂 admin/                # Admin dashboard pages
│   │   ├── 📂 partner/              # Partner dashboard pages
│   │   ├── 📂 auth/                 # Authentication pages
│   │   ├── 📂 login/                # Login page
│   │   ├── 📂 signup/               # Signup page
│   │   ├── 📂 profile/              # User profile pages
│   │   ├── 📂 bookings/             # Booking pages
│   │   ├── 📂 cart/                 # Shopping cart
│   │   ├── 📂 services/             # Service listing pages
│   │   ├── 📂 plumber/              # Plumber service page
│   │   ├── 📂 electrician/          # Electrician service page
│   │   ├── 📂 ac-repair/            # AC repair service page
│   │   ├── 📂 appliance/            # Appliance repair page
│   │   ├── 📂 styles/               # Global styles
│   │   ├── 📄 layout.js             # Root layout
│   │   ├── 📄 page.js               # Homepage
│   │   └── 📄 globals.css           # Global CSS
│   ├── 📂 components/               # Reusable components
│   │   ├── 📄 Header.js             # Navigation header
│   │   ├── 📄 Footer.js             # Footer component
│   │   ├── 📄 Hero.js               # Hero section
│   │   ├── 📄 Categories.js         # Service categories
│   │   ├── 📄 ServicesGrid.js       # Services grid display
│   │   ├── 📄 ServiceCard.js        # Individual service card
│   │   ├── 📄 OffersSection.js      # Offers and promotions
│   │   ├── 📄 MostBookedSection.js  # Popular services
│   │   ├── 📄 EssentialServicesSection.js
│   │   ├── 📄 HomeRenovationSection.js
│   │   ├── 📄 SolarWaterSection.js
│   │   ├── 📄 WhyChoose.js          # Why choose us section
│   │   └── 📂 admin/                # Admin-specific components
│   ├── 📂 models/                   # MongoDB Models
│   │   ├── 📄 User.js               # User schema
│   │   ├── 📄 Partner.js            # Partner schema
│   │   ├── 📄 Booking.js            # Booking schema
│   │   ├── 📄 Admin.js              # Admin schema
│   │   ├── 📄 Otp.js                # OTP schema
│   │   ├── 📄 EmailOtp.js           # Email OTP schema
│   │   └── 📄 SystemConfig.js       # System configuration
│   ├── 📂 lib/                      # Utility libraries
│   ├── 📂 context/                  # React Context providers
│   ├── 📂 data/                     # Static data files
│   └── 📄 middleware.js             # Next.js middleware
├── 📂 public/                       # Static assets
│   ├── 📂 images/                   # Image assets
│   ├── 📂 uploads/                  # User uploads
│   ├── 🖼️ hero-plumber.png
│   ├── 🖼️ service-*.png            # Service images
│   └── 🖼️ slider*.jpg              # Slider images
├── 📂 data/                         # MongoDB data directory
├── 📂 scripts/                      # Utility scripts
├── 📄 .env.local                    # Environment variables
├── 📄 package.json                  # Dependencies
├── 📄 next.config.mjs               # Next.js configuration
├── 📄 jsconfig.json                 # JavaScript configuration
├── 📄 eslint.config.mjs             # ESLint configuration
├── 📄 start-db.bat                  # Database startup script
├── 📄 test-db.js                    # Database test script
├── 📄 test-email.js                 # Email service test
├── 📄 reset-status.mjs              # Status reset utility
└── 📄 README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd svk-project-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/svk-services
   
   # JWT Secret
   JWT_SECRET=your-secret-key-here
   
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # NextAuth
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # Windows
   start-db.bat
   
   # Linux/Mac
   mongod --dbpath ./data
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Services

- 🔧 **Plumbing** - Pipe repairs, installations, leak fixes
- ⚡ **Electrical** - Wiring, repairs, installations
- ❄️ **AC Repair** - AC servicing, installation, maintenance
- 🔨 **Appliance Repair** - Home appliance repairs
- 🏗️ **Home Renovation** - Complete home makeover services
- 🧹 **Cleaning** - Professional cleaning services
- 🪚 **Carpentry** - Furniture and woodwork services

## 🔐 User Roles

### 1. **Customer**
- Browse and book services
- Manage profile and bookings
- Add services to cart
- Track service status

### 2. **Partner**
- Access partner dashboard
- Manage service requests
- Update availability
- View earnings

### 3. **Admin**
- Full system access
- User and partner management
- Booking oversight
- System configuration

## 🧪 Testing

```bash
# Test database connection
node test-db.js

# Test email service
node test-email.js
```

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, email support@svkservices.com or create an issue in the repository.

---

**Built with ❤️ using Next.js**
