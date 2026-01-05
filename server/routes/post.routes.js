const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadPost, getAllPosts, toggleLike, addComment } = require('../controllers/post.controller');
const validateToken = require('../middleware/validateTokenHandler');
const isAdmin = require('../middleware/isAdmin');

router.get('/posts', getAllPosts);

router.post('/posts/:id/like', validateToken, toggleLike);
router.post('/posts/:id/comment', validateToken, addComment);

router.post(
    '/upload',
    validateToken,
    isAdmin,
    upload.single('image'),
    uploadPost
);

// router.delete(
//     '/delete/:id',
//     validateToken,
//     isAdmin,
//     deletePost
// );

module.exports = router;