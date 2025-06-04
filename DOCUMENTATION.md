
# TrueView Reality - Complete Documentation

## Project Overview
TrueView Reality is a modern, futuristic real estate website built with React, TypeScript, and Tailwind CSS. It features automatic property listing management, dynamic image syncing, and a complete enquiry management system.

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

### Installation & Setup

1. **Clone and Install Frontend Dependencies**
```bash
git clone <repository-url>
cd trueview-reality
npm install
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure MySQL Database**
- Install MySQL Server
- Create a new database: `trueview_reality`
- Update credentials in `backend/server.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'trueview_reality',
  port: 3306
};
```

4. **Create Property Images Folder**
```bash
mkdir backend/property-images
```

5. **Start the Application**

Backend (Terminal 1):
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

Frontend (Terminal 2):
```bash
npm run dev
# App runs on http://localhost:5173
```

## Data Management System

### Automatic Property Sync
The system automatically syncs properties from the `backend/property-images/` folder:

**Image Naming Convention:**
```
{id}_{type}_{location}_{price}.{extension}
```

**Examples:**
- `1_apartment_downtown-seattle_750k-850k.jpg`
- `2_villa_beverly-hills_1.2m-1.4m.png`
- `3_condo_miami-beach_900k-1.1m.jpg`

**Adding New Properties:**
1. Add image to `backend/property-images/` folder with correct naming
2. Backend auto-detects within 30 seconds
3. Property appears on website automatically

**Removing Properties:**
1. Delete image from `backend/property-images/` folder
2. Backend removes from database within 30 seconds
3. Property disappears from website

### Database Schema
Properties and enquiries are stored in MySQL with automatic table creation on first run.

**Properties Table Features:**
- Auto-incrementing ID
- Image path storage
- Property details (price, location, type, etc.)
- Status tracking (active, sold, pending)
- Automatic timestamps

**Enquiries Table Features:**
- Customer contact information
- Property-specific enquiries
- Automatic timestamps
- JSON property data storage

### Fallback System
When backend is unavailable, the frontend displays demo properties from `src/data/fallbackProperties.ts`, ensuring the website remains functional.

## Features

### Core Functionality
- **Dynamic Property Listings**: Auto-sync from image folder
- **Property Search & Filtering**: Location and type-based filtering
- **Enquiry Management**: Database-backed form submissions
- **Property Details Modal**: Detailed property information
- **Responsive Design**: Mobile-first approach
- **Toast Notifications**: User feedback system

### UI/UX Features
- **Futuristic Theme**: Gradient backgrounds and glassmorphism effects
- **Smooth Animations**: Hover effects and transitions
- **Auto Popup System**: Timed enquiry prompts (respects user preferences)
- **Loading States**: Skeleton loading and spinners
- **Error Handling**: Graceful fallbacks and error messages

### Technical Features
- **TypeScript**: Full type safety
- **React Hooks**: Custom hooks for data management
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built component library
- **MySQL Integration**: Robust database operations
- **CORS Enabled**: Cross-origin resource sharing
- **Auto-refresh**: Real-time property updates

## File Structure

```
trueview-reality/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Site footer
│   │   ├── PropertyCard.tsx    # Property display card
│   │   ├── PropertyCarousel.tsx # Hero carousel
│   │   ├── PropertyDetailsModal.tsx # Property details popup
│   │   ├── EnquiryForm.tsx     # Contact form
│   │   ├── TestimonialsSection.tsx # Customer reviews
│   │   └── WhyChooseUsSection.tsx # Benefits section
│   ├── pages/
│   │   ├── Index.tsx           # Home page
│   │   ├── ActiveListings.tsx  # Property listings page
│   │   ├── AboutUs.tsx         # About page
│   │   ├── Contact.tsx         # Contact page
│   │   └── NotFound.tsx        # 404 page
│   ├── hooks/
│   │   ├── useProperties.ts    # Property data management
│   │   └── use-toast.ts        # Toast notifications
│   ├── utils/
│   │   └── database.ts         # API communication
│   ├── data/
│   │   └── fallbackProperties.ts # Demo property data
│   └── lib/
│       └── utils.ts            # Utility functions
├── backend/
│   ├── server.js               # Express.js backend
│   ├── package.json            # Backend dependencies
│   └── property-images/        # Property image storage
├── public/
│   ├── favicon.ico             # Site icon
│   └── analytics.js            # Independent analytics
└── docs/
    ├── DOCUMENTATION.md        # This file
    └── DATA_STRUCTURE.md       # Data structure details
