/*------------------------------------------Import Modules:-------------------------------------------*/
const jwt = require('jsonwebtoken')
const authorModel = require('../models/authorModel')
const blogModel = require("../models/blogModel")

/*------------------------------------------AUTHENTICATION-------------------------------------------*/
const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(401).send({ error: "no token found" })
        }
        let decodeToken = jwt.verify(token, "functionup-project-1")
        if (!decodeToken) {
            return res.status(401).send({ error: "Invalid token" })
        }
        next();
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}


/*------------------------------------------AUTHORISATION-------------------------------------------*/
const authorisation = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        let decodeToken = jwt.verify(token, "functionup-project-1")
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

