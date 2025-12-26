const trendingNow = require('../Models/trendingNow.model');
const productService = require('../Services/productService');

const createTrendingNow = async (req, res) => {
     // ...
};

const gettrendingNow = async (req, res) => {
     try {
          const specialItems = await trendingNow.find({}, '_id');
          const ids = specialItems.map(item => item._id);

          const result = await productService.getProducts({
               ...req.query,
               ids
          });

          res.status(200).json(result);
     } catch (error) {
          console.error("Error fetching Trending Now:", error);
          res.status(500).json({ message: error.message });
     }
};


module.exports = {
     trendingNow,
     gettrendingNow
};
