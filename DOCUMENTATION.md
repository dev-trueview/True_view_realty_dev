
# EliteHomes Real Estate Website - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Pages Documentation](#pages-documentation)
5. [Components Documentation](#components-documentation)
6. [Features & Logic](#features--logic)
7. [Styling & Design](#styling--design)
8. [Data Models](#data-models)
9. [User Interactions](#user-interactions)
10. [Responsive Design](#responsive-design)
11. [Future Enhancements](#future-enhancements)

## Project Overview

EliteHomes is a modern, responsive real estate website designed for property dealer agencies. The website provides a professional platform for showcasing properties, handling enquiries, and connecting potential buyers with real estate agents.

### Key Features
- Dynamic property carousel with sold properties
- Active property listings with filtering
- Enquiry management system
- Auto-popup functionality for lead generation
- Professional responsive design
- Complete navigation system

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
│   ├── TestimonialsSection.tsx # Customer testimonials
│   └── WhyChooseUsSection.tsx # Features section
├── pages/               # Route components
│   ├── Index.tsx        # Homepage
│   ├── ActiveListings.tsx # Property listings page
│   ├── AboutUs.tsx      # Company information
│   ├── Contact.tsx      # Contact page
│   ├── PropertyDetails.tsx # Individual property page
│   └── NotFound.tsx     # 404 error page
├── hooks/               # Custom React hooks
└── App.tsx             # Main application component
```

## Pages Documentation

### 1. Homepage (Index.tsx)
**Route**: `/`
**File Size**: 241 lines (requires refactoring)

#### Components Used
- Header: Navigation component
- PropertyCarousel: Hero section with sold properties
- PropertyCard: Individual property display
- EnquiryForm: Contact form functionality
- TestimonialsSection: Customer reviews
- WhyChooseUsSection: Company features
- Footer: Website footer

#### State Management
```typescript
const [showEnquiryModal, setShowEnquiryModal] = useState(false);
const [showAutoPopup, setShowAutoPopup] = useState(false);
const [selectedProperty, setSelectedProperty] = useState<any>(null);
const [searchLocation, setSearchLocation] = useState("");
const [priceRange, setPriceRange] = useState("");
const [propertyType, setPropertyType] = useState("");
```

#### Key Features
- **Auto Popup System**: Displays enquiry form every 60 seconds
- **Property Search**: Location, price range, and type filtering
- **Property Grid**: Displays 6 active properties
- **Modal Management**: Handles enquiry form popups

#### Data Structure
Properties array contains:
```typescript
{
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

### 2. Active Listings Page (ActiveListings.tsx)
**Route**: `/active-listings`
**File Size**: 210 lines (requires refactoring)

#### Functionality
- Displays all available properties
- Advanced search and filtering
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

### 3. Property Details Page (PropertyDetails.tsx)
**Route**: `/property/:id`
**File Size**: 234 lines (requires refactoring)

#### Features
- Dynamic property loading based on URL parameter
- Image gallery with main and thumbnail images
- Detailed property statistics
- Feature list display
- Neighborhood information
- Enquiry and viewing scheduling buttons

#### Property Stats Display
- Bedrooms count with bed icon
- Bathrooms count with bath icon
- Square footage with square icon
- Year built with calendar icon

#### Neighborhood Data
```typescript
neighborhood: {
  walkScore: number;     // 0-100 rating
  transitScore: number;  // 0-100 rating
  bikeScore: number;     // 0-100 rating
  schools: string;       // Quality rating
  shopping: string;      // Quality rating
  dining: string;        // Quality rating
}
```

### 4. About Us Page (AboutUs.tsx)
**Route**: `/about`

#### Sections
1. **Hero Section**: Company introduction
2. **Statistics Cards**: Key metrics display
3. **Mission Statement**: Company values
4. **Team Section**: Staff profiles

#### Statistics Data
```typescript
const stats = [
  { icon: Home, number: "500+", label: "Properties Sold" },
  { icon: Users, number: "1000+", label: "Happy Clients" },
  { icon: Award, number: "15+", label: "Years Experience" },
  { icon: Star, number: "4.9", label: "Client Rating" }
];
```

### 5. Contact Page (Contact.tsx)
**Route**: `/contact`

#### Features
- Contact information cards
- Contact form with validation
- Interactive map placeholder
- Business benefits list

#### Form Validation
- Required fields: name, email, phone, message
- Email format validation
- Form submission with toast notification

## Components Documentation

### 1. Header Component (Header.tsx)

#### State Management
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

#### Navigation Items
```typescript
const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Active Listings", icon: Building, href: "/active-listings" },
  { name: "About Us", icon: Info, href: "/about" },
  { name: "Contact", icon: Phone, href: "/contact" }
];
```

#### Features
- Sticky navigation (sticky top-0 z-50)
- Mobile hamburger menu
- Active route highlighting
- Brand logo with home icon
- Responsive design (hidden md:flex for desktop nav)

#### Active Route Logic
```typescript
const isActiveRoute = (href: string) => {
  if (href === "/") return location.pathname === "/";
  return location.pathname.startsWith(href);
};
```

### 2. PropertyCarousel Component (PropertyCarousel.tsx)

#### Auto-Advance Logic
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % soldProperties.length);
  }, 5000);
  return () => clearInterval(interval);
}, [soldProperties.length]);
```

#### Features
- 5-second auto-advance
- Manual navigation buttons
- Dot indicators
- "SOLD OUT" badge overlay
- Gradient overlay for text readability

#### Sold Properties Data
```typescript
const soldProperties = [
  {
    id: number;
    image: string;
    title: string;
    location: string;
    price: string;
    description: string;
  }
];
```

### 3. PropertyCard Component (PropertyCard.tsx)

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
}
```

#### Features
- Hover animations (hover:shadow-lg transition-all duration-300)
- Image scaling on hover (group-hover:scale-105)
- Property type badge
- Property statistics icons
- "Get Enquiry" button
- Link to property details page

### 4. EnquiryForm Component (EnquiryForm.tsx)

#### Form State
```typescript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  message: ""
});
const [errors, setErrors] = useState<any>({});
```

#### Validation Logic
```typescript
const validateForm = () => {
  const newErrors: any = {};
  
  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }
  
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Email is invalid";
  }
  
  if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
    newErrors.phone = "Please enter a valid phone number";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### Features
- Real-time validation
- Error message display
- Property context display
- Form reset on submission
- Responsive design

### 5. TestimonialsSection Component (TestimonialsSection.tsx)

#### Testimonials Data Structure
```typescript
const testimonials = [
  {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string;
  }
];
```

#### Features
- Star rating display (1-5 stars)
- Customer photos
- Responsive grid layout
- Hover effects

### 6. WhyChooseUsSection Component (WhyChooseUsSection.tsx)

#### Features Data
```typescript
const features = [
  {
    icon: LucideIcon;
    title: string;
    description: string;
  }
];
```

#### Available Features
1. Verified Listings - CheckCircle icon
2. Expert Agents - Users icon
3. Easy Financing - DollarSign icon
4. Secure Transactions - Shield icon
5. 24/7 Support - Clock icon
6. Award Winning - Award icon

### 7. Footer Component (Footer.tsx)

#### Sections
1. **Company Info**: Logo, description, social media links
2. **Quick Links**: Navigation menu
3. **Contact Info**: Phone, email, address
4. **Newsletter**: Email subscription form

#### Social Media Icons
- Facebook, Twitter, Instagram, LinkedIn
- Hover color transitions

#### Contact Information
- Phone: +1 (555) 123-4567
- Email: info@elitehomes.com
- Address: 123 Real Estate Ave, City, State 12345

## Features & Logic

### 1. Auto Popup System

#### Implementation
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setShowAutoPopup(true);
  }, 60000); // 1 minute
  return () => clearInterval(interval);
}, []);
```

#### Behavior
- Appears every 60 seconds
- Contains enquiry form
- Promotional message: "Connect with our professional agent and find your dream home"
- Can be dismissed by user

### 2. Search and Filtering

#### Search Fields
- **Location**: Text input with case-insensitive matching
- **Price Range**: Dropdown with predefined ranges
- **Property Type**: Dropdown with available types

#### Filter Logic
```typescript
const filteredProperties = activeProperties.filter(property => {
  const matchesLocation = !searchLocation || 
    property.location.toLowerCase().includes(searchLocation.toLowerCase());
  const matchesType = !propertyType || property.type === propertyType;
  return matchesLocation && matchesType;
});
```

### 3. Form Handling

#### Enquiry Form Submission
```typescript
const handleFormSubmit = (formData: any) => {
  console.log("Form submitted:", formData);
  toast({
    title: "Enquiry Submitted Successfully!",
    description: "Our agent will contact you within 24 hours.",
  });
  setShowEnquiryModal(false);
  setSelectedProperty(null);
};
```

#### Toast Notifications
- Success messages for form submissions
- Error handling for validation failures
- Auto-dismiss functionality

### 4. Navigation Logic

#### Route Protection
- 404 page for invalid routes
- Breadcrumb navigation on property details
- Back button functionality

#### Active Route Highlighting
```typescript
const isActiveRoute = (href: string) => {
  if (href === "/") return location.pathname === "/";
  return location.pathname.startsWith(href);
};
```

## Styling & Design

### 1. Color Scheme
- **Primary**: Blue (#2563eb - blue-600)
- **Secondary**: Gray (#6b7280 - gray-500)
- **Background**: White (#ffffff)
- **Text**: Dark gray (#1f2937 - gray-800)
- **Accent**: Green for sold properties (#22c55e - green-500)

### 2. Typography
- **Headings**: Bold, varying sizes (text-xl to text-4xl)
- **Body Text**: Regular weight, gray-600 color
- **Links**: Blue color with hover effects

### 3. Layout Patterns
- **Container**: `container mx-auto px-4`
- **Grid**: Responsive grids (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- **Spacing**: Consistent padding and margins (py-16, mb-8, etc.)

### 4. Animations
- **Hover Effects**: scale, shadow, and color transitions
- **Carousel**: Smooth slide transitions
- **Modal**: Fade in/out animations
- **Buttons**: Color and shadow transitions

## Data Models

### 1. Property Interface
```typescript
interface Property {
  id: number;
  image: string;
  price: string;          // e.g., "$750,000 - $850,000"
  location: string;       // e.g., "Downtown Seattle"
  type: string;           // "Apartment", "Villa", "Condo", etc.
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}
```

### 2. Extended Property Interface (Details Page)
```typescript
interface PropertyDetails extends Property {
  images: string[];       // Array of image URLs
  yearBuilt: number;
  description: string;
  features: string[];     // Array of feature descriptions
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

### 3. Form Data Interface
```typescript
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: string;      // Optional property context
}
```

### 4. Navigation Item Interface
```typescript
interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
}
```

## User Interactions

### 1. Property Browsing Flow
1. User lands on homepage
2. Views sold properties in carousel
3. Browses active properties
4. Uses search/filter to narrow results
5. Clicks on property card
6. Views detailed property information
7. Submits enquiry or schedules viewing

### 2. Enquiry Process
1. User clicks "Get Enquiry" button
2. Modal opens with enquiry form
3. User fills required fields (name, email, phone)
4. Form validates input
5. Success message displays
6. Modal closes automatically
7. Form data logged to console

### 3. Auto Popup Interaction
1. User visits website
2. After 60 seconds, popup appears
3. User can fill form or dismiss
4. Popup reappears every minute if not submitted

### 4. Navigation Experience
1. User clicks navigation items
2. Active route highlights
3. Mobile users access hamburger menu
4. Smooth transitions between pages

## Responsive Design

### 1. Breakpoints
- **Mobile**: Default styles (< 768px)
- **Tablet**: md: prefix (≥ 768px)
- **Desktop**: lg: prefix (≥ 1024px)

### 2. Mobile Adaptations
- **Header**: Hamburger menu
- **Grid**: Single column layout
- **Search**: Stacked form fields
- **Carousel**: Touch-friendly navigation
- **Forms**: Full-width inputs

### 3. Desktop Enhancements
- **Header**: Horizontal navigation
- **Grid**: Multi-column layouts
- **Search**: Inline form fields
- **Hover**: Enhanced interactions

## Future Enhancements

### 1. Backend Integration
- Database for property storage
- User authentication system
- Enquiry management dashboard
- Email notification system

### 2. Advanced Features
- Property comparison tool
- Saved searches functionality
- Agent assignment system
- Virtual tour integration
- Mortgage calculator

### 3. Performance Optimizations
- Image optimization and lazy loading
- Code splitting for better performance
- SEO improvements
- Analytics integration

### 4. Additional Functionality
- Multi-language support
- Advanced search filters
- Property alerts/notifications
- Social media integration
- Blog/news section

## Technical Notes

### 1. State Management
- Uses React hooks for local state
- No global state management (Redux/Zustand not needed)
- Form state managed independently in each component

### 2. Error Handling
- Form validation with user-friendly messages
- Console logging for debugging
- Toast notifications for user feedback

### 3. Performance Considerations
- Component memoization not implemented (not needed for current scale)
- Images use placeholder URLs (optimization needed for production)
- Auto popup interval cleared on component unmount

### 4. Accessibility
- Semantic HTML structure
- Icon labels and alt text
- Keyboard navigation support
- Focus management in modals

This documentation covers all aspects of the EliteHomes real estate website, providing detailed information about every component, feature, and piece of logic implemented in the codebase.
