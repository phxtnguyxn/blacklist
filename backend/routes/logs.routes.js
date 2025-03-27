const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs.controller');

router.get('/', logsController.getFullLogs);
router.post('/', logsController.getFilteredLogs);

module.exports = router;