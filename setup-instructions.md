
# TrueView Reality - Local Setup Instructions

## Prerequisites

Before setting up TrueView Reality locally, ensure you have the following installed:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MySQL Server** (version 8.0 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or install via package manager (homebrew on Mac, apt on Ubuntu, etc.)

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MySQL:**
   - Start MySQL service on your system
   - Create a MySQL user (or use root)
   - Update the database configuration in `backend/server.js`:
     ```javascript
     const dbConfig = {
       host: 'localhost',
       user: 'your_mysql_username',
       password: 'your_mysql_password',
       database: 'trueview_reality',
       port: 3306
     };
     ```

4. **Create property images directory:**
   ```bash
   mkdir property-images
   ```

5. **Add sample property images:**
   - Place property images in the `backend/property-images/` folder
   - Use naming convention: `id_type_location_price.jpg`
   - Example: `1_villa_beverly-hills_1200000.jpg`
   - Supported formats: .jpg, .jpeg, .png, .gif, .webp

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on http://localhost:3001

## Frontend Setup

1. **Navigate to the frontend directory (project root):**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## Property Images Setup

To automatically populate properties from images:

1. **Image Naming Convention:**
   ```
   Format: {id}_{type}_{location}_{price}.{extension}
   Example: 1_villa_beverly-hills_1200000.jpg
   ```

2. **Supported File Types:**
   - .jpg, .jpeg, .png, .gif, .webp

3. **Auto-sync Feature:**
   - The backend automatically scans the `property-images` folder every 30 seconds
   - New images are automatically added to the database
   - Removed images are automatically deleted from the database

## Database Schema

The application automatically creates the following tables:

### Enquiries Table
```sql
CREATE TABLE enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  property VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Properties Table
```sql
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),
  price VARCHAR(100),
  location VARCHAR(255),
  type VARCHAR(100),
  bedrooms INT,
  bathrooms DECIMAL(3,1),
  sqft INT,
  status ENUM('active', 'sold', 'pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Configuration

1. **Frontend Configuration:**
   - API base URL is set to `http://localhost:3001/api` in `src/utils/database.ts`
   - Modify if your backend runs on a different port

2. **Backend Configuration:**
   - Update database credentials in `backend/server.js`
   - Modify CORS settings if needed

## Favicon Setup

1. **Add favicon.ico:**
   - Place your favicon.ico file in the `public/` directory
   - The application is already configured to use `/favicon.ico`

## Running in Production

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Serve the built files:**
   ```bash
   npm run preview
   ```

3. **Backend in production:**
   ```bash
   cd backend
   npm start
   ```

## Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Verify MySQL is running
   - Check database credentials in `backend/server.js`
   - Ensure the MySQL user has proper permissions

2. **CORS Errors:**
   - Ensure backend is running on port 3001
   - Check CORS configuration in `backend/server.js`

3. **Image Upload Issues:**
   - Verify the `backend/property-images/` directory exists
   - Check file permissions on the directory
   - Ensure image naming follows the convention

4. **Port Conflicts:**
   - Frontend default: 5173
   - Backend default: 3001
   - Modify ports in respective configuration files if needed

## API Endpoints

- **POST** `/api/enquiries` - Submit new enquiry
- **GET** `/api/enquiries` - Get all enquiries
- **GET** `/api/properties` - Get all active properties
- **GET** `/api/properties/:id/images` - Get images for specific property

## Features

- **Automatic Property Sync** - Properties auto-update from image folder
- **Database Integration** - All enquiries stored in MySQL
- **Responsive Design** - Works on all device sizes
- **Real-time Updates** - Properties refresh every 30 seconds
- **Auto-popup Prevention** - Users who submit enquiries won't see auto-popup

## Support

For issues or questions:
1. Check the console logs in both frontend and backend
2. Verify database connections
3. Ensure all dependencies are installed correctly
