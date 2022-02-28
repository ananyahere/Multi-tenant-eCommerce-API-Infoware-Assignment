const express = require("express")
const isOwner = require('../middleware/isOwner')
const isUser = require('../middleware/isUser')
const Order = require('../model/order')
const OrderItem = require('../model/orderItem')
const router = new express.Router()

// place order
router.post("/orders", isUser, async(req, res)=> {

  //              EXAMPLE OF REQ.BODY
  // req.body = {
  //   billingAddress:"",
  //   orderDate:"",
  //   deliveryDate:"",
  //   paymentMethod:"",
  //   totalPayment: "",
  //   specialRequest: "",
  //   orderItems: [
  //     {
  //       assoicatedProduct: "id of product (from frontend)",
  //       assoicatedBuyer: "id of buyer (from backend)", 
  //       associatedSeller: "id of seller (from frontend)",
  //       associatedOrder: "id of newly created Order (from backend)",
  //       count: ""
  //     }
  //   ]
  // }

  const {billingAddress, paymentMethod, totalPayment, specialRequest, orderItems} = req.body
  const order = new Order({
    billingAddress,  
    paymentMethod,
    totalPayment,
    specialRequest
  })
  const orderItemsArr=[]

  try{
    let totalPayment = 0
    for(const item of orderItems){
      const {assoicatedProduct, associatedSeller, count,price} = item
      const associatedOrder = order._id
      const assoicatedBuyer = req.user._id
      const order_item = {
        assoicatedProduct,
        associatedSeller,
        count,
        price,
        associatedOrder,
        assoicatedBuyer
      }
      totalPayment = totalPayment + order_item.price
      orderItemsArr.push(order_item)
    }
    await OrderItem.insertMany(orderItemsArr)
    let today = new Date()
    let threeDaysLater = new Date()
    order.totalPayment = totalPayment
    order.orderDate = new Date().toString()
    order.deliveryDate = threeDaysLater.setDate(today.getDate() + 3).toString()
    order.buyer = req.user._id
    await order.save()
    res.status(201).send(order)
  }catch(e){
    res.status(500).send()
  }
})

// view user's order
router.get("/orders", isUser, async(req,res) => {
  const buyer_id = req.user._id
  try{
    const order = await Order.findOne({buyer: buyer_id})
    if(!order)
      return res.status(404).send({error: `No order with the buyer_id ${buyer_id} found.`})
    res.send(order)
  }catch(e){
    res.status(500).send();
  }
})

// get by order id
router.get("/orders/:order_id", isOwner,async(req,res)=> {
  const order_id = req.params.order_id
  try{
    const order = await Order.findOne({_id: order_id})
    if(!order)
      return res.status(404).send({error: `No order with id ${order_id} found.`})
    res.send(order)
  }catch(e){
    res.status(500).send();
  }
})

//  get by buyer id
router.get("/orders/buyer/:buyer_id", isOwner, async(req, res) => {
  const buyer_id = req.params.buyer_id
  try{
    const order = await Order.findOne({buyer: buyer_id})
    if(!order)
      return res.status(404).send({error: `No order with the buyer_id ${buyer_id} found.`})
    res.send(order)
  }catch(e){
    res.status(500).send();
  }
})

module.exports = router
