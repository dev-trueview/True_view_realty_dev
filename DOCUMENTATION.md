
# EliteHomes Real Estate Website - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Local Development Setup](#local-development-setup)
4. [Project Structure](#project-structure)
5. [Pages Documentation](#pages-documentation)
6. [Components Documentation](#components-documentation)
7. [Features & Logic](#features--logic)
8. [User Interaction Tracking](#user-interaction-tracking)
9. [Styling & Design](#styling--design)
10. [Data Models](#data-models)
11. [User Interactions](#user-interactions)
12. [Responsive Design](#responsive-design)
13. [Future Enhancements](#future-enhancements)

## Project Overview

EliteHomes is a modern, responsive real estate website designed for property dealer agencies. The website provides a professional platform for showcasing properties, handling enquiries, and connecting potential buyers with real estate agents. The application is fully environment-independent and can be run locally on any computer.

### Key Features
- Dynamic property carousel with sold properties
- Active property listings with filtering
- Property details displayed in modal popups
- Enquiry management system with user tracking
- Auto-popup functionality for lead generation (respects user preferences)
- Professional responsive design
- Complete navigation system
- Environment-independent codebase

## Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM 6.26.2
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Lucide React 0.462.0
- **UI Components**: Radix UI primitives via shadcn/ui
- **Notifications**: Toast system with Sonner
- **Data Fetching**: TanStack React Query 5.56.2
- **Local Storage**: Browser localStorage for user preferences

## Local Development Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Step-by-Step Installation

1. **Download/Clone the Project**
   ```bash
   # If using Git
   git clone <repository-url>
   cd elitehomes-website
   
   # Or extract the downloaded ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:8080`
   - The application will automatically reload when you make changes

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Configuration

The application is completely environment-independent and doesn't require:
- External APIs
- Database connections
- Environment variables
- Third-party services

All data is stored locally using:
- Static property data arrays
- Browser localStorage for user preferences
- Mock data for demonstrations

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── EnquiryForm.tsx  # Enquiry form component
│   ├── Footer.tsx       # Website footer
│   ├── Header.tsx       # Navigation header
│   ├── PropertyCard.tsx # Property display card
│   ├── PropertyCarousel.tsx # Hero carousel
│   ├── PropertyDetailsModal.tsx # Property details popup
│   ├── TestimonialsSection.tsx # Customer testimonials
│   └── WhyChooseUsSection.tsx # Features section
├── pages/               # Route components
│   ├── Index.tsx        # Homepage
│   ├── ActiveListings.tsx # Property listings page
│   ├── AboutUs.tsx      # Company information
│   ├── Contact.tsx      # Contact page
│   └── NotFound.tsx     # 404 error page
├── hooks/               # Custom React hooks
└── App.tsx             # Main application component
```

## Pages Documentation

### 1. Homepage (Index.tsx)
**Route**: `/`

#### Components Used
- Header: Navigation component
- PropertyCarousel: Hero section with sold properties
- PropertyCard: Individual property display
- PropertyDetailsModal: Property details popup
- EnquiryForm: Contact form functionality
- TestimonialsSection: Customer reviews
- WhyChooseUsSection: Company features
- Footer: Website footer

#### State Management
```typescript
const [showEnquiryModal, setShowEnquiryModal] = useState(false);
const [showAutoPopup, setShowAutoPopup] = useState(false);
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [selectedProperty, setSelectedProperty] = useState<any>(null);
const [searchLocation, setSearchLocation] = useState("");
const [priceRange, setPriceRange] = useState("");
const [propertyType, setPropertyType] = useState("");
const [hasSubmittedEnquiry, setHasSubmittedEnquiry] = useState(false);
```

#### Key Features
- **Auto Popup System**: Displays enquiry form every 60 seconds (disabled after user submits enquiry)
- **Property Search**: Location, price range, and type filtering
- **Property Grid**: Displays 6 active properties
- **Modal Management**: Handles enquiry form and property details popups
- **User Tracking**: Tracks user enquiry submissions

### 2. Active Listings Page (ActiveListings.tsx)
**Route**: `/active-listings`

#### Functionality
- Displays all available properties (8 properties)
- Advanced search and filtering
- Property details modal integration
- Enquiry form integration
- Responsive property grid layout

#### Search Logic
```typescript
const filteredProperties = activeProperties.filter(property => {
  const matchesLocation = !searchLocation || 
    property.location.toLowerCase().includes(searchLocation.toLowerCase());
  const matchesType = !propertyType || property.type === propertyType;
  return matchesLocation && matchesType;
});
```

### 3. About Us Page (AboutUs.tsx)
**Route**: `/about`

#### Sections
1. **Hero Section**: Company introduction
2. **Statistics Cards**: Key metrics display
3. **Mission Statement**: Company values
4. **Team Section**: Staff profiles

### 4. Contact Page (Contact.tsx)
**Route**: `/contact`

#### Features
- Contact information cards
- Contact form with validation
- Interactive map placeholder
- Business benefits list

## Components Documentation

### 1. PropertyCard Component (PropertyCard.tsx)

#### Props Interface
```typescript
interface PropertyCardProps {
  property: {
    id: number;
    image: string;
    price: string;
    location: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
  };
  onEnquiry: () => void;
  onViewDetails: () => void;
}
```

#### Features
- Hover animations and image scaling
- Property type badge
- Property statistics icons
- "Get Enquiry" button
- Clickable areas for viewing details (opens modal instead of navigation)

### 2. PropertyDetailsModal Component (PropertyDetailsModal.tsx)

#### Features
- **Large Modal Display**: Full property information in popup
- **Image Gallery**: Main image with thumbnail grid
- **Property Statistics**: Bedrooms, bathrooms, sqft, year built
- **Detailed Description**: Extended property information
- **Features List**: Property amenities and features
- **Neighborhood Information**: Walk score, transit, schools, etc.
- **Action Buttons**: Get Enquiry and Schedule Viewing

#### Extended Property Data
```typescript
const extendedProperty = {
  ...property,
  images: string[];
  yearBuilt: number;
  description: string;
  features: string[];
  neighborhood: {
    walkScore: number;
    transitScore: number;
    bikeScore: number;
    schools: string;
    shopping: string;
    dining: string;
  };
};
```

### 3. EnquiryForm Component (EnquiryForm.tsx)

#### Form State & Validation
```typescript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  message: ""
});
const [errors, setErrors] = useState<any>({});
```

#### Features
- Real-time validation
- Property context display
- localStorage integration for tracking
- Form reset on submission
- Responsive design

## Features & Logic

### 1. User Interaction Tracking

#### Enquiry Submission Tracking
```typescript
// Check localStorage for enquiry submission status
useEffect(() => {
  const enquirySubmitted = localStorage.getItem('enquirySubmitted');
  if (enquirySubmitted === 'true') {
    setHasSubmittedEnquiry(true);
  }
}, []);

// Set flag on form submission
const handleFormSubmit = (formData: any) => {
  localStorage.setItem('enquirySubmitted', 'true');
  setHasSubmittedEnquiry(true);
  // ... rest of submission logic
};
```

#### Auto Popup Logic (Respects User Preferences)
```typescript
// Auto popup every minute (only if user hasn't submitted enquiry)
useEffect(() => {
  if (hasSubmittedEnquiry) return;

  const interval = setInterval(() => {
    setShowAutoPopup(true);
  }, 60000); // 1 minute

  return () => clearInterval(interval);
}, [hasSubmittedEnquiry]);
```

### 2. Modal-Based Property Details

#### Implementation Benefits
- **No Page Navigation**: Faster user experience
- **Contextual Information**: User stays on current page
- **Better Mobile Experience**: Smoother interactions on mobile devices
- **State Preservation**: Search filters and scroll position maintained

#### Modal Triggers
```typescript
const handleViewDetails = (property: any) => {
  setSelectedProperty(property);
  setShowDetailsModal(true);
};

const handleEnquiry = (property: any) => {
  setSelectedProperty(property);
  setShowEnquiryModal(true);
};
```

### 3. Environment Independence

#### Local Data Storage
- **Property Data**: Stored in component state arrays
- **User Preferences**: Browser localStorage
- **Form Submissions**: Console logging (easily replaceable with API calls)

#### No External Dependencies
- **Images**: Uses placeholder.svg for all property images
- **APIs**: No external API calls required
- **Database**: No database connections needed
- **Authentication**: Simple localStorage-based tracking

## User Interaction Tracking

### localStorage Integration

#### Data Stored
```typescript
// User enquiry submission status
localStorage.setItem('enquirySubmitted', 'true');
const enquirySubmitted = localStorage.getItem('enquirySubmitted');
```

#### Benefits
- **Persistent User Preferences**: Survives browser sessions
- **Auto-popup Control**: Prevents spam for users who already enquired
- **Easy Implementation**: No backend required
- **Privacy Compliant**: Only stores minimal user interaction data

### User Experience Improvements

#### Auto-popup Behavior
1. **First Visit**: Popup appears after 1 minute
2. **After Enquiry**: No more auto-popups for that user
3. **Manual Triggers**: Users can still access enquiry forms manually
4. **Session Persistence**: Preference maintained across browser sessions

## Styling & Design

### 1. Color Scheme
- **Primary**: Blue (#2563eb - blue-600)
- **Secondary**: Gray (#6b7280 - gray-500)
- **Background**: White (#ffffff)
- **Text**: Dark gray (#1f2937 - gray-800)
- **Accent**: Green for sold properties (#22c55e - green-500)

### 2. Modal Design
- **Overlay**: Semi-transparent black backdrop
- **Content**: White background with rounded corners
- **Sizing**: Responsive (max-w-4xl for property details)
- **Scrolling**: Vertical scroll for long content
- **Animations**: Smooth fade in/out transitions

## Data Models

### 1. Property Interface
```typescript
interface Property {
  id: number;
  image: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}
```

### 2. Extended Property Interface (Modal Details)
```typescript
interface PropertyDetails extends Property {
  images: string[];
  yearBuilt: number;
  description: string;
  features: string[];
  neighborhood: {
    walkScore: number;
    transitScore: number;
    bikeScore: number;
    schools: string;
    shopping: string;
    dining: string;
  };
}
```

## User Interactions

### 1. Property Browsing Flow (Updated)
1. User lands on homepage
2. Views sold properties in carousel
3. Browses active properties
4. Uses search/filter to narrow results
5. **Clicks on property card or image** → **Opens details modal**
6. Views detailed property information in modal
7. Clicks "Get Enquiry" → Opens enquiry form
8. Submits enquiry → Auto-popup disabled for future visits

### 2. Modal Interaction Flow
1. **Property Card Click** → Property details modal opens
2. **Modal Content**: Scrollable detailed information
3. **Action Buttons**: Get Enquiry or Schedule Viewing
4. **Modal Close**: Click outside, X button, or ESC key
5. **Enquiry Button** → Closes details modal, opens enquiry modal

## Responsive Design

### 1. Modal Responsiveness
- **Mobile**: Full-width modals with vertical stacking
- **Tablet**: Balanced layout with appropriate spacing
- **Desktop**: Multi-column layouts with optimal viewing

### 2. Property Cards
- **Mobile**: Single column grid
- **Tablet**: 2-column grid
- **Desktop**: 3-4 column grid depending on page

## Technical Implementation Details

### 1. State Management
- **Local State**: React hooks for component state
- **Persistent State**: localStorage for user preferences
- **Modal State**: Separate state variables for different modals

### 2. Performance Considerations
- **Modal Lazy Loading**: Content generated on-demand
- **Image Optimization**: Placeholder images for consistent loading
- **State Cleanup**: Proper cleanup of intervals and event listeners

### 3. Error Handling
- **Form Validation**: Real-time validation with user feedback
- **localStorage Fallbacks**: Graceful handling of localStorage unavailability
- **Modal Error States**: Proper error boundaries for modal content

## Future Enhancements

### 1. Backend Integration
- Replace localStorage with user accounts
- Property management dashboard
- Real-time enquiry notifications
- Email integration for form submissions

### 2. Advanced Features
- Property comparison in modals
- Virtual tour integration within modals
- Advanced filtering with instant results
- Social sharing from property modals

### 3. Performance Optimizations
- Image lazy loading and optimization
- Modal content caching
- Progressive web app features
- SEO improvements for modal content

### 4. User Experience
- Modal keyboard navigation
- Touch gestures for mobile modals
- Advanced user preference tracking
- Personalized property recommendations

## Deployment Instructions

### 1. Local Development
```bash
npm install
npm run dev
```

### 2. Production Build
```bash
npm run build
# Serve the 'dist' folder using any static file server
```

### 3. Static Hosting
The built application can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static file hosting service

### 4. Server Requirements
- **None**: Fully client-side application
- **Web Server**: Any server capable of serving static files
- **Database**: Not required (uses localStorage)
- **APIs**: Not required (self-contained)

This documentation covers all aspects of the updated EliteHomes real estate website, including the new modal-based property details system, user interaction tracking, and complete local development setup instructions.
