const router = require("express").Router();
const Controller = require("../Controller/auth.controllers");
const Jwt = require("../Helpers/jwt_helpers");


router.post("/signIn", Controller.signIn);

router.get( "/verify", Jwt.verifyAccessToken, Controller.verification);




module.exports = router;
