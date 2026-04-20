const db = require('../config/db');
const fs = require('fs');
const path = require('path');

/**
 * SELECT weighted random active ad within date range
 * Higher priority = Higher probability
 */
exports.getRandomAd = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sql = `
      SELECT * FROM ads 
      WHERE active = 1 
      AND (start_date IS NULL OR start_date <= $1)
      AND (end_date IS NULL OR end_date >= $1)
    `;
    const result = await db.query(sql, [today]);
    const ads = result.rows;
    
    if (ads.length === 0) {
      return res.status(404).json({ message: 'No active ads found' });
    }

    // Weighted Picking Algorithm (Option 2 - Pro)
    const totalWeight = ads.reduce((sum, ad) => sum + (ad.priority || 1), 0);
    let randomThreshold = Math.random() * totalWeight;

    let selectedAd = ads[0];
    for (const ad of ads) {
      if (randomThreshold < (ad.priority || 1)) {
        selectedAd = ad;
        break;
      }
      randomThreshold -= (ad.priority || 1);
    }
    
    res.json(selectedAd);
  } catch (err) {
    console.error('Error fetching weighted ad:', err);
    res.status(500).json({ message: 'Error fetching ad' });
  }
};

/**
 * List all ads (Admin)
 */
exports.getAllAds = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all ads:', err);
    res.status(500).json({ message: 'Error fetching ads' });
  }
};

/**
 * Create Ad
 */
exports.createAd = async (req, res) => {
  const { title, url, start_date, end_date, priority } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO ads (title, url, image, start_date, end_date, priority) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const result = await db.query(sql, [
      title, 
      url, 
      image, 
      start_date || null, 
      end_date || null, 
      parseInt(priority) || 1
    ]);
    
    const newId = result.lastID;
    const fetchNew = await db.query('SELECT * FROM ads WHERE id = $1', [newId]);
    
    res.status(201).json(fetchNew.rows[0]);
  } catch (err) {
    console.error('Error creating ad:', err);
    res.status(500).json({ message: 'Error creating ad' });
  }
};

/**
 * Update Ad
 */
exports.updateAd = async (req, res) => {
  const { id } = req.params;
  const { title, url, active, start_date, end_date, priority } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    let sql = 'UPDATE ads SET title = $1, url = $2, active = $3, start_date = $4, end_date = $5, priority = $6';
    const params = [
      title, 
      url, 
      active === 'true' || active === true ? 1 : 0, 
      start_date || null, 
      end_date || null,
      parseInt(priority) || 1
    ];
    
    if (image) {
      sql += ', image = $7 WHERE id = $8';
      params.push(image, id);
    } else {
      sql += ' WHERE id = $7';
      params.push(id);
    }

    await db.query(sql, params);
    res.json({ message: 'Ad updated successfully' });
  } catch (err) {
    console.error('Error updating ad:', err);
    res.status(500).json({ message: 'Error updating ad' });
  }
};

/**
 * Delete Ad
 */
exports.deleteAd = async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await db.query('SELECT image FROM ads WHERE id = $1', [id]);
    if (ad.rows.length > 0 && ad.rows[0].image) {
      const filePath = path.join(__dirname, '../../', ad.rows[0].image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query('DELETE FROM ads WHERE id = $1', [id]);
    res.json({ message: 'Ad deleted successfully' });
  } catch (err) {
    console.error('Error deleting ad:', err);
    res.status(500).json({ message: 'Error deleting ad' });
  }
};

/**
 * Track Impression
 */
exports.trackImpression = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE ads SET impressions = impressions + 1 WHERE id = $1', [id]);
    res.json({ message: 'Impression tracked' });
  } catch (err) {
    res.status(500).json({ message: 'Error tracking impression' });
  }
};

/**
 * Track Click
 */
exports.trackClick = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE ads SET clicks = clicks + 1 WHERE id = $1', [id]);
    res.json({ message: 'Click tracked' });
  } catch (err) {
    res.status(500).json({ message: 'Error tracking click' });
  }
};
