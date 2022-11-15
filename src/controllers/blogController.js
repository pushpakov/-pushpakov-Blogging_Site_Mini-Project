/*------------------------------------------Import Modules:-------------------------------------------*/
const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
const middle = require('../middlewares/commonMiddle')

/*------------------------------------------create blog:-------------------------------------------*/
const createBlog = async function (req, res) {
  try {
    let data = req.body
    let { authorId, title, body, category } = data

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please request data to be created" })
    }

    if (!title) {
      return res.status(400).send({ status: false, msg: "Title is missing" })
    }

    if (title.length < 2) {
      return res.status(400).send({ status: false, msg: "length of title must be greater than 1" })
    }

    if (!body) {
      return res.status(400).send({ status: false, msg: "Body is missing" })
    }

    if (body.length < 50) {
      return res.status(400).send({ status: false, msg: "length of body must be greater than 50" })
    }

    if (!category) {
      return res.status(400).send({ status: false, msg: "category is missing" })
    }

    if (!authorId) {
      return res.status(400).send({ status: false, msg: 'please enter authorId' })
    }

    let validId = await authorModel.findById(authorId)
    if (!validId) {
      return res.status(400).send({ status: false, msg: 'authorId is not correct' })
    }


    let savedData = await blogModel.create(data)
    return res.status(201).send({status:true, data: savedData })
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, msg: err.message })
  }
}


/*------------------------------------------ Get blog:-------------------------------------------*/
const getBlogs = async (req, res) => {
  try {
    let data = req.query
    
    if(Object.keys(data).length!==0){
      let blog = await blogModel.find({ $and: [{ isPublished: true }, { isDeleted: false }, data] })
      if (blog.length < 1) {
        return res.status(404).send({ status: false, msg: 'Blog not found' })
      }
      return res.status(200).send({ status: true, data: blog })
    }else{
      let blog = await blogModel.find({ isPublished: true , isDeleted: false })
        if (blog.length < 1) {
          return res.status(404).send({ status: false, msg: 'Blog not found' })
        }
        return res.status(200).send({ status: true, data: blog })
    }
  } catch (err) {

    return res.status(500).send({ status: false, msg: err })
  }
}


/*------------------------------------------Update blog:-------------------------------------------*/
const updateBlog = async (req, res) => {
  try {
    let Id = req.params.blogId

    if(Object.keys(Id).length===0){
      return res.status(400).send({ status: false, msg: "Path parameter is empty" })
    }
    

    let data = req.body
    let tags = req.body.tags
    let subcategory = req.body.subcategory

    
    if (!Id) {
      return res.status(400).send({ status: false, msg: "please enter the blog Id" })
    }

    let user = await blogModel.findById(Id)
    if (!user) {
      return res.status(404).send({ error: 'Document not found / already deleted' })
    }
    if (user.isDeleted==true) {
      return res.status(404).send({ error: 'Document not found / already deleted' })
    }


    let updatedTags = user.tags
    if (tags) {
      updatedTags.push(tags)
    }

    let updatedSubCategory = user.subcategory
    if (subcategory) {
      updatedSubCategory.push(subcategory)
    }

    let updatedBlog = await blogModel.findOneAndUpdate(
      { _id: Id, isDeleted: false },
      {
        title: data.title,
        tags: updatedTags,
        subcategory: updatedSubCategory,
        body: data.body,
        isPublished: data.isPublished,
        publishedAt: Date.now(),

      },
      { returnDocument: 'after' },
    )
    if (!updatedBlog) {
      return res.status(404).send({ status: false, msg: 'Document not found or deleted before' })
    }
    return res.status(200).send({ status: true, data: updatedBlog })
  } catch (err) {

    return res.status(500).send({ status: false, msg: err.message })
  }
}


/*------------------------------------------Delete by params:-------------------------------------------*/
const deleteBlog = async function (req, res) {
  try {
    let Id = req.params.blogId

    if(Object.keys(Id).length===0){
      return res.status(400).send({ status: false, msg: "Path parameter is empty" })
    }

    if (!Id) {
      return res.status(400).send({ status: false, msg: "please enter blogId" })
    }

    let deletedDoc = await blogModel.updateOne(
      { _id: Id, isDeleted: false },
      {
        isDeleted: true, deletedAt: Date.now()
      },
      { returnDocument: 'after' },
    )
    if (deletedDoc.modifiedCount == 0) {
      return res.status(404).send({ status: false, msg: "No Document Found " })
    }
    return res.status(200).send({ status: true,message:"Blog is Successfully Deleted" })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


/*------------------------------------------Delete by query params:-------------------------------------------*/
const deleteByQuery = async (req, res) => {
  try {
    let data = req.query
  
    if(Object.keys(data).length===0){
      return res.status(400).send({ status: false, msg: "Query parameter is empty / -invalid" })
    }
    let token = req.header("Authorization")
    token = token.split(" ")
    let decodedToken = jwt.verify(token[1], "functionup-project-1")
    
    let uesrmodified = decodedToken.userId.toString()
    if(req.query.authorId){
      if(req.query.authorId!==uesrmodified){
        return res.status(403).send({ status: false, msg: "Unauthorised" })
      }
    }

    let allblog = await blogModel.updateMany(
      {
      $and:  [data,  {isDeleted: false} ,  {authorId: uesrmodified}] 
      },

      { isDeleted: true, deletedAt: Date.now() }, 
      { returnDocument: 'after' },
    ) 

    if (allblog.modifiedCount == 0) {
      return res.status(400).send({ status: false, msg: "No Document Found" })   
    }
    return res.status(200).send({ status: true, data: `${allblog.modifiedCount}-DELETED` })
  }
  catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
  }
}


/*------------------------------------------Export Modules:-------------------------------------------*/
module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteByQuery = deleteByQuery
