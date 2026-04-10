const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const authroutes = require('./routes/auth.route')
const foodPartnerRoutes = require("./routes/food-partner.route")
const foodroutes = require("./routes/food.route")
const healthRoute = require('./routes/health.route')
const app=express();
 

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://food-reels-app-self.vercel.app",
    credentials:true
}));
app.use('/api/auth',authroutes)
app.use('/api/food-partner', foodPartnerRoutes)
app.use("/api/food", foodroutes)
app.use("/api",healthRoute)


module.exports = app;