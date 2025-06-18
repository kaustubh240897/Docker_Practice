const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Get backend URL from environment variable with a default fallback
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const { name } = req.body;
        
        if (!name) {
            console.log('Name is missing in request');
            return res.status(400).json({ error: 'Name is required' });
        }

        console.log('Sending to backend:', { name });
        
        const response = await axios.post(`${BACKEND_URL}/process`, 
            { name }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Backend response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        
        let errorMessage = 'An unknown error occurred';
        let statusCode = 500;
        
        if (error.response) {
            statusCode = error.response.status;
            errorMessage = error.response.data.error || 
                         error.response.data.message || 
                         'Backend responded with an error';
        } else if (error.request) {
            errorMessage = 'No response received from backend server. Is it running?';
        } else {
            errorMessage = error.message;
        }
        
        res.status(statusCode).json({ 
            error: errorMessage,
            details: error.config ? `Request to ${error.config.url} failed` : ''
        });
    }
});

app.listen(port, () => {
    console.log(`Frontend server running at http://localhost:${port}`);
});