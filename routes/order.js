const express = require("express")
const isOwner = require('../middleware/isOwner')
const isUser = require('../middleware/isUser')
const Order = require('../model/order')
const OrderItem = require('../model/orderItem')
const router = new express.Router()

// place order
router.post("/orders", isUser, async(req, res)=> {
  // exampleof req.body
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
  const {billingAddress, orderDate, deliveryDate, paymentMethod, totalPayment, specialRequest, orderItems} = req.body
  const order = new Order({
    billingAddress,
    orderDate,
    deliveryDate,
    paymentMethod,
    totalPayment,
    specialRequest
  })
  const orderItemsArr=[]

  try{
    for(item in orderItems){
      const {assoicatedProduct, associatedSeller, count,price} = item
      const associatedOrder = order._id
      const order_item = new OrderItem({
        assoicatedProduct,
        associatedSeller,
        count,
        price,
        associatedOrder
      })
      orderItemsArr.push(order_item)
    }
    await OrderItem.insertMany(orderItemsArr)
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
router.get("/orders/:buyer_id", isOwner, async(req, res) => {
  const buyer_id = req.params.order_id
  try{
    const order = await Order.findOne({buyer: buyer_id})
    if(!order)
      return res.status(404).send({error: `No order with the buyer_id ${buyer_id} found.`})
    res.send(order)
  }catch(e){
    res.status(500).send();
  }
})

// get by order-date
router.get("/orders/:date", isOwner, async(req, res) => {
  const date = req.params.date
  try{
    const order = await Order.findOne({orderDate: date})
    if(!order)
      return res.status(404).send({error: `No order with the date ${date} found.`})
    res.send(order)
  }catch(e){
    res.status(500).send();
  }
})
