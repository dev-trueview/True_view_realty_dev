
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'property-images')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'property-images'));
  },
  filename: function (req, file, cb) {
    const propertyId = req.body.propertyId || Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${propertyId}_${file.fieldname}_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '0844',
  database: 'trueview_reality',
  port: 3306
};

// Initialize database connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Database initialization with enhanced schema
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // Create enquiries table with enhanced schema
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT,
        property VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create properties table with enhanced schema for new fields
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(255),
        images JSON,
        price VARCHAR(100),
        location VARCHAR(255),
        type VARCHAR(100),
        bedrooms INT,
        bathrooms DECIMAL(3,1),
        sqft INT,
        year_built INT,
        amenities TEXT,
        description TEXT,
        features JSON,
        neighborhood_info JSON,
        virtual_tour_url VARCHAR(500),
        status ENUM('active', 'sold', 'pending') DEFAULT 'active',
        views_count INT DEFAULT 0,
        enquiries_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create analytics table for tracking website usage
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// API Routes

// Submit enquiry with analytics tracking
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, email, phone, message, property } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');
    
    const connection = await pool.getConnection();
    
    // Insert enquiry
    const [result] = await connection.execute(
      'INSERT INTO enquiries (name, email, phone, message, property, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, message, property, ip_address, user_agent]
    );

    // Track analytics event
    await connection.execute(
      'INSERT INTO analytics (event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      ['enquiry_submitted', JSON.stringify({ property, enquiry_id: result.insertId }), ip_address, user_agent]
    );
    
    connection.release();
    
    res.status(201).json({ 
      success: true, 
      message: 'Enquiry submitted successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit enquiry' 
    });
  }
});

// Get all enquiries
app.get('/api/enquiries', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM enquiries ORDER BY created_at DESC');
    connection.release();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
  }
});

// Add new property listing (Admin feature)
app.post('/api/properties', upload.array('images', 10), async (req, res) => {
  try {
    const {
      price, location, type, bedrooms, bathrooms, sqft, year_built,
      description, features, neighborhood_info
    } = req.body;

    const connection = await pool.getConnection();
    
    // Parse JSON fields
    const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
    const parsedNeighborhood = typeof neighborhood_info === 'string' ? JSON.parse(neighborhood_info) : neighborhood_info;
    
    // Handle uploaded images
    const imageUrls = req.files ? req.files.map(file => `/images/${file.filename}`) : [];
    const primaryImage = imageUrls[0] || null;
    
    // Insert new property
    const [result] = await connection.execute(`
      INSERT INTO properties (
        image, images, price, location, type, bedrooms, bathrooms, sqft, 
        year_built, description, features, neighborhood_info, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `, [
      primaryImage,
      JSON.stringify(imageUrls),
      price,
      location,
      type,
      parseInt(bedrooms),
      parseFloat(bathrooms),
      parseInt(sqft),
      parseInt(year_built),
      description,
      JSON.stringify(parsedFeatures),
      JSON.stringify(parsedNeighborhood)
    ]);

    connection.release();
    
    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      id: result.insertId,
      images: imageUrls
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add property'
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get basic counts
    const [propertiesCount] = await connection.execute('SELECT COUNT(*) as count FROM properties WHERE status = "active"');
    const [enquiriesCount] = await connection.execute('SELECT COUNT(*) as count FROM enquiries');
    const [analyticsCount] = await connection.execute('SELECT COUNT(*) as count FROM analytics');
    
    // Get enquiries by month
    const [enquiriesByMonth] = await connection.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count 
      FROM enquiries 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);

    // Get properties by type
    const [propertiesByType] = await connection.execute(`
      SELECT 
        type,
        COUNT(*) as count 
      FROM properties 
      WHERE status = 'active'
      GROUP BY type
    `);

    // Get properties by location
    const [propertiesByLocation] = await connection.execute(`
      SELECT 
        location,
        COUNT(*) as count 
      FROM properties 
      WHERE status = 'active'
      GROUP BY location
      LIMIT 10
    `);

    connection.release();
    
    res.json({
      totalProperties: propertiesCount[0].count,
      totalEnquiries: enquiriesCount[0].count,
      totalAnalyticsEvents: analyticsCount[0].count,
      enquiriesByMonth,
      propertiesByType,
      propertiesByLocation
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

// Track page view
app.post('/api/analytics/pageview', async (req, res) => {
  try {
    const { page, propertyId } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');
    
    const connection = await pool.getConnection();
    
    // Track analytics event
    await connection.execute(
      'INSERT INTO analytics (event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      ['page_view', JSON.stringify({ page, propertyId }), ip_address, user_agent]
    );

    // If it's a property view, increment the property views count
    if (propertyId) {
      await connection.execute(
        'UPDATE properties SET views_count = views_count + 1 WHERE id = ?',
        [propertyId]
      );
    }
    
    connection.release();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ success: false, message: 'Failed to track page view' });
  }
});

// Get all active properties with improved image handling
app.get('/api/properties', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM properties WHERE status = "active" ORDER BY created_at DESC'
    );
    
    // Process properties to ensure proper image handling
    const processedProperties = rows.map(property => {
      // Parse JSON fields
      if (property.features && typeof property.features === 'string') {
        try {
          property.features = JSON.parse(property.features);
        } catch (e) {
          property.features = [];
        }
      }
      
      if (property.neighborhood_info && typeof property.neighborhood_info === 'string') {
        try {
          property.neighborhood_info = JSON.parse(property.neighborhood_info);
        } catch (e) {
          property.neighborhood_info = {};
        }
      }
      
      if (property.images && typeof property.images === 'string') {
        try {
          property.images = JSON.parse(property.images);
        } catch (e) {
          property.images = property.image ? [property.image] : [];
        }
      } else if (!property.images && property.image) {
        property.images = [property.image];
      }
      
      return property;
    });
    
    connection.release();
    res.json(processedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
});

// Get property images
app.get('/api/properties/:id/images', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT images, image FROM properties WHERE id = ? AND status = "active"',
      [propertyId]
    );
    
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    const property = rows[0];
    let imageUrls = [];
    
    if (property.images) {
      try {
        imageUrls = JSON.parse(property.images);
      } catch (e) {
        imageUrls = property.image ? [property.image] : [];
      }
    } else if (property.image) {
      imageUrls = [property.image];
    }
    
    connection.release();
    res.json(imageUrls);
  } catch (error) {
    console.error('Error fetching property images:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch property images' });
  }
});

// Get single property by ID with detailed information
app.get('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM properties WHERE id = ? AND status = "active"',
      [propertyId]
    );
    
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    const property = rows[0];
    
    // Parse JSON fields if they exist
    if (property.features && typeof property.features === 'string') {
      try {
        property.features = JSON.parse(property.features);
      } catch (e) {
        property.features = [];
      }
    }
    
    if (property.neighborhood_info && typeof property.neighborhood_info === 'string') {
      try {
        property.neighborhood_info = JSON.parse(property.neighborhood_info);
      } catch (e) {
        property.neighborhood_info = {};
      }
    }
    
    if (property.images && typeof property.images === 'string') {
      try {
        property.images = JSON.parse(property.images);
      } catch (e) {
        property.images = property.image ? [property.image] : [];
      }
    } else if (!property.images && property.image) {
      property.images = [property.image];
    }
    
    // Increment views count
    await connection.execute(
      'UPDATE properties SET views_count = views_count + 1 WHERE id = ?',
      [propertyId]
    );
    
    connection.release();
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch property details' });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`TrueView Reality backend server running on port ${PORT}`);
    console.log('Database connection established');
    console.log('Admin dashboard available at /admin-dashboard');
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});
