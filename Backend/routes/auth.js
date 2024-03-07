const express = require('express')
const User = require('../models/User');
const bcrypt = require('bcryptjs');     // Package for password encryption
const { body, validationResult } = require('express-validator');   // Package for validation
const router = express.Router();
const jwt = require('jsonwebtoken');  // Package for jwt web token
const fetchuser = require("../middleware/fetchuser")

const JWT_SECRET = "Projectmadebydevesh";

// Creating a User using : POST "/api/auth/"    No login required
router.post('/createuser',[
    body('Name', 'Enter a valid Name').isLength({min : 4}).notEmpty(),
    body ('Email' , 'Enter a valid Email').isEmail(),
    body('password' ," Password must contain minimum 6 letters").isLength({min : 6}),
] , async(req , res) =>{
  let success = false;
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({ success , errors: errors.array()});
   }
   try {

    // Logic to check whether the email is unqiue or not
    // user = User.findOne({Email : req.body.Email})
    // if(user){
    //     return res.status(400).json("Sorry a User with this email already exists ")
    // }

    // Creating a user using User.create() method of mongoose
     
    const salt = await bcrypt.genSalt(10);   // for generating hash pattern for passwords
    const secPass = await bcrypt.hash(req.body.password , salt)   // for storing password and salt in the database
    const user = await User.create({
      Name: req.body.Name,
      Email: req.body.Email,
      password: secPass
    });

    const data={
    user:{
      id : user.id
    }
    }
    const authtoken = jwt.sign(data ,JWT_SECRET);
    // console.log(authtoken);
    // res.json(user);
   success = true
    res.json({  success ,  authtoken});
  }
  // Catching errors 
  catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ success, error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ success , error: 'Server error' });
  }

})

router.post('/login', [
  body('Email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { Email, password } = req.body;
  try {
    let user = await User.findOne({ Email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})  



module.exports = router