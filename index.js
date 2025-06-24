const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

app.get('/getPlaceDetails', async (req, res) => {
  const placeId = req.query.placeId;
  if (!placeId) {
    return res.status(400).json({ error: 'Place ID is required' });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,opening_hours&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error_message || data.status !== 'OK') {
      return res.status(500).json({
        error: 'Failed to fetch place details',
        details: data.error_message || data.status
      });
    }
    res.json(data.result);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...');
});