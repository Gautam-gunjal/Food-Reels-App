const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const authroutes = require('./routes/auth.route')
const foodPartnerRoutes = require("./routes/food-partner.route")
const foodroutes = require("./routes/food.route")
const app=express();
 

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://food-reels-app.onrender.com",
    credentials:true
}));
app.use('/api/auth',authroutes)
app.use('/api/food-partner', foodPartnerRoutes)
app.use("/api/food", foodroutes)

app.get("/",(req,res)=>{
    res.send("hello!")
   
})

module.exports = app;