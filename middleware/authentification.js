const {verifyToken} = require('../helper/jwt')
<<<<<<< HEAD
const user = require('../module/masterUser/model')
=======
const user = require('../module/user/model')
>>>>>>> c18e09ce7879a1c5ed657d0ceb77d799163e8261

async function authentification(req,res,next){
    
try {
    var decode = verifyToken(req.headers.token);
    user.findAll({
        where:{
            id : decode.id,
            password:decode.password
        }
    })
    .then(data=>{
        //  console.log(data.length)
        if(data.length>0){ 
            // console.log("masuk data")
            req.dataUsers=decode
            next()
        }
        else{
            // console.log("masuk else")
            res.status(200).json({ status: 200, message: "anda belum login" });
        }
    })
  } catch(err) {
    res.status(200).json({ status: 200, message: "anda belum login" });
  }

  
}

module.exports = authentification
