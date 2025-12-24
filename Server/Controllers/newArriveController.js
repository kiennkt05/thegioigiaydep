const newArrive = require('../Models/newArrive.model')

const createNewArrivals = async (req, res) => {
     try {
          const { title, img, price, category } = req.body;

          const newProduct = new newArrive({
               title,
               img,
               price,
               category,
          });

          const savedProduct = await newProduct.save()
          res.status(201).json({
               message: 'new arrivals created successfully',
               product: savedProduct,
          });
     } catch (error) {
          console.error('Error creating product:', error)
          res.status(400).json({ message: error.message })
     }
};

const getcreateNewArrivals = async (req, res) => {
     try {
          const products = await newArrive.find()
          res.status(200).json(products);
     } catch (error) {
          console.error('Error fetching products:', error)
          res.status(500).json({ message: error.message })
     }
};

module.exports = {
     createNewArrivals,
     getcreateNewArrivals
};
