const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  billingAddress: {
    type: String,
    require: true
  },
  orderDate: {
    type: String,
    required: true
  },
  deliveryDate: Date,
  paymentMethod: {
    type: String,
    required: true
  },
  totalPayment: {
    type: Number,
    required: true
  },
  specialRequest: String,
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

orderSchema.virtual("orderItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "associatedOrder",
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order