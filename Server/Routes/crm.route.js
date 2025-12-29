const express = require('express');
const { getHistory, sendMessage, resolve } = require('../Controllers/crmController');

const crmRouter = express.Router();

crmRouter.get('/:userId', getHistory);
crmRouter.post('/message', sendMessage);
crmRouter.post('/resolve/:userId', resolve);

module.exports = crmRouter;
