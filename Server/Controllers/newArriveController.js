const newArrive = require('../Models/newArrive.model');
const productService = require('../Services/productService');

const createNewArrivals = async (req, res) => {
     // ... (no changes to creation)
};

const getcreateNewArrivals = async (req, res) => {
     try {
          // 1. Get all IDs in the NewArrival collection
          const specialItems = await newArrive.find({}, '_id');
          const ids = specialItems.map(item => item._id);

          // 2. Fetch full product details with all filters applied
          const result = await productService.getProducts({
               ...req.query,
               ids
          });

          res.status(200).json(result);
     } catch (error) {
          console.error('Error fetching New Arrivals:', error);
          res.status(500).json({ message: error.message });
     }
};

module.exports = {
     createNewArrivals,
     getcreateNewArrivals
};
