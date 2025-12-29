const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const connection = require('./config/db')
const logger = require('./utils/logger')
const { errorHandler, notFound } = require('./Middlewares/errorMiddleware')

const userRouter = require('./Routes/user.route')
const productRouter = require('./Routes/specialProduct.route')
const trendingNowProducts = require('./Routes/trendingNowRoute')
const newProductRouter = require('./Routes/newProduct.route')
const menProductRouter = require('./Routes/menProduct.route')
const womenProductRouter = require('./Routes/womenProduct.route')
const kidsProductRouter = require('./Routes/kidsProduct.route')
const newArrivalsRoutes = require("./Routes/newArrive.route")
const unifiedProductRouter = require('./Routes/product.route')
const cartRouter = require('./Routes/cart.route')
const orderRouter = require('./Routes/order.route')
const reviewRouter = require('./Routes/review.route')
const adminRouter = require('./Routes/admin.route')
const crmRouter = require('./Routes/crm.route')
const { requestLogger } = require('./utils/monitoring')
const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use("/user", userRouter);
app.use('/api/special_products', productRouter)
app.use('/api/trending_now', trendingNowProducts)
app.use('/api/new_products', newProductRouter)
app.use('/api/mens_products', menProductRouter)
app.use("/api/womens_products", womenProductRouter)
app.use("/api/kids_products", kidsProductRouter)
app.use('/api/new_arrivals', newArrivalsRoutes)
app.use('/api/products', unifiedProductRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/admin", adminRouter)
app.use("/api/crm", crmRouter)
const PORT = process.env.PORT || 3000;

app.post("/", (req, res) => {
    res.send("server is started");
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
    try {
        await connection;
        logger.info(`Server is connected with MongoDB and running on port ${PORT}`);
    } catch (error) {
        logger.error(`Database connection error: ${error.message}`);
    }
});
