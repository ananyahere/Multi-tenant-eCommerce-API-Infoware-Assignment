const express = require("express")
const isUser = require('../middleware/isUser')
const User = require('../model/user')
const multer = require('multer')
const sharp = require('sharp')
const res = require("express/lib/response")
const router = new express.Router()

// signup
router.post("/users/signup", async(req, res) => {
  const user = new User(req.body)
  try{
    await user.save()
    const token = await user.generateUserAuthToken()
    res.send({user, token})
  }catch(e){
    res.status(400).send(e)
  }
})

//  login
router.post("/users/login", async(req,res) => {
  try{
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    )
    const token = await user.generateUserAuthToken();
    res.send({ user, token });
  }catch(e){
    res.status(400).send(e)
  }
})

// delete
router.delete("/users/me", isUser, async(req, res) => {
  try{
    await req.user.remove();
    res.send(req.user);
  }catch(e){
    res.status(500).send(e);
  }
})


const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
      return cb(new Error('Please upload an image(.jpeg, .png or .jpg)'))
    }
    cb(undefined, true)
  }
})

// upload profile pic
router.post("/users/me/avatar", isUser, async(req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

// delete profile pic
router.delete('/users/me/avatar', isUser, async (req, res) => {
  req.user.avatar = undefined 
  await req.user.save()
  res.status(200).send()
})


module.exports = router