const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklist.controller');

router.get('/', blacklistController.getBlacklist);
router.get('/search', blacklistController.searchBlacklist);
router.post('/', blacklistController.addBlacklist);
router.put('/:id', blacklistController.updateBlacklist);
router.delete('/:id', blacklistController.deleteBlacklist);

module.exports = router;