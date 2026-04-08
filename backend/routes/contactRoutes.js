const express = require('express');
const { submitContact, getAllContacts } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, adminOnly, getAllContacts);

module.exports = router;
