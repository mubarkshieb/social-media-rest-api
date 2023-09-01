const express = require('express');
const router = express.Router();
//import controller
const postController = require('../controller/post-controller')


// Create a post
router.post('/', postController.CreatePost);
// View a post
router.get('/', postController.viewPost);
//update post
router.put('/:id', postController.updatePost)
//delete a post
router.delete('/:id', postController.deletePost)
//like post
router.put('/:id', postController.likeAndUnlikePost)
//timeline
router.get('/feed', postController.timeline)
module.exports = router;