```

## API Documentation

### Endpoints

#### GET /api/properties
- **Purpose**: Fetch all active properties
- **Response**: Array of property objects
- **Auto-sync**: Syncs with image folder before response

#### POST /api/enquiries
- **Purpose**: Submit customer enquiry
- **Body**: 
```json
{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "message": "string",
  "property": "string"
}
```

#### GET /api/enquiries
- **Purpose**: Retrieve all enquiries (admin)
- **Response**: Array of enquiry objects

#### GET /api/properties/:id/images
- **Purpose**: Get all images for specific property
- **Response**: Array of image URLs

### Data Types

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
  status: 'active' | 'sold' | 'pending';
  created_at?: string;
}

interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  property: string;
  created_at?: string;
}
```

## Styling & Theme

### Design System
- **Primary Colors**: Purple and blue gradients
- **Typography**: Inter font family
- **Effects**: Glassmorphism, gradients, smooth transitions
- **Responsive**: Mobile-first breakpoints
- **Accessibility**: ARIA labels and semantic HTML

### Key CSS Classes
- `.gradient-bg`: Primary gradient background
- `.card-gradient`: Glass effect cards
- `.glass-effect`: Backdrop blur effect
- `.neon-glow`: Glowing border effect
- `.text-glow`: Text shadow effect
- `.animated-gradient`: Moving gradient animation
- `.hover-lift`: Hover elevation effect

### Tailwind Configuration
- Custom color scheme with CSS variables
- Extended spacing and sizing utilities
- Custom animation keyframes
- Glassmorphism utilities

## Component Architecture

### Custom Hooks
- **useProperties**: Manages property data fetching and caching
- **use-toast**: Handles notification system

### Component Pattern
- Small, focused components (50 lines or less)
- TypeScript interfaces for all props
- Consistent error handling
- Loading state management

## Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
- `MYSQL_HOST`: Database host
- `MYSQL_USER`: Database username  
- `MYSQL_PASSWORD`: Database password
- `MYSQL_DATABASE`: Database name
- `PORT`: Backend server port

### Deployment Checklist
- [ ] Configure production database
- [ ] Update API endpoints for production
- [ ] Set up property-images folder on server
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure backup system

## Maintenance

### Regular Tasks
- Monitor property-images folder
- Review enquiry submissions
- Update property information
- Backup database
- Monitor error logs

### Updates
- Property images: Add/remove files in backend/property-images/
- Content updates: Edit components directly
- Styling changes: Update Tailwind classes
- Database: Direct SQL updates for property details

## Troubleshooting

### Common Issues

1. **Properties not loading**
   - Check MySQL connection
   - Verify backend server is running
   - Check image folder permissions

2. **Images not displaying**
   - Verify image paths in database
   - Check file naming convention
   - Ensure images exist in property-images folder

3. **Enquiries not submitting**
   - Check database connection
   - Verify table structure
   - Check CORS configuration

4. **Backend connection failed**
   - Verify MySQL service is running
   - Check database credentials
   - Ensure port 3001 is available

### Debug Mode
- Check browser console for errors
- Monitor backend logs
- Use network tab to verify API calls
- Check database directly for data integrity

## Contributing

### Development Workflow
1. Create feature branch
2. Make changes following existing patterns
3. Test both frontend and backend
4. Update documentation if needed
5. Submit pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-first architecture
- Responsive design principles

---

For detailed data structure information, see `DATA_STRUCTURE.md`.
For specific setup instructions, see `setup-instructions.md`.
