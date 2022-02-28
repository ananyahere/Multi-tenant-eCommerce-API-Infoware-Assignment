const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const Order = require('../model/order')
const {isEmail, isMobilePhone} = require('validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!isEmail(value)) throw new Error("Invalid Email");
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    validate(value) {
      if (!isMobilePhone(value)) throw new Error("Invalid Mobile Phone");
    }
  },
  avatar: {
    type: Buffer
  },
  token: {
    type: String,
  }
},
{
  timestamps: true
})

userSchema.virtual("orderHistory", {
  ref: "Order",
  localField: "_id",
  foreignField: "buyer",
})

userSchema.methods.generateUserAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_USER);

  //add token to db
  user.token = token
  user.save();

  return token;
};

userSchema.statics.findUserByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Unable to login user");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Unable to login user. Incorrect password.");

  return user;
}

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user's orders when user is deleted
userSchema.pre("remove", async function (next) {
  const user = this
  // remove all the orders associated with this buyer
  await Order.deleteMany({buyer: user._id})
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User