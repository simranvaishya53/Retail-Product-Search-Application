  const express = require('express');
  const axios = require('axios');
  const router = express.Router();

    router.get('/autocomplete-zip', async (req, res) => {
      try {
        const { zipPrefix } = req.query;
        if (!zipPrefix) {
          res.status(400).json({ error: 'Zip prefix is required' });
          return;
        }

        // Replace 'YOUR_USERNAME' with your actual Geonames username
        const username = process.env.GEONAMES_USERNAME;
        const maxRows = 5; // Limit the number of suggestions
        const geonamesApiUrl = `http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${zipPrefix}&maxRows=${maxRows}&username=${username}&country=US`;
        const response = await axios.get(geonamesApiUrl);
        const suggestions = response.data.postalCodes
              .map((code) => code.postalCode) // Extract postalCode property
              .filter((postalCode) => postalCode !== null && postalCode !== undefined);

        res.json({ suggestions });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });


  module.exports = router;