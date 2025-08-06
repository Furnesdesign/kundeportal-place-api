import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const allowedOrigins = [
  'https://kunda-demo.webflow.io',
  // legg til flere domener her
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.get('/getPlaceDetails', async (req, res) => {
  const placeId = req.query.placeId;
  if (!placeId) return res.status(400).json({ error: 'Missing placeId' });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,opening_hours&language=nb&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.status !== 'OK') {
      return res.status(500).json({ error: json.error_message || 'Google API error' });
    }

    const result = json.result;

    res.json({
      name: result.name,
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      reviews: result.reviews,
      opening_hours: result.opening_hours,
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

