const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;  // Keep your current port

// Serve static files from './src' directory
app.use(express.static('./src'));

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(200).send());

// Endpoint to fetch 50 random users
app.get('/api/users', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/?results=50');
        const users = response.data.results;
        res.json(users);  // Send the list of users as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
