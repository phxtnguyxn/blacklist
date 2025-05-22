const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklist.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', blacklistController.getBlacklist);
router.post('/search/:id', blacklistController.searchBlacklist);
router.post('/', verifyToken, blacklistController.addBlacklist);
router.put('/:id', verifyToken, blacklistController.updateBlacklist);
router.delete('/:id', blacklistController.deleteBlacklist);

module.exports = router;


