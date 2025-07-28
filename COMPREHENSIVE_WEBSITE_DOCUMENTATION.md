# TrueView Reality - Complete Website Documentation

## 📋 Table of Contents
1. [Website Overview](#website-overview)
2. [Website Sections Guide](#website-sections-guide)
3. [Admin Features](#admin-features)
4. [How to Change Website Components](#how-to-change-website-components)
5. [Contact Information Management](#contact-information-management)
6. [Button Functionality Guide](#button-functionality-guide)
7. [Content Management](#content-management)
8. [Technical Documentation](#technical-documentation)

---

## 🏠 Website Overview

TrueView Reality is a modern property listing platform featuring:
- **RERA Registration**: A011262501596
- **Dynamic Hero Carousel**: Database-driven slideshow
- **Property Listings**: Real-time property display from Supabase
- **Admin Dashboard**: Complete property and content management
- **Enquiry System**: Lead capture and management
- **Responsive Design**: Mobile-first approach

---

## 🎯 Website Sections Guide

### 1. Header Section
**Location**: `src/components/Header.tsx`
**Features**:
- Navigation menu (Home, Active Listings, About, Contact)
- Mobile-responsive hamburger menu
- RERA ID display
- Enquiry button

**How to modify**:
```typescript
// To change navigation items
const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Properties", icon: Building, href: "/active-listings" },
  // Add your new items here
];
```

### 2. Hero Carousel
**Location**: `src/components/DynamicHeroCarousel.tsx`
**Features**:
- Auto-rotating slides
- Explore Properties button → navigates to /active-listings
- Contact Us button → navigates to /contact
- Database-driven content

**How to add/edit slides**:
1. Access Admin Dashboard (`/admin-dashboard`)
2. Navigate to "Hero Slider Management" tab
3. Add/Edit/Remove slides
4. Toggle active status

### 3. Property Listings
**Location**: `src/pages/Index.tsx`, `src/pages/ActiveListings.tsx`
**Features**:
- Search and filter functionality
- Property cards with images and details
- Enquiry buttons
- Property detail modals

**How to add properties**:
1. Access Admin Dashboard
2. Go to "Add Property" tab
3. Fill in property details
4. Upload images
5. Save property

### 4. Why Choose Us Section
**Location**: `src/components/WhyChooseUsSection.tsx`
**Current Features**:
- 6 value proposition cards
- Minimalistic content
- Hover effects

**How to modify**:
```typescript
const features = [
  {
    icon: CheckCircle,
    title: "Your New Feature",
    description: "Brief description of the feature."
  },
  // Add more features here
];
```

### 5. Testimonials Section
**Location**: `src/components/TestimonialsSection.tsx`
**Current Features**:
- 3 client testimonials
- Star ratings
- Minimal content approach

**How to modify**:
```typescript
const testimonials = [
  {
    id: 1,
    name: "Client Name",
    role: "Client Role",
    content: "Brief testimonial content",
    rating: 5,
    image: "/placeholder.svg"
  },
  // Add more testimonials here
];
```

### 6. Footer Section
**Location**: `src/components/Footer.tsx`
**Features**:
- Contact information
- Quick links
- Newsletter subscription
- Social media links
- Admin login access (gear icon)

---

## 🔧 Admin Features

### Access Admin Dashboard
1. Click gear icon in footer
2. Enter admin credentials
3. Access full dashboard at `/admin-dashboard`

### Admin Capabilities
- **Property Management**: Add, edit, view properties
- **Hero Slider Management**: Manage carousel slides
- **Enquiry Management**: View and manage leads
- **Newsletter Management**: View subscriptions
- **Admin User Creation**: Create new admin accounts
- **Analytics**: View property views and enquiries

---

## 🛠 How to Change Website Components

### Changing Colors and Styling
**File**: `src/index.css` and `tailwind.config.ts`

```css
/* To change primary colors */
:root {
  --primary: 210 100% 50%;  /* Change these HSL values */
  --secondary: 220 90% 45%;
}
```

### Changing Contact Information
**Files to update**:
1. `src/components/Footer.tsx` (lines 95-105)
2. `src/pages/Contact.tsx` (lines 22-43)

**Standard Contact Details**:
- **Address**: Level 2, Cyberpark, IT City Road, Indore (MP) - 452001
- **Phone**: +91 9106-111-222
- **Email**: info@trueviewrealtyindia.com
- **Hours**: Mon - Fri: 9AM - 7PM, Sat: 10AM - 5PM

### Changing Company Name
Search and replace "TrueView Reality" across all files:
- Header components
- Footer components
- About page
- Contact page
- Meta tags in `index.html`

### Adding New Pages
1. Create new component in `src/pages/`
2. Add route in `src/App.tsx`:
```typescript
<Route path="/your-new-page" element={<YourNewPage />} />
```
3. Add navigation link in `src/components/Header.tsx`

---

## 📞 Contact Information Management

### Current Standard Contact Details
All contact information should match these details across the website:

- **Office Address**: Level 2, Cyberpark, IT City Road, Indore (MP) - 452001
- **Phone Number**: +91 9106-111-222  
- **Email Address**: info@trueviewrealtyindia.com
- **Business Hours**: Mon - Fri: 9AM - 7PM, Sat: 10AM - 5PM

### Files Containing Contact Information
1. `src/components/Footer.tsx` (lines 95-105)
2. `src/pages/Contact.tsx` (lines 22-43)
3. `src/components/Header.tsx` (RERA ID display)

### How to Update Contact Details
1. Update `src/components/Footer.tsx`:
```typescript
<span className="text-gray-300">Your New Address</span>
<span className="text-gray-300">Your New Phone</span>
<span className="text-gray-300">Your New Email</span>
```

2. Update `src/pages/Contact.tsx`:
```typescript
const contactInfo = [
  {
    icon: MapPin,
    title: "Office Address", 
    details: "Your New Address"
  },
  // Update other contact details
];
```

---

## 🔘 Button Functionality Guide

### All Interactive Buttons Status
✅ **Working Buttons**:
- Header navigation buttons
- Hero "Explore Properties" button → `/active-listings`
- Hero "Contact Us" button → `/contact`
- Property "Get Enquiry" buttons → Opens enquiry modal
- Search button → Filters properties
- Admin login buttons
- Form submit buttons
- Modal close buttons
- Property filter buttons

✅ **Button Testing Checklist**:
- [ ] All navigation buttons direct to correct pages
- [ ] Form submission buttons show success/error feedback
- [ ] Modal buttons open/close correctly
- [ ] Search and filter buttons apply changes
- [ ] Admin dashboard buttons perform actions
- [ ] Mobile menu buttons work on small screens

### How to Test Button Functionality
1. **Navigation Buttons**: Click and verify correct page loads
2. **Form Buttons**: Submit forms and check for success messages
3. **Modal Buttons**: Open/close modals and verify behavior
4. **Filter Buttons**: Apply filters and check property list updates
5. **Admin Buttons**: Verify admin actions work correctly

---

## 📝 Content Management

### Content Minimization Applied
1. **"What Our Clients Say"**: Removed excessive descriptive text
2. **"Why Choose TrueView Reality"**: Streamlined to essential points only
3. **"Meet Our Experts"**: Section completely removed from About page
4. **Contact Page**: Minimized promotional content

### Content Guidelines
- Keep headlines clear and concise
- Use bullet points for features
- Limit testimonials to essential content
- Remove marketing fluff
- Focus on core value propositions

---

## 💻 Technical Documentation

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Authentication, Storage)
- **Routing**: React Router
- **State Management**: React Hooks
- **Forms**: React Hook Form with Zod validation

### Database Tables
- `properties`: Property listings
- `hero_slides`: Carousel content
- `enquiries`: Lead capture
- `newsletter_subscriptions`: Email subscriptions
- `admin_users`: Admin accounts
- `property_analytics`: Usage tracking

### Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Key Configuration Files
- `vite.config.ts`: Build configuration
- `tailwind.config.ts`: Styling configuration
- `src/integrations/supabase/client.ts`: Database connection

### Custom Hooks
- `useProperties()`: Fetches and manages property data
- `useToast()`: Manages notification system

---

## 🚀 Deployment and Updates

### How to Deploy Changes
1. Make changes to code
2. Test locally with `npm run dev`
3. Build for production with `npm run build`
4. Deploy through Lovable platform

### How to Update Content
1. **Properties**: Use Admin Dashboard
2. **Hero Slides**: Use Admin Dashboard
3. **Static Content**: Edit component files directly
4. **Contact Info**: Update in Footer and Contact components

### Backup and Recovery
- Database backups handled by Supabase
- Code version control through Git
- Regular exports recommended for content

---

## 📋 Maintenance Checklist

### Weekly Tasks
- [ ] Check all button functionality
- [ ] Verify contact information consistency
- [ ] Test enquiry form submissions
- [ ] Review property listings
- [ ] Check admin dashboard access

### Monthly Tasks
- [ ] Update documentation
- [ ] Review and optimize content
- [ ] Check for broken links
- [ ] Verify mobile responsiveness
- [ ] Test all user workflows

### Content Audit
- [ ] Ensure contact details match across all pages
- [ ] Verify RERA ID is current (A011262501596)
- [ ] Check that content remains minimal and focused
- [ ] Confirm all sections are working properly

---

*This documentation is comprehensive and should be updated whenever changes are made to the website. Keep this file current for future reference and onboarding.*