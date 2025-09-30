const express=require('express')
const router=express.Router()
const postController=require('../controllers/postController')
const isauth=require('../middleWare/authMiddleWare')


// get all post
router.get('/',postController.getAllPosts)
//get create post form
router.get('/create',isauth,postController.getCreatePost)
// post the blog
router.post('/create',isauth,postController.createPost)

// get single post
router.get('/:id',isauth,postController.getSinglePost)
// get edit post form
router.get('/edit/:id',isauth,postController.getEditPost)
// update the post
router.post('/edit/:id',isauth,postController.updatePost)
// delete the post
router.get('/delete/:id',isauth,postController.deletePost)

router.post('/:id/comments',postController.addComment)

module.exports=router
