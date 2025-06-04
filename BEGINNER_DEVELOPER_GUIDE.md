
# 📖 TrueView Reality - Beginner Developer Guide

Welcome! This guide will help you make changes to the TrueView Reality website, even if you're new to coding. Everything is explained in simple steps with examples.

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [How to Change Text](#how-to-change-text)
3. [How to Change Images](#how-to-change-images)
4. [How to Change Icons](#how-to-change-icons)
5. [How to Modify Logic](#how-to-modify-logic)
6. [How to Add/Remove Property Cards](#how-to-addremove-property-cards)
7. [Folder Structure](#folder-structure)
8. [UI Component File Reference](#ui-component-file-reference)
9. [How to Preview Changes](#how-to-preview-changes)
10. [Best Practices](#best-practices)

---

## 🚀 Getting Started

### What You Need
- **Code Editor**: Download VS Code (free) from https://code.visualstudio.com/
- **Node.js**: Download from https://nodejs.org/ (choose LTS version)
- **Basic Knowledge**: Understanding of copy/paste and file navigation

### Opening the Project
1. Open VS Code
2. Click "File" → "Open Folder"
3. Select your TrueView Reality project folder
4. You'll see all the files in the left sidebar

---

## 🔤 1. How to Change Text

### Step 1: Find the Text You Want to Change
1. **Use the Search Feature**:
   - Press `Ctrl+Shift+F` (Windows) or `Cmd+Shift+F` (Mac)
   - Type the exact text you want to change
   - VS Code will show you all files containing that text

### Step 2: Locate the File
Most text is in these files:
- **Home Page**: `src/pages/Index.tsx`
- **About Page**: `src/pages/AboutUs.tsx`
- **Contact Page**: `src/pages/Contact.tsx`
- **Active Listings**: `src/pages/ActiveListings.tsx`
- **Header/Navigation**: `src/components/Header.tsx`
- **Footer**: `src/components/Footer.tsx`

### Step 3: Edit the Text
**Example**: Changing "Find Your Dream Home" to "Your Trusted Property Partner"

**Before:**
```jsx
<h1>Find Your Dream Home</h1>
```

**After:**
```jsx
<h1>Your Trusted Property Partner</h1>
```

### Step 4: Save and Test
1. Save the file: `Ctrl+S` (Windows) or `Cmd+S` (Mac)
2. Check your changes in the browser

### Common Text Locations:

#### Website Title (appears in browser tab)
**File**: `index.html`
```html
<title>TrueView Reality - Find Your Dream Home</title>
```

#### Main Headings
**File**: `src/pages/Index.tsx`
```jsx
<h1 className="text-5xl font-bold">
  Discover Your Dream Home
</h1>
```

#### Contact Information
**File**: `src/pages/Contact.tsx`
```jsx
{
  title: "Phone Number",
  details: "+1 (555) TRUE-VIEW"
}
```

---

## 🖼️ 2. How to Change Images

### Where Images Are Stored
- **Property Images**: `backend/property-images/` (for automatic sync)
- **Static Images**: `public/` folder
- **Fallback Images**: Referenced in `src/data/fallbackProperties.ts`

### Step 1: Adding New Property Images (Automatic Method)
1. **Prepare Your Image**:
   - Use JPG, PNG, or WEBP format
   - Recommended size: 800x600 pixels or larger
   - Keep file size under 2MB for fast loading

2. **Name Your Image File**:
   Use this exact format: `{id}_{type}_{location}_{price}.{extension}`
   
   **Examples**:
   - `9_villa_miami-beach_2m-2.5m.jpg`
   - `10_apartment_new-york_800k-1m.png`
   - `11_condo_los-angeles_600k-700k.jpg`

3. **Add to Folder**:
   - Copy your image to `backend/property-images/` folder
   - The website will automatically detect it within 30 seconds

### Step 2: Changing Existing Images
**Replace an existing image**:
1. Find the old image in `backend/property-images/`
2. Delete the old image
3. Add your new image with the same filename

### Step 3: Changing Static Images (Logo, Background, etc.)
**File**: Various component files

**Example - Changing Logo**:
**File**: `src/components/Header.tsx`
```jsx
// Before
<img src="/logo.png" alt="TrueView Reality" />

// After (new logo file)
<img src="/new-logo.png" alt="TrueView Reality" />
```

### Step 4: Image Size Guidelines
- **Property Photos**: 800x600px minimum
- **Logo**: 200x60px recommended
- **Hero Images**: 1920x1080px for best quality
- **Thumbnails**: 300x200px

---

## 🎨 3. How to Change Icons

### Icon Library Used
This website uses **Lucide React** icons. You can browse all available icons at: https://lucide.dev/icons/

### Step 1: Find Current Icon Usage
**Search for icon names**:
- Press `Ctrl+Shift+F` and search for icon names like "Home", "Phone", "Mail"

### Step 2: Replace an Icon
**Example**: Changing phone icon to mail icon

**Before**:
```jsx
import { Phone } from "lucide-react";

<Phone className="w-4 h-4 mr-1" />
```

**After**:
```jsx
import { Mail } from "lucide-react";

<Mail className="w-4 h-4 mr-1" />
```

### Step 3: Available Icons (Common Ones)
- `Home` - House icon
- `Phone` - Phone icon
- `Mail` - Email icon
- `MapPin` - Location pin
- `Search` - Magnifying glass
- `User` - Person icon
- `Star` - Star rating
- `Heart` - Heart/favorite
- `ArrowRight` - Right arrow
- `Check` - Checkmark

### Step 4: Changing Icon Size and Color
**Icon size classes**:
- `w-4 h-4` = Small (16px)
- `w-6 h-6` = Medium (24px)
- `w-8 h-8` = Large (32px)

**Icon color classes**:
- `text-blue-600` = Blue
- `text-red-500` = Red
- `text-green-600` = Green
- `text-gray-500` = Gray

**Example**:
```jsx
<Phone className="w-6 h-6 text-blue-600" />
```

---

## 🧠 4. How to Modify Logic

### Common Logic Changes

#### A. Change Popup Timing
**File**: `src/pages/Index.tsx`

**Find this code**:
```jsx
const interval = setInterval(() => {
  setShowAutoPopup(true);
}, 60000); // 1 minute = 60000 milliseconds
```

**Change timing**:
```jsx
// 2 minutes
}, 120000);

// 30 seconds
}, 30000);

// 5 minutes
}, 300000);
```

#### B. Disable Auto Popup Completely
**File**: `src/pages/Index.tsx`

**Find and comment out this section**:
```jsx
// Comment out these lines to disable auto popup
// useEffect(() => {
//   if (hasSubmittedEnquiry) return;
//   const interval = setInterval(() => {
//     setShowAutoPopup(true);
//   }, 60000);
//   return () => clearInterval(interval);
// }, [hasSubmittedEnquiry]);
```

#### C. Add New Form Validation
**File**: `src/components/EnquiryForm.tsx`

**Find the `validateForm` function**:
```jsx
const validateForm = () => {
  const newErrors: any = {};
  
  // Add new validation rule
  if (!formData.message.trim()) {
    newErrors.message = "Message is required";
  }
  
  // Existing validation code...
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### D. Change Property Auto-Refresh Timing
**File**: `src/hooks/useProperties.ts`

**Find this code**:
```jsx
const interval = setInterval(() => {
  if (!usingFallback) {
    fetchProperties();
  }
}, 30000); // 30 seconds
```

**Change to 1 minute**:
```jsx
}, 60000); // 1 minute
```

---

## 🧩 5. How to Add/Remove Property Cards

### Method 1: Automatic (Recommended)
Just add image files to `backend/property-images/` folder with correct naming:
`{id}_{type}_{location}_{price}.{extension}`

### Method 2: Manual (Fallback Data)
**File**: `src/data/fallbackProperties.ts`

#### Adding a New Property:
```jsx
// Add this object to the array
{
  id: 9, // Use next available number
  image: "/placeholder.svg",
  price: "$800,000 - $900,000",
  location: "San Diego",
  type: "Condo",
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1400,
  status: 'active' as const,
  created_at: new Date().toISOString()
}
```

#### Removing a Property:
1. Find the property object with the ID you want to remove
2. Delete the entire object (from `{` to `}`)
3. Make sure to remove the comma if it's the last item

#### Editing Property Details:
```jsx
{
  id: 1,
  image: "/placeholder.svg",
  price: "$750,000 - $850,000", // Change price here
  location: "Downtown Seattle", // Change location here
  type: "Apartment", // Change type here
  bedrooms: 3, // Change bedrooms here
  bathrooms: 2, // Change bathrooms here
  sqft: 1800, // Change square footage here
  status: 'active' as const,
  created_at: new Date().toISOString()
}
```

---

## 📁 6. Folder Structure

```
trueview-reality/
├── 📁 src/                          # Main source code
│   ├── 📁 components/               # Reusable UI pieces
│   │   ├── Header.tsx              # Navigation bar
│   │   ├── Footer.tsx              # Bottom section
│   │   ├── PropertyCard.tsx        # Individual property display
│   │   ├── EnquiryForm.tsx         # Contact form
│   │   └── 📁 ui/                  # Basic UI components
│   ├── 📁 pages/                   # Full web pages
│   │   ├── Index.tsx               # Home page
│   │   ├── ActiveListings.tsx      # Properties page
│   │   ├── AboutUs.tsx             # About page
│   │   ├── Contact.tsx             # Contact page
│   │   └── NotFound.tsx            # 404 error page
│   ├── 📁 hooks/                   # Custom logic functions
│   │   └── useProperties.ts        # Property data management
│   ├── 📁 data/                    # Data files
│   │   └── fallbackProperties.ts  # Backup property data
│   └── 📁 utils/                   # Helper functions
│       └── database.ts             # Backend communication
├── 📁 public/                      # Static files
│   ├── favicon.ico                 # Website icon
│   ├── placeholder.svg             # Default images
│   └── analytics.js                # Website tracking
├── 📁 backend/                     # Server code
│   ├── server.js                   # Main server file
│   ├── package.json                # Server dependencies
│   └── 📁 property-images/         # Auto-sync property photos
└── 📁 docs/                        # Documentation
    ├── DOCUMENTATION.md            # Technical docs
    └── DATA_STRUCTURE.md           # Database info
```

### What Each Folder Does:
- **src/components/**: Small pieces you can reuse (like buttons, cards)
- **src/pages/**: Complete web pages that users see
- **src/data/**: Information about properties, testimonials, etc.
- **public/**: Images, icons, and files that don't change
- **backend/**: Server that handles form submissions and database

---

## 🎯 7. UI Component File Reference

This section tells you exactly which file to edit for each part of the website.

### 🏠 **Home Page (/) Components:**

#### Header/Navigation Bar
- **File**: `src/components/Header.tsx`
- **What it controls**: Logo, navigation menu, "Get Started" button
- **Common changes**: Menu items, logo, navigation links

#### Hero Section (Top banner with big text)
- **File**: `src/pages/Index.tsx` (lines 85-95 approximately)
- **What it controls**: Main heading, subtitle, call-to-action
- **Common changes**: Hero text, background, button text

#### Property Carousel (Sliding property images)
- **File**: `src/components/PropertyCarousel.tsx`
- **What it controls**: Sliding property showcase
- **Common changes**: Carousel content, timing, images

#### Search Bar Section
- **File**: `src/pages/Index.tsx` (lines 96-130 approximately)
- **What it controls**: Location search, price range, property type filters
- **Common changes**: Search options, placeholder text, filter options

#### Active Properties Grid
- **File**: `src/pages/Index.tsx` (lines 131-150 approximately)
- **What it controls**: Property cards display on homepage
- **Common changes**: Number of properties shown, grid layout

#### Individual Property Cards
- **File**: `src/components/PropertyCard.tsx`
- **What it controls**: Each property card layout and content
- **Common changes**: Card design, button text, information display

#### Why Choose Us Section
- **File**: `src/components/WhyChooseUsSection.tsx`
- **What it controls**: Features/benefits section
- **Common changes**: Feature list, icons, descriptions

#### Testimonials Section
- **File**: `src/components/TestimonialsSection.tsx`
- **What it controls**: Customer reviews section
- **Common changes**: Review content, customer names, ratings

#### Footer
- **File**: `src/components/Footer.tsx`
- **What it controls**: Bottom section with contact info, links, newsletter
- **Common changes**: Contact details, social links, company info

---

### 🏢 **Active Listings Page (/active-listings) Components:**

#### Page Header/Title
- **File**: `src/pages/ActiveListings.tsx` (lines 40-50 approximately)
- **What it controls**: Page title and description
- **Common changes**: Title text, subtitle

#### Search and Filter Bar
- **File**: `src/pages/ActiveListings.tsx` (lines 51-85 approximately)
- **What it controls**: Location search, property type filter, search button
- **Common changes**: Filter options, search functionality

#### Properties Grid
- **File**: `src/pages/ActiveListings.tsx` (lines 86-120 approximately)
- **What it controls**: All property cards display
- **Common changes**: Grid layout, sorting options

#### Property Count Display
- **File**: `src/pages/ActiveListings.tsx` (lines 90-95 approximately)
- **What it controls**: "X Properties Available" text
- **Common changes**: Counter text, formatting

---

### ℹ️ **About Us Page (/about) Components:**

#### All Content
- **File**: `src/pages/AboutUs.tsx`
- **What it controls**: Entire about page content
- **Common changes**: Company story, team info, mission statement

---

### 📞 **Contact Page (/contact) Components:**

#### Contact Information Cards
- **File**: `src/pages/Contact.tsx` (lines 25-45 approximately)
- **What it controls**: Address, phone, email, business hours cards
- **Common changes**: Contact details, icons, formatting

#### Contact Form
- **File**: `src/pages/Contact.tsx` (lines 70-120 approximately)
- **What it controls**: Contact form fields and styling
- **Common changes**: Form fields, labels, validation

#### Map Section
- **File**: `src/pages/Contact.tsx` (lines 125-140 approximately)
- **What it controls**: Map placeholder and office info
- **Common changes**: Map integration, office details

---

### 🔧 **Shared Components (Used on Multiple Pages):**

#### Enquiry Form Popup
- **File**: `src/components/EnquiryForm.tsx`
- **What it controls**: Property enquiry popup form
- **Common changes**: Form fields, validation, styling

#### Property Details Modal
- **File**: `src/components/PropertyDetailsModal.tsx`
- **What it controls**: Property details popup window
- **Common changes**: Property information display, modal layout

---

### 🎨 **Styling and Layout:**

#### Global Styles
- **File**: `src/index.css`
- **What it controls**: Site-wide colors, fonts, animations
- **Common changes**: Color schemes, typography, global effects

#### Component-Specific Styles
- **Files**: Individual component files (`.tsx` files)
- **What it controls**: Tailwind CSS classes within each component
- **Common changes**: Colors, spacing, sizes using Tailwind classes

---

### 📊 **Data and Content:**

#### Property Data
- **File**: `src/data/fallbackProperties.ts`
- **What it controls**: Backup property information
- **Common changes**: Property details, images, prices

#### Property Data Management
- **File**: `src/hooks/useProperties.ts`
- **What it controls**: How property data is fetched and managed
- **Common changes**: Data refresh timing, error handling

---

### 🧩 **Quick Reference for Common Changes:**

| What You Want to Change | File to Edit | Section/Line |
|--------------------------|--------------|--------------|
| Logo | `src/components/Header.tsx` | Line 20-25 |
| Main navigation menu | `src/components/Header.tsx` | Line 15-20 |
| Homepage hero text | `src/pages/Index.tsx` | Line 85-95 |
| Contact phone number | `src/pages/Contact.tsx` | Line 30-35 |
| Footer company info | `src/components/Footer.tsx` | Line 15-25 |
| Property card layout | `src/components/PropertyCard.tsx` | Entire file |
| Search filters | `src/pages/Index.tsx` or `ActiveListings.tsx` | Line 96-130 |
| Color scheme | `src/index.css` | CSS variables at top |
| Popup timing | `src/pages/Index.tsx` | Line 45-50 |
| Add new property | `src/data/fallbackProperties.ts` | Add to array |

---

## 🧪 8. How to Preview Changes

### Step 1: Install Dependencies (First Time Only)
1. Open Terminal in VS Code: `View` → `Terminal`
2. Type: `npm install` and press Enter
3. Wait for installation to complete

### Step 2: Start Frontend Development Server
1. In Terminal, type: `npm run dev`
2. Press Enter
3. You'll see a message like: "Local: http://localhost:5173"
4. Click the link or open browser and go to `http://localhost:5173`

### Step 3: Start Backend Server (For Full Functionality)
1. Open a new Terminal tab: Click `+` in Terminal
2. Type: `cd backend` and press Enter
3. Type: `npm install` (first time only)
4. Type: `npm start` and press Enter
5. Backend runs on `http://localhost:3001`

### Step 4: View Your Changes
- Make changes to files
- Save the file (`Ctrl+S` or `Cmd+S`)
- Your browser will automatically refresh
- See your changes immediately

### Troubleshooting:
**If you see errors**:
1. Make sure both frontend and backend servers are running
2. Check the Terminal for error messages
3. Try refreshing the browser
4. Restart the servers if needed

---

## ✅ 9. Best Practices

### 🔒 Before Making Changes
1. **Backup Your Files**:
   - Copy the entire project folder
   - Name it with date: `trueview-reality-backup-2024-01-15`
   - Keep it safe!

2. **Test One Change at a Time**:
   - Make small changes
   - Test each change before making more
   - This helps you find problems quickly

### 📝 While Making Changes
1. **Use Descriptive File Names**:
   ```
   ✅ Good: hero-image-new.jpg
   ❌ Bad: img1.jpg
   ```

2. **Keep Image Names Simple**:
   ```
   ✅ Good: downtown-apartment-main.jpg
   ❌ Bad: Downtown Apartment - Main Photo (1).JPG
   ```

3. **Comment Your Changes**:
   ```jsx
   // Changed heading from "Find Your Dream Home" to "Your Trusted Partner"
   <h1>Your Trusted Partner</h1>
   ```

### 🚀 After Making Changes
1. **Test Everything**:
   - Click all buttons
   - Fill out forms
   - Check all pages
   - Test on mobile (resize browser window)

2. **Check Loading Speed**:
   - Large images slow down the website
   - Compress images before uploading
   - Use tools like TinyPNG.com

### 🆘 When Things Go Wrong
1. **Check Browser Console**:
   - Press F12 in browser
   - Look for red error messages
   - Copy error messages to Google for help

2. **Restore from Backup**:
   - If something breaks badly
   - Copy files from your backup folder
   - Start fresh

3. **Common Fixes**:
   ```bash
   # If server won't start
   npm install
   
   # If changes don't appear
   Ctrl+Shift+R (hard refresh)
   
   # If images don't load
   # Check file path and name spelling
   ```

### 📱 Mobile-Friendly Tips
1. **Test on Mobile**:
   - Resize browser window to phone size
   - Check that text is readable
   - Make sure buttons are easy to tap

2. **Image Sizes**:
   - Use responsive images
   - They automatically adjust to screen size

### 🔍 Getting Help
1. **Search for Solutions**:
   - Copy error messages into Google
   - Add "React" or "JavaScript" to your search

2. **Useful Resources**:
   - React Documentation: https://react.dev/
   - Tailwind CSS: https://tailwindcss.com/
   - Lucide Icons: https://lucide.dev/

---

## 🎯 Quick Reference Cheat Sheet

### Most Common Tasks:
| Task | File Location | What to Change |
|------|---------------|----------------|
| Change page title | `index.html` | `<title>` tag |
| Edit home page text | `src/pages/Index.tsx` | Text between `<h1>`, `<p>` tags |
| Add property | `backend/property-images/` | Add image with correct name |
| Change contact info | `src/pages/Contact.tsx` | Contact details object |
| Modify popup timing | `src/pages/Index.tsx` | `setInterval` number |
| Update logo | `src/components/Header.tsx` | `<img src="">` path |

### Emergency Contacts:
- **File corrupted?** → Restore from backup
- **Server won't start?** → Run `npm install` again
- **Images not loading?** → Check file names and paths
- **Styling broken?** → Look for missing commas or brackets

---

**Remember**: Always backup before making changes, test one thing at a time, and don't be afraid to experiment! Most problems can be fixed by restoring from your backup. 🚀
