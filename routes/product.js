const express = require("express")
const isOwner = require('../middleware/isOwner')
const isUser = require('../middleware/isUser')
const Product = require('../model/product')
const router = new express.Router()

// add single product
router.post("/product", isOwner, async(req, res) => {
  const product = new Product({
    ...req.body,
    seller: req.owner._id
  })
  try{
    await product.save()
    res.status(201).send(product)
  }catch(e){
    res.status(400).send(e)
  }

})

// add many products
router.post("/products", isOwner ,async(req,res) => {
  const inputArr = req.body
  const products =[]
  try{
    for(const item of inputArr){
      const {name, type, color, size, description, price} = item
      const product = {
        name,
        type,
        color,
        size,
        description, 
        price,
        seller: req.owner._id
      }
      products.push(product)
    }
    await Product.insertMany(products)
    res.status(201).send(products)
  }catch(e){
    console.log(e)
    res.status(400).send(e)
  }
})

// get all products
router.get("/products", isUser, async(req, res) => {
  try{
    const products = await Product.find().populate("seller", "_id companyName phone email").sort('-createdAt')
    res.status(200).send(products)
  }catch(e){
    res.status(500).send()
  }
})

module.exports = router