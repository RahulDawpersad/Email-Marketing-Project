// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sendinblue API key from .env file
const apiKey = process.env.SENDINBLUE_API_KEY;  // Retrieve the API key from environment variable

// Set up the Sendinblue client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = apiKey;

const contactsApi = new SibApiV3Sdk.ContactsApi();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle email subscription
app.post('/subscribe', async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const contactData = {
    email: email,
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
    },
    listIds: [7], // Replace with your list ID
    updateEnabled: true,
  };

  try {
    await contactsApi.createContact(contactData);
    res.status(200).json({ message: 'Subscription successful!' });
  } catch (error) {
    console.error('Error:', error.response?.body || error);
    res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
  }
});

// Catch-all route to serve index.html for undefined routes (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
