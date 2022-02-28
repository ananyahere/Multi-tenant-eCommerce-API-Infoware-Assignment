const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  assoicatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  assoicatedBuyer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  associatedSeller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  associatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  count: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const OrderItem = mongoose.model('OrderItem', orderItemSchema)

module.exports = OrderItem