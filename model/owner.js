const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const Product = require('../model/product')
const {isEmail, isMobilePhone} = require('validator')

const ownerSchema = mongoose.Schema({
  email:{
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
  companyName: {
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
  token: {
    type: String
  }
})

ownerSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "seller",
});

ownerSchema.methods.generateOwnerAuthToken = async function() {
  const owner = this
  const token = jwt.sign({ _id: owner._id.toString() }, process.env.JWT_SECRET_OWNER)
  owner.token = token 
  owner.save()
  return token
}

ownerSchema.statics.findOwnerByCredentials = async (email, password) => {
  const owner = await Owner.findOne({email})
  if(!owner) throw new Error("Unable to login owner.")
  const isMatch = await bcrypt.compare(password, owner.password)
  if (!isMatch) throw new Error("Unable to login owner. Incorrect Password.")
  return owner
}

// Hash the plain text password before saving
ownerSchema.pre("save", async function (next) {
  const owner = this;
  if (owner.isModified("password")) {
    owner.password = await bcrypt.hash(owner.password, 8);
  }
  next();
})

// Delete owner's product when owner is deleted
ownerSchema.pre("remove", async function(next){
  const owner = this
  await Product.deleteMany({seller: owner._id})
  next()
})

const Owner = mongoose.model('Owner', ownerSchema)

module.exports = Owner