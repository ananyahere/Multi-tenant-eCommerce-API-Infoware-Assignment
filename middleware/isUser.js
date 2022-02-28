const jwt = require("jsonwebtoken")
const User = require('../model/user')

const isUser = async (req, res, next) => {
  try{
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER)
    const user = await User.findOne({
      _id: decoded._id,
      token
    })
    if (!user) throw new Error();

    req.userToken = token;
    req.user = user;
    next();
  }catch(e){
    console.log(e)
    res.status(401).send({ error: `Please authenticate as user.` })
  }
}

module.exports = isUser