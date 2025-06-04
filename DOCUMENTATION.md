
# TrueView Reality - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Local Development Setup](#local-development-setup)
4. [Backend Setup](#backend-setup)
5. [Project Structure](#project-structure)
6. [Features & Functionality](#features--functionality)
7. [Design & Theming](#design--theming)
8. [Database Integration](#database-integration)
9. [Property Management](#property-management)
10. [User Experience Features](#user-experience-features)
11. [Independent Analytics](#independent-analytics)
12. [Deployment Guide](#deployment-guide)

## Project Overview

TrueView Reality is a cutting-edge, futuristic real estate platform that combines modern technology with elegant design. The platform features a complete full-stack architecture with automatic property synchronization, MySQL database integration, and an independent analytics system.

### Key Features
- **Futuristic Design**: Modern gradient themes with glassmorphism effects
- **Full-Stack Architecture**: Node.js/Express backend with MySQL database
- **Auto Property Sync**: Automatic property loading from file system
- **Independent Analytics**: Self-contained tracking without external dependencies
- **Modal-Based UI**: Property details in responsive popups
- **Smart User Tracking**: LocalStorage-based enquiry management
- **Environment Independent**: Complete local development capability

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom futuristic themes
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Hooks + TanStack React Query
- **Notifications**: Toast system with Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 2
- **CORS**: Cross-origin resource sharing enabled
- **File System**: Automatic image detection and sync

### Development Tools
- **Package Manager**: npm
- **Development Server**: Vite dev server
- **Code Quality**: ESLint, TypeScript strict mode
- **Analytics**: Independent tracking system

## Local Development Setup

### Prerequisites
```bash
# Required software
Node.js (version 16 or higher)
npm (comes with Node.js)
MySQL Server (version 8.0 or higher)
```

### Frontend Setup
```bash
# 1. Clone/download the project
git clone <repository-url>
cd trueview-reality

# 2. Install frontend dependencies
npm install

# 3. Start frontend development server
npm run dev

# Access at: http://localhost:8080
```

### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install backend dependencies
npm install

# 3. Start backend server
npm run dev

# Backend runs on: http://localhost:3001
```

### Database Setup
```sql
-- 1. Create database
CREATE DATABASE trueview_reality;

-- 2. Create enquiries table
USE trueview_reality;

CREATE TABLE enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  property VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create properties table
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  sqft INT NOT NULL,
  status ENUM('active', 'sold', 'pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Property Images Setup
```bash
# Create property images directory
mkdir backend/property-images

# Add property images with naming convention:
# Format: {id}_{name}.{extension}
# Examples:
# 1_luxury_villa.jpg
# 2_modern_apartment.png
# 3_downtown_condo.jpg
```

## Backend Setup

### MySQL Configuration
Update `backend/server.js` with your MySQL credentials:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',      // Update this
  password: 'your_password',  // Update this
  database: 'trueview_reality'
});
```

### API Endpoints

#### Properties API
```javascript
// GET /api/properties - Fetch all active properties
// Response: Array of property objects with auto-synced images

// GET /api/properties/:id/images - Get property image gallery
// Response: Array of image URLs for specific property
```

#### Enquiries API
```javascript
// POST /api/enquiries - Submit new enquiry
// Body: { name, email, phone, message, property }
// Response: Success confirmation
```

### Automatic Property Sync
The backend automatically:
1. Scans `backend/property-images/` directory
2. Extracts property ID from filename
3. Serves images via `/images/` endpoint
4. Updates property records in real-time

## Project Structure

```
trueview-reality/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── Header.tsx       # Navigation with futuristic design
│   │   ├── Footer.tsx       # Footer with company branding
│   │   ├── PropertyCard.tsx # Property display cards
│   │   ├── PropertyDetailsModal.tsx # Property popup details
│   │   ├── EnquiryForm.tsx  # Contact form component
│   │   └── ...              # Other components
│   ├── pages/               # Route components
│   │   ├── Index.tsx        # Homepage with hero section
│   │   ├── ActiveListings.tsx # Properties listing page
│   │   ├── AboutUs.tsx      # Company information
│   │   ├── Contact.tsx      # Contact page
│   │   └── NotFound.tsx     # 404 error page
│   ├── hooks/               # Custom React hooks
│   │   └── useProperties.ts # Property data fetching
│   ├── utils/               # Utility functions
│   │   └── database.ts      # API communication layer
│   └── App.tsx             # Main application component
├── backend/
│   ├── server.js           # Express server with MySQL
│   ├── package.json        # Backend dependencies
│   └── property-images/    # Auto-synced property images
├── public/
│   ├── favicon.ico         # Site favicon
│   └── analytics.js        # Independent tracking script
└── setup-instructions.md   # Detailed setup guide
```

## Features & Functionality

### 1. Property Management System
- **Auto-Sync**: Properties automatically load from file system
- **Real-time Updates**: Changes reflect immediately on frontend
- **Image Management**: Multiple images per property support
- **Status Tracking**: Active, sold, and pending property states

### 2. Modal-Based Property Details
- **Responsive Design**: Works seamlessly on all devices
- **Rich Content**: Extended property information and features
- **Image Galleries**: Multiple property photos with thumbnails
- **Action Buttons**: Direct enquiry and viewing requests

### 3. Smart User Tracking
```javascript
// LocalStorage-based enquiry tracking
localStorage.setItem('enquirySubmitted', 'true');

// Auto-popup control (1-minute intervals)
// Disabled after user submits enquiry
const hasSubmitted = localStorage.getItem('enquirySubmitted') === 'true';
```

### 4. Database Integration
- **MySQL Backend**: Production-ready database storage
- **Real-time Sync**: 30-second property refresh intervals
- **Data Persistence**: All enquiries saved to database
- **Error Handling**: Graceful fallbacks for offline mode

## Design & Theming

### Color Palette
```css
/* Primary Colors */
--cyan: #06b6d4      /* Primary accent */
--purple: #8b5cf6    /* Secondary accent */
--pink: #ec4899      /* Tertiary accent */
--slate: #0f172a     /* Dark backgrounds */

/* Gradients */
background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
```

### Design Elements
- **Glassmorphism**: Transparent cards with backdrop blur
- **Gradient Text**: Multi-color text effects
- **Neon Glows**: Subtle shadow effects
- **Animated Gradients**: Moving background patterns
- **Hover Effects**: Transform and glow animations

### Responsive Breakpoints
```css
/* Mobile First Approach */
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Small desktops */
xl: 1280px   /* Large desktops */
2xl: 1536px  /* Extra large screens */
```

## Database Integration

### Enquiries Table Schema
```sql
CREATE TABLE enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  property VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Properties Table Schema
```sql
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  sqft INT NOT NULL,
  status ENUM('active', 'sold', 'pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Integration
```typescript
// Frontend API calls
const response = await fetch('http://localhost:3001/api/properties');
const properties = await response.json();

// Backend MySQL queries
const query = 'SELECT * FROM properties WHERE status = "active"';
db.query(query, (err, results) => { /* handle results */ });
```

## Property Management

### Image File Naming Convention
```bash
# Format: {id}_{descriptive_name}.{extension}
1_luxury_villa_downtown.jpg
2_modern_apartment_skyview.png
3_cozy_townhouse_suburbs.jpg
4_penthouse_city_center.webp
```

### Automatic Detection Process
1. **File Scan**: Backend scans property-images directory
2. **ID Extraction**: Extracts property ID from filename
3. **Database Sync**: Updates or creates property records
4. **Frontend Update**: Properties refresh every 30 seconds
5. **Image Serving**: Files served via `/images/` endpoint

### Adding New Properties
```bash
# 1. Add image to backend/property-images/
cp new_property.jpg backend/property-images/5_modern_loft.jpg

# 2. Property automatically appears on frontend
# 3. Update property details in database if needed
```

## User Experience Features

### Auto-Popup System
```javascript
// Displays enquiry form every 60 seconds
// Automatically disabled after user submits enquiry
useEffect(() => {
  if (hasSubmittedEnquiry) return;
  
  const interval = setInterval(() => {
    setShowAutoPopup(true);
  }, 60000);
  
  return () => clearInterval(interval);
}, [hasSubmittedEnquiry]);
```

### Search and Filtering
- **Location Search**: Real-time location filtering
- **Property Type**: House, apartment, condo, townhouse
- **Price Range**: Customizable price filtering
- **Advanced Filters**: Bedrooms, bathrooms, square footage

### Modal Interactions
- **Property Details**: Comprehensive property information
- **Image Galleries**: Multiple photos with navigation
- **Enquiry Forms**: Context-aware contact forms
- **Responsive Design**: Optimized for all screen sizes

## Independent Analytics

### Local Tracking System
The platform includes a self-contained analytics system:

```javascript
// Track page views
TrueViewAnalytics.trackPageView('/active-listings');

// Track user interactions
TrueViewAnalytics.trackEvent('property', 'view_details', 'luxury_villa');

// Track form submissions
TrueViewAnalytics.trackEvent('form', 'submit', 'enquiry_form');
```

### Analytics Features
- **Page View Tracking**: Automatic page navigation tracking
- **Event Tracking**: Button clicks, form submissions, interactions
- **Local Storage**: Data stored in browser localStorage
- **Privacy Compliant**: No external tracking services
- **Data Retention**: Configurable data retention policies

### Analytics Data Structure
```javascript
{
  "pageViews": [
    {
      "page": "/active-listings",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "events": [
    {
      "category": "property",
      "action": "view_details",
      "label": "luxury_villa",
      "timestamp": "2024-01-15T10:31:00.000Z"
    }
  ]
}
```

## Deployment Guide

### Frontend Deployment
```bash
# 1. Build production version
npm run build

# 2. Deploy 'dist' folder to:
# - Netlify
# - Vercel
# - GitHub Pages
# - Any static hosting service
```

### Backend Deployment
```bash
# 1. Choose hosting service:
# - DigitalOcean
# - AWS EC2
# - Heroku
# - Railway

# 2. Set up MySQL database
# 3. Update database connection settings
# 4. Deploy backend code
# 5. Configure environment variables
```

### Environment Variables
```bash
# Backend Environment Variables
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=trueview_reality
PORT=3001

# Frontend Environment Variables (optional)
VITE_API_URL=http://localhost:3001/api
```

### SSL and Security
```bash
# Recommended security measures:
# 1. Enable HTTPS with SSL certificates
# 2. Configure CORS properly for production
# 3. Set up database connection pooling
# 4. Enable MySQL query logging
# 5. Implement rate limiting
```

## Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Lazy loading and compression
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Browser caching for static assets

### Backend Optimizations
- **Database Indexing**: Optimized queries with indexes
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis caching for frequently accessed data
- **Image Compression**: Automatic image optimization

### Loading Performance
```javascript
// Property data caching
const { data, isLoading, error } = useQuery({
  queryKey: ['properties'],
  queryFn: fetchProperties,
  staleTime: 30000, // 30 seconds
  cacheTime: 300000 // 5 minutes
});
```

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check MySQL service status
sudo systemctl status mysql

# Restart MySQL service
sudo systemctl restart mysql

# Check connection settings in backend/server.js
```

#### Property Images Not Loading
```bash
# Verify image directory exists
ls -la backend/property-images/

# Check file permissions
chmod 644 backend/property-images/*

# Verify naming convention
# Correct: 1_property_name.jpg
# Incorrect: property_name_1.jpg
```

#### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite

# Check for TypeScript errors
npm run build
```

### Performance Issues
```bash
# Monitor backend performance
# Add logging to server.js for query timing

# Check database performance
SHOW PROCESSLIST;
EXPLAIN SELECT * FROM properties;

# Optimize images
# Use WebP format for better compression
# Implement lazy loading for property images
```

## Future Enhancements

### Planned Features
1. **Virtual Reality Tours**: 360° property viewing
2. **AI-Powered Recommendations**: Machine learning property matching
3. **Blockchain Integration**: Secure property transactions
4. **Mobile App**: React Native companion app
5. **Advanced Analytics**: Real-time dashboards
6. **Multi-language Support**: Internationalization
7. **Social Features**: Property sharing and reviews
8. **Payment Integration**: Online property payments

### Technical Improvements
1. **GraphQL API**: More efficient data fetching
2. **Microservices**: Scalable backend architecture
3. **CDN Integration**: Global content delivery
4. **Progressive Web App**: Offline functionality
5. **WebSocket Integration**: Real-time updates
6. **Docker Containers**: Simplified deployment
7. **Kubernetes**: Container orchestration
8. **Monitoring**: Application performance monitoring

This documentation covers the complete TrueView Reality platform with all recent updates including the futuristic design, backend integration, automatic property synchronization, and independent analytics system. The platform is now fully production-ready with comprehensive local development capabilities.
