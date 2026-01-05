const blobStorage = require('../config/blobStorage');
const postModel = require('../models/post.model');

const uploadPost = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can upload posts'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required'
            });
        }

        const { title = '' } = req.body;
        
        if (!title || title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Title is required and must be at least 3 characters'
            });
        }

        const metadata = {
            title: title.trim(),
            uploadedAt: new Date().toISOString(),
            originalFilename: req.file.originalname
        };
        
        const uploadResult = await blobStorage.uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            metadata
        );

        if (!uploadResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image to storage',
                error: uploadResult.error
            });
        }

        const postData = {
            title: metadata.title,
            imgUrl: uploadResult.url,
            blobName: uploadResult.blobName,
            createdAt: new Date().toISOString(),
            likes: [],
            comments: [],
            metadata: {
                originalName: req.file.originalname,
                size: req.file.size,
                contentType: req.file.mimetype,
                blobMetadata: metadata
            }
        };
        
        const { error } = postModel.validate(postData);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: error.details[0].message
            });
        }

        const { resource: savedPost } = await req.postsContainer.items.create(postData);

        res.status(201).json({
            success: true,
            message: 'Post uploaded successfully',
            data: {
                post: savedPost,
                upload: uploadResult
            }
        });

    } catch (error) {
        console.error('Upload post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during post upload',
            error: error.message
        });
    }
};


const getAllPosts = async (req, res) => {
  console.log("yes")
  try {
    const { resources } = await req.postsContainer.items
      .query("SELECT * FROM c ORDER BY c.createdAt DESC")
      .fetchAll();

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const { resource: post } = await req.postsContainer.item(postId, postId).read();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await req.postsContainer.items.upsert(post);

    res.status(200).json({
      message: likeIndex === -1 ? "Post liked" : "Post unliked",
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    console.log("comment-");
    const postId = req.params.id;
    const userId = req.user.userId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const { resource: post } = await req.postsContainer.item(postId, postId).read();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      userId,
      text,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    await req.postsContainer.items.upsert(post);

    res.status(201).json({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const deletePost = async (req, res) => {
//     try {
//         const { filename } = req.params;
        
//         if (!filename) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Filename is required'
//             });
//         }

//         const result = await blobStorage.deleteFile(filename);
        
//         if (!result.success) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'Delete failed',
//                 error: result.error
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Image deleted successfully'
//         });
//     } catch (error) {
//         console.error('Delete controller error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error during delete',
//             error: error.message
//         });
//     }
// };

module.exports = {
  uploadPost,
  getAllPosts,
  toggleLike,
  addComment,
};
