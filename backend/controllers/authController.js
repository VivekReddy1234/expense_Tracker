const jwt = require('jsonwebtoken');
const User = require('../models/User');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    profileImageUrl,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
}


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
        res.cookie("jwt",token,{
          httpOnly:true,
          secure:true,
          sameSite: "strict",
          maxAge: 7*24*60*60*1000
        });

        res.json({user});
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}


const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'User logged out successfully' });
}   

const getUserInfo = async (req, res) => {
  
  const user = await User.findById(req.user._id).select('-password');
  if (user) {   
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }         
}


module.exports = {
  registerUser,     
    loginUser,
    logoutUser,
    getUserInfo,
    generateToken,
};