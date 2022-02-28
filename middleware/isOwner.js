const jwt = require("jsonwebtoken")
const Owner = require('../model/owner')

const isOwner = async  (req, res, next) => {
  try{
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_OWNER);
    const owner = await Owner.findOne({
      _id: decoded._id,
      token
    })
    if(!owner) throw new Error()
    req.OwnerToken = token
    req.owner = owner
    next()
  }catch(e){
    console.log(e)
    res.status(401).send({ error: `Please authenticate as owner.` })
  }
}

module.exports = isOwner