/*------------------------------------------Import Modules:-------------------------------------------*/
const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogController')
const authorController = require('../Controllers/authorController')
const middle = require('../middlewares/commonMiddle')


/*------------------------------------------API's:-------------------------------------------*/
router.post('/authors', authorController.createAuthor)                   

router.post('/login', authorController.loginUser)

router.post('/blogs', middle.authentication, blogController.createBlog)

router.get('/blogs', middle.authentication, blogController.getBlogs)

router.put('/blogs/:blogId', middle.authentication, middle.authorisation, blogController.updateBlog)

router.delete('/blogs/:blogId', middle.authentication, middle.authorisation, blogController.deleteBlog)

router.delete('/blogs', middle.authentication, blogController.deleteByQuery)

/*------------------------------------------Export Modules:-------------------------------------------*/
module.exports = router

