const usermodel = require("../models/user.model")
const foodPartnermodel = require("../models/foodPartner.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//User auth controllers
async function registeruser(req, res) {
    const { name, email, password } = req.body;

    const isUseralreadyexist = await usermodel.findOne({
        email
    })

    if (isUseralreadyexist) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashpassword = await bcrypt.hash(password, 10)

    const user = await usermodel.create({
        name,
        email,
        password: hashpassword
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        secure: true,
        sameSite: "None"
    });
    res.status(201).json({
        message: "User created succesfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

async function loginuser(req, res) {

    const { email, password } = req.body;

    const user = await usermodel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const hashpassword = await bcrypt.compare(password, user.password)

    if (!hashpassword) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        secure: true,
        sameSite: "None"
    });

    res.status(200).json({
        message: "User Login Successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }

    })
}

function logoutuser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out Successfully"
    })
}
//User auth controllers



//Food-Partner auth controllers
async function registerfoodPartner(req, res) {
    const { Businessname, Contactperson, Address, email, password } = req.body;

    const accountExists = await foodPartnermodel.findOne({
        email
    })

    if (accountExists) {
        return res.status(400).json({
            message: "food partner account already exists"
        })
    }

    const hashpassword = await bcrypt.hash(password, 10)

    const foodPartner = await foodPartnermodel.create({
        Businessname,
        Contactperson,
        Address,
        email,
        password: hashpassword
    })

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        secure: true,
        sameSite: "None"
    });

    res.status(201).json({
        message: "food partner register successfully",
        foodPartner: {
            id: foodPartner._id,
            Businessname: foodPartner.Businessname,
            Contactperson: foodPartner.Contactperson,
            Address: foodPartner.Address,
            email: foodPartner.email
        }
    })

}

async function loginfoodPartner(req, res) {
    const { email, password } = req.body;

    const foodPartner = await foodPartnermodel.findOne({
        email
    })

    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const hashpassword = await bcrypt.compare(password, foodPartner.password)

    if (!hashpassword) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        secure: true,
        sameSite: "None"
    });
    res.status(201).json({
        message: "Food-Partner login successfully",
        foodPartner: {
            id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email
        }

    })
}

function foodPartnerlogout(req, res) {
    res.clearCookie("token")
    res.status(201).json({
        message: "food-partner logout successfully"
    })
}
//Food-Partner auth controllers



async function RoleDetection(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'Please Login First'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await usermodel.findById(decoded.id)
        if (user) {
            return res.json({
                role: 'user'
            })
        }

        const foodpartner = await foodPartnermodel.findById(decoded.id)
        if (foodpartner) {
            return res.json({
                role: 'foodPartner'
            })
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
module.exports = {
    registeruser,
    loginuser,
    logoutuser,
    registerfoodPartner,
    loginfoodPartner,
    foodPartnerlogout,
    RoleDetection
}