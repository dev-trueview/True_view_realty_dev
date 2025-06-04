
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'property-images')));

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '0844', // Update with your MySQL password
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

// Database initialization
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create properties table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS properties (
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
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// API Routes

// Submit enquiry
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, email, phone, message, property } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO enquiries (name, email, phone, message, property) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, message, property]
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

// Auto-sync properties from folder
async function syncPropertiesFromFolder() {
  try {
    const propertyImagesDir = path.join(__dirname, 'property-images');
    
    // Create directory if it doesn't exist
    try {
      await fs.access(propertyImagesDir);
    } catch {
      await fs.mkdir(propertyImagesDir, { recursive: true });
      console.log('Created property-images directory');
    }
    
    const files = await fs.readdir(propertyImagesDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    const connection = await pool.getConnection();
    
    for (const imageFile of imageFiles) {
      // Extract property info from filename (format: id_type_location_price.jpg)
      const fileNameParts = path.parse(imageFile).name.split('_');
      
      if (fileNameParts.length >= 4) {
        const [id, type, location, price] = fileNameParts;
        
        // Check if property already exists
        const [existing] = await connection.execute(
          'SELECT id FROM properties WHERE id = ?',
          [parseInt(id)]
        );
        
        if (existing.length === 0) {
          // Insert new property with default values
          await connection.execute(`
            INSERT INTO properties (id, image, price, location, type, bedrooms, bathrooms, sqft, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
          `, [
            parseInt(id),
            `/images/${imageFile}`,
            price.replace(/-/g, ' '),
            location.replace(/-/g, ' '),
            type.replace(/-/g, ' '),
            Math.floor(Math.random() * 4) + 2, // Random bedrooms 2-5
            Math.floor(Math.random() * 3) + 1, // Random bathrooms 1-3
            Math.floor(Math.random() * 2000) + 1000 // Random sqft 1000-3000
          ]);
          
          console.log(`Added new property: ${imageFile}`);
        }
      }
    }
    
    // Remove properties that no longer have corresponding image files
    const [allProperties] = await connection.execute('SELECT id, image FROM properties');
    
    for (const property of allProperties) {
      const imagePath = path.join(propertyImagesDir, path.basename(property.image));
      try {
        await fs.access(imagePath);
      } catch {
        // Image file doesn't exist, remove from database
        await connection.execute('DELETE FROM properties WHERE id = ?', [property.id]);
        console.log(`Removed property with missing image: ${property.image}`);
      }
    }
    
    connection.release();
  } catch (error) {
    console.error('Error syncing properties:', error);
  }
}

// Get all active properties
app.get('/api/properties', async (req, res) => {
  try {
    // Sync properties before fetching
    await syncPropertiesFromFolder();
    
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM properties WHERE status = "active" ORDER BY created_at DESC'
    );
    connection.release();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
});

// Get property images
app.get('/api/properties/:id/images', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const propertyImagesDir = path.join(__dirname, 'property-images');
    
    const files = await fs.readdir(propertyImagesDir);
    const propertyImages = files.filter(file => 
      file.startsWith(`${propertyId}_`) && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    const imageUrls = propertyImages.map(file => `/images/${file}`);
    res.json(imageUrls);
  } catch (error) {
    console.error('Error fetching property images:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch property images' });
  }
});

// Auto-sync properties every 30 seconds
setInterval(syncPropertiesFromFolder, 30000);

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`TrueView Reality backend server running on port ${PORT}`);
    console.log('Database connection established');
    syncPropertiesFromFolder(); // Initial sync
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});
