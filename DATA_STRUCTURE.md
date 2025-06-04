
# TrueView Reality - Data Structure Documentation

## Overview
This document outlines the complete data structure and storage system for TrueView Reality's property listings and enquiry management.

## Database Schema

### Properties Table
```sql
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),                           -- Path to property image
  price VARCHAR(100),                           -- Property price range
  location VARCHAR(255),                        -- Property location
  type VARCHAR(100),                            -- Property type (Apartment, Villa, etc.)
  bedrooms INT,                                 -- Number of bedrooms
  bathrooms DECIMAL(3,1),                       -- Number of bathrooms (allows .5)
  sqft INT,                                     -- Square footage
  status ENUM('active', 'sold', 'pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Enquiries Table
```sql
CREATE TABLE enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,                   -- Customer name
  email VARCHAR(255) NOT NULL,                  -- Customer email
  phone VARCHAR(20) NOT NULL,                   -- Customer phone
  message TEXT,                                 -- Customer message
  property VARCHAR(255),                        -- Property details (JSON string)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## File Structure for Property Images

### Directory Layout
```
backend/
└── property-images/
    ├── 1_apartment_downtown-seattle_750k-850k.jpg
    ├── 2_villa_beverly-hills_1.2m-1.4m.jpg
    ├── 3_condo_austin-texas_450k-550k.jpg
    └── [id]_[type]_[location]_[price].[ext]
```

### Image Naming Convention
Format: `{id}_{type}_{location}_{price}.{extension}`

- **id**: Unique property identifier (number)
- **type**: Property type (apartment, villa, condo, townhouse, penthouse)
- **location**: Property location (use hyphens instead of spaces)
- **price**: Price range (use hyphens instead of spaces, 'k' for thousands, 'm' for millions)
- **extension**: Image file extension (jpg, jpeg, png, gif, webp)

### Examples
- `1_apartment_downtown-seattle_750k-850k.jpg`
- `2_villa_beverly-hills_1.2m-1.4m.png`
- `3_condo_miami-beach_900k-1.1m.jpg`

## TypeScript Interfaces

### Property Interface
```typescript
export interface Property {
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
```

### Enquiry Interface
```typescript
export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  property: string;
  created_at?: string;
}
```

## Data Flow

### 1. Property Sync Process
1. Backend scans `property-images/` folder every 30 seconds
2. Parses image filenames using naming convention
3. Creates database entries for new images
4. Removes database entries for deleted images
5. Frontend fetches updated property list

### 2. Enquiry Submission
1. User fills out enquiry form
2. Frontend validates form data
3. Data sent to backend API endpoint
4. Backend stores enquiry in MySQL database
5. Success/error response returned to frontend

### 3. Property Display
1. Frontend requests properties from backend
2. Backend returns active properties with image URLs
3. Frontend displays properties in grid layout
4. Users can filter by location and property type

## API Endpoints

### GET /api/properties
- Returns all active properties
- Auto-syncs with image folder before returning data

### POST /api/enquiries
- Accepts enquiry form data
- Stores in database with timestamp

### GET /api/enquiries
- Returns all enquiries (admin use)

### GET /api/properties/:id/images
- Returns all images for a specific property

## Fallback Data System

When the backend is unavailable, the frontend uses fallback data stored in `src/data/fallbackProperties.ts`. This ensures the website remains functional even without the backend running.

## Adding New Properties

### Method 1: File-based (Automatic)
1. Add image to `backend/property-images/` folder
2. Follow naming convention: `{id}_{type}_{location}_{price}.{ext}`
3. Backend auto-detects and adds to database
4. Property appears on website within 30 seconds

### Method 2: Database Direct
1. Insert record directly into MySQL `properties` table
2. Ensure image file exists at specified path
3. Property appears immediately

## Environment Configuration

### Backend Configuration
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'trueview_reality',
  port: 3306
};
```

### Frontend Configuration
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

## Security Considerations

1. **Input Validation**: All form inputs are validated on both frontend and backend
2. **SQL Injection Prevention**: Using parameterized queries with mysql2
3. **CORS Configuration**: Properly configured for frontend domain
4. **File Upload Restrictions**: Only image files accepted in property-images folder

## Maintenance

### Regular Tasks
1. Monitor `property-images/` folder size
2. Clean up old enquiry records periodically
3. Backup database regularly
4. Monitor backend logs for sync errors

### Troubleshooting
1. **Properties not appearing**: Check image naming convention
2. **Backend connection failed**: Verify MySQL credentials and service status
3. **Images not loading**: Check file permissions and paths
4. **Enquiries not saving**: Check database connection and table structure
