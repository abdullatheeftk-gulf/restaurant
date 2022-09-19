const JWT = require("jsonwebtoken");
const createError = require("http-errors");


module.exports = {
    signAccessToken: (deviceId) => {
      return new Promise((resolve, reject) => {
        const payload = {
          name:"abdul"
        };
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const option = {
          expiresIn: "1y",
          issuer: "gulfappdeveloper.com",
          audience: deviceId,
        };
        JWT.sign(payload, secret, option, (err, token) => {
          if (err) {
            
            reject(createError.InternalServerError());
          }
          resolve(token);
        });
      });
    },
    verifyAccessToken: (req, res, next) => {
      if (!req.headers["authorization"]) return next(createError.Unauthorized());
      const authHeader = req.headers["authorization"];
      const bearerToken = authHeader.split(" ");
      const token = bearerToken[1];
  
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          console.log(err.name);
          if (err.name === "JsonWebTokenError") {
            //return next(createError.Unauthorized("UnAuthorized"));
            res.send({success:false,accessToken:null,error:"JsonWebTokenError"})
            return
          } else if(err.name == "TokenExpiredError"){
           // return next(createError.Unauthorized("TokenExpiredError"))
           res.send({success:false,accessToken:null,error:"TokenExpiredError"})
            return
          }
          else {
            res.send({success:false,accessToken:null,error:"UnKnown Error"})
            return
          }
        }
        req.payload = payload;
        next();
      });
    },
   
  };