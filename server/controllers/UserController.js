const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc Register user
// @route POST /api/users
// @acess Private
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const alreadyRegistered = await User.findOne({ username });
  if (alreadyRegistered) {
    res.status(400);
    throw new Error("Username already taken");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ username, password: hashedPassword });
  if (!user) {
    res.status(400);
    throw new Error("Error creating user");
  }

  setJWTCookie(res, user.id);

  res.status(201).json({
    _id: user.id,
    username: user.username,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Error("Please enter all credentials");
  }

  const registeredUser = await User.findOne({ username });
  if (!registeredUser) {
    res.status(400);
    throw new Error("User not found");
  }

  if (!(await bcrypt.compare(password, registeredUser.password))) {
    res.status(403);
    throw new Error("Incorrect password");
  }

  setJWTCookie(res, registeredUser.id);

  res.status(200).json({
    _id: registeredUser.id,
    username: username,
  });
});

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const setJWTCookie = (res, id) => {
  return res.cookie("jwt", generateJWT(id), {
    path: "/",
    expires: new Date(Date.now() + 86400000),
    domain: "localhost",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
};

module.exports = {
  registerUser,
  loginUser,
};
