require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Sendinblue API key from .env file
const apiKey = process.env.SENDINBLUE_API_KEY;

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = apiKey;
const contactsApi = new SibApiV3Sdk.ContactsApi();

module.exports = async (req, res) => {
  if (req.method === 'POST') {
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
      return res.status(200).json({ message: 'Subscription successful!' });
    } catch (error) {
      console.error('Error:', error.response?.body || error);
      return res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
    }
  } else {
    // If the method is not POST, return a 405 (Method Not Allowed) error
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
