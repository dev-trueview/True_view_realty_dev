
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Serve static images with proper headers
app.use('/images', express.static(path.join(__dirname, 'property-images'), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0' 
  });
});

// Ensure property-images directory exists
const ensureDirectoryExists = async () => {
  const dir = path.join(__dirname, 'property-images');
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
    console.log('Created property-images directory');
  }
};

// Enhanced multer configuration with better error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'property-images'));
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const propertyId = req.body.propertyId || timestamp;
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${propertyId}_${timestamp}_${safeName}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Database configuration with connection pooling
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '0844',
  database: 'trueview_reality',
  port: 3306
};

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Enhanced database initialization
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // Create enquiries table
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at),
        INDEX idx_email (email)
      )
    `);
    
    // Create properties table with enhanced schema
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(500),
        images JSON,
        price VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        bedrooms INT NOT NULL,
        bathrooms DECIMAL(3,1) NOT NULL,
        sqft INT NOT NULL,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_type (type),
        INDEX idx_location (location),
        INDEX idx_created_at (created_at)
      )
    `);

    // Create analytics table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_event_type (event_type),
        INDEX idx_created_at (created_at)
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Enhanced error handling middleware
const handleError = (res, error, message = 'Internal server error') => {
  console.error('Error:', error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ 
    success: false, 
    message: message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    timestamp: new Date().toISOString()
  });
};

// API Routes

// Submit enquiry with analytics tracking
app.post('/api/enquiries', async (req, res) => {
  let connection;
  try {
    const { name, email, phone, message, property } = req.body;
    
    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required fields'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');
    
    connection = await pool.getConnection();
    
    // Insert enquiry
    const [result] = await connection.execute(
      'INSERT INTO enquiries (name, email, phone, message, property, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), phone.trim(), message?.trim(), property?.trim(), ip_address, user_agent]
    );

    // Track analytics event
    await connection.execute(
      'INSERT INTO analytics (event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      ['enquiry_submitted', JSON.stringify({ property, enquiry_id: result.insertId }), ip_address, user_agent]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Enquiry submitted successfully',
      id: result.insertId 
    });
  } catch (error) {
    handleError(res, error, 'Failed to submit enquiry');
  } finally {
    if (connection) connection.release();
  }
});

// Get all enquiries with pagination
app.get('/api/enquiries', async (req, res) => {
  let connection;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    // Get total count
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM enquiries');
    const total = countResult[0].total;
    
    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch enquiries');
  } finally {
    if (connection) connection.release();
  }
});

// Add new property listing (Admin feature)
app.post('/api/properties', upload.array('images', 10), async (req, res) => {
  let connection;
  try {
    console.log('Property insertion request received');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);

    const {
      price, location, type, bedrooms, bathrooms, sqft, year_built,
      description, features, neighborhood_info
    } = req.body;

    // Comprehensive validation
    const requiredFields = { price, location, type, bedrooms, bathrooms, sqft };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate numeric fields
    const numericFields = {
      bedrooms: parseInt(bedrooms),
      bathrooms: parseFloat(bathrooms),
      sqft: parseInt(sqft),
      year_built: year_built ? parseInt(year_built) : null
    };

    if (numericFields.bedrooms < 0 || numericFields.bedrooms > 50) {
      return res.status(400).json({
        success: false,
        message: 'Bedrooms must be between 0 and 50'
      });
    }

    if (numericFields.bathrooms < 0 || numericFields.bathrooms > 50) {
      return res.status(400).json({
        success: false,
        message: 'Bathrooms must be between 0 and 50'
      });
    }

    if (numericFields.sqft < 1 || numericFields.sqft > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Square footage must be between 1 and 100,000'
      });
    }

    connection = await pool.getConnection();
    
    // Parse JSON fields safely
    let parsedFeatures = [];
    let parsedNeighborhood = {};
    
    try {
      parsedFeatures = features ? JSON.parse(features) : [];
    } catch (e) {
      console.log('Features parsing error:', e);
      parsedFeatures = [];
    }
    
    try {
      parsedNeighborhood = neighborhood_info ? JSON.parse(neighborhood_info) : {};
    } catch (e) {
      console.log('Neighborhood info parsing error:', e);
      parsedNeighborhood = {};
    }
    
    // Handle uploaded images
    const imageUrls = req.files ? req.files.map(file => `/images/${file.filename}`) : [];
    const primaryImage = imageUrls[0] || null;
    
    console.log('Image URLs:', imageUrls);
    
    // Insert new property
    const [result] = await connection.execute(`
      INSERT INTO properties (
        image, images, price, location, type, bedrooms, bathrooms, sqft, 
        year_built, description, features, neighborhood_info, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `, [
      primaryImage,
      JSON.stringify(imageUrls),
      price.trim(),
      location.trim(),
      type.trim(),
      numericFields.bedrooms,
      numericFields.bathrooms,
      numericFields.sqft,
      numericFields.year_built,
      description?.trim() || '',
      JSON.stringify(parsedFeatures),
      JSON.stringify(parsedNeighborhood)
    ]);
    
    console.log('Property inserted successfully with ID:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      id: result.insertId,
      images: imageUrls
    });
  } catch (error) {
    console.error('Property insertion error:', error);
    // Clean up uploaded files if database insertion fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path).catch(console.error);
      });
    }
    handleError(res, error, 'Failed to add property');
  } finally {
    if (connection) connection.release();
  }
});

// Get all active properties with enhanced image processing
app.get('/api/properties', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM properties WHERE status = "active" ORDER BY created_at DESC'
    );
    
    // Process properties to ensure proper image handling
    const processedProperties = rows.map(property => {
      // Parse JSON fields safely
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
    
    res.json(processedProperties);
  } catch (error) {
    handleError(res, error, 'Failed to fetch properties');
  } finally {
    if (connection) connection.release();
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

// Initialize and start server
const startServer = async () => {
  try {
    await ensureDirectoryExists();
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`TrueView Reality backend server running on port ${PORT}`);
      console.log('Database connection established');
      console.log('Health check available at /api/health');
      console.log(`Static images served from /images/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
