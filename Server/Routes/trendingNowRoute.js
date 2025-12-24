const express = require('express');
const trendingNowController = require('../Controllers/trendingNowController')

const trendingNowRouter = express.Router()


trendingNowRouter.post('/', trendingNowController.trendingNow)
trendingNowRouter.get('/', trendingNowController.gettrendingNow)

module.exports = trendingNowRouter;
