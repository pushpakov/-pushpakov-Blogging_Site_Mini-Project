/*------------------------------------------Import Modules:-------------------------------------------*/
const authorModel = require("../models/authorModel")
const jwt = require('jsonwebtoken')
var validator = require('email-validator')


/*------------------------------------------Create Author:-------------------------------------------*/
const createAuthor = async (req, res) => {
  try {
    let data = req.body
    let { email, fname, lname, title, password } = data

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Please enter data in the request" })
    }

    if (!fname) {
      return res.status(400).send({ status: false, message: "firstname is missing" })
    }

    if (!/^([a-zA-Z ]){1,100}$/.test(fname)) {
      return res.status(400).send({ status: false, message: "firstname should not be number" })
    }

    if (!lname) {
      return res.status(400).send({ status: false, message: "lastname is missing" })
    }

    if (!/^([a-zA-Z ]){1,100}$/.test(lname)) {
      return res.status(400).send({ status: false, message: "lastname should not be number" })
    }

    if (!title) {
      return res.status(400).send({ status: false, message: "title is not present" })
    }

    if (!(title == "Mrs" || title == "Mr" || title == "Miss")) {
      return res.status(400).send({ status: false, message: "title has to be Mr or Mrs or Miss " })
    }

    if (!password) {
      return res.status(400).send({ status: false, message: "password is missing" })
    }

    if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,100})$/)) {
      return res.status(400).send({ status: false, message: "password isn't validate, please make sure length is minimum 8, should have one uppercase and lowercase character and Number also and donot use space and have a special character" })
    }

    if (!email) {
      return res.status(400).send({ status: false, message: "Email is not present" })
    }

    let isValidEmail = validator.validate(email)

    if (!isValidEmail) {
      return res.status(400).send({ status: false, message: "email is not valid" })
    }

    let isNotUniqueEmail = await authorModel.findOne({ email: email })

    if (isNotUniqueEmail) {
      return res.status(400).send({ status: false, message: "email already exists / Not unique" })
    }

    let savedData = await authorModel.create(data)

    if (!savedData) {
      return res.status(400).send({ status: false, message: 'author not created' })
    }
    return res.status(201).send({ status: true, message: "Signup successfull", data: savedData })
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}


/*------------------------------------------Login User:-------------------------------------------*/
const loginUser = async function (req, res) {
  let checkEmail = req.body.email
  let checkPassword = req.body.password

  if (!checkEmail) {
    return res.status(400).send({ status: false, message: "email is missing" })
  }

  if (!checkPassword) {
    return res.status(400).send({ status: false, message: "password is missing" })
  }

  let user = await authorModel.findOne({ email: checkEmail, password: checkPassword })

  if (!user) {
    return res.status(400).send({ status: false, message: "check your email or password" })
  }

  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "radon",
      organisation: "FunctionUp",
    }, "functionup-project-1");

  res.setHeader("x-api-key", token);
  return res.status(200).send({ status: true, message:"Login Successfull", token: token })
}

/*------------------------------------------Export Modules:-------------------------------------------*/
module.exports.loginUser = loginUser
module.exports.createAuthor = createAuthor

