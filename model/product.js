const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    trim: true,
    lowercase: true
  },
  color: {
    type: String,
    trim: true,
    lowercase: true
  },
  size: {
    type: String,
    trim: true,
    lowercase: true
  },
  description: {
      type: String,
      trim: true
  },
  price: {
    type: Number
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Owner'
  }
},{
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product