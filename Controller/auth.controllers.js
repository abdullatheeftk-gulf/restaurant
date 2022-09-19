const createError = require("http-errors");
const User = require("../Models/User");

const Jwt = require("../Helpers/jwt_helpers");

const signIn = async (req, res, next) => {
  try {
    const { userName, password, deviceId } = req.body;
    const isUserExist = await User.findOne({
      where: {
        deviceId: deviceId,
      },
    });

    if (!isUserExist) {
      throw createError.BadRequest("User is not registered");
    }
    if (isUserExist.userName !== userName)
      throw createError.BadRequest("Check UserName");
    if (isUserExist.password !== password)
      throw createError.BadRequest("Check Password");
    const accessToken = await Jwt.signAccessToken(deviceId);
    

    res.send({ accessToken: accessToken, success: true, error: null });
  } catch (error) {
    
    res.send({accessToken:null,success:false,error:error.message})
  }
};

const verification = async (req, res, next) => {
  try {
    const deviceId = req.query.deviceId;
    const isUserExist = await User.findOne({
      where: {
        deviceId: deviceId,
      },
    });
    if (!isUserExist) {
      throw createError.BadRequest("User is not registered");
    }
    res.send({success:true,accessToken:null,error:null})

  } catch (error) {
    res.send({success:false,accessToken:null,error:error.message})
    //next(error);
  }
};

module.exports = {
  signIn: signIn,
  verification:verification
};
