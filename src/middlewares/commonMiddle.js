/*------------------------------------------Import Modules:-------------------------------------------*/
const jwt = require('jsonwebtoken');
const authorModel = require('../models/authorModel');
const blogModel = require("../models/blogModel");
// const axios = require("axios");   //"functionup-project-1"

/*------------------------------------------AUTHENTICATION-------------------------------------------*/
const authentication = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ status: false, message: "login is required" })
        }

        let splitToken = token.split(" ")

        //----------------------------- Token Verification -----------------------------//
        jwt.verify(splitToken[1], "functionup-project-1", (error, decodedtoken) => {
            if (error) {
                const message =
                    error.message === "jwt expired" ? "Token is expired, Please login again" : "Token is invalid, Please recheck your Token"
                return res.status(401).send({ status: false, message })
            }
            req.token = decodedtoken.userId
            next();
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


/*------------------------------------------AUTHORISATION-------------------------------------------*/
const authorisation = async (req, res, next) => {
    try {
        let token = req.header('Authorization')
        let decodeToken = jwt.verify((token.split(" "))[1], "functionup-project-1")
        let blogId = req.params.blogId

        if(!blogId.match(/^[a-zA-Z0-9]{24}$/)){
            return res.status(401).send({ status: false, msg: "id length is not suitable i.e, 24" })
        }

        let blog = await blogModel.findById(blogId)
        if (!blog) {
            return res.status(401).send({ status: false, msg: "No Blog available or invalid id" })
        }
        let authorsId = blog.authorId.toString()
        let userModified = decodeToken.userId


        if (authorsId != userModified) {
            return res.status(401).send({ status: false, msg: "you are not authourized to change other user document" })
        }
        next()
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}



/*------------------------------------------EXPORT-MODULES------------------------------------------*/
module.exports.authentication = authentication
module.exports.authorisation = authorisation

