const express = require("express")
const isOwner = require('../middleware/isOwner')
const Owner = require('../model/owner')
const router = new express.Router()

// signup
router.post("/owners/signup", async(req, res) => {
  const owner = new Owner(req.body)
  try{
    await owner.save()
    const token = await owner.generateOwnerAuthToken()
    res.send({owner, token})
  }catch(e){
    res.status(400).send(e)
  }
})

// login
router.post("/owners/login", async(req,res) => {
  try{
    const owner = await Owner.findByCredentials(
      req.body.email,
      req.body.password
    )
    const token = await owner.generateOwnerAuthToken();
    res.send({ owner, token });
  }catch(e){
    res.status(400).send(e)
  }
})

// delete
router.delete("/owners/me", isOwner, async(req, res) => {
  try{
    await req.owner.remove()
    res.send(req.owner)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router