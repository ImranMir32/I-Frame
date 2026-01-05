const { usersContainer, postsContainer } = require('./config/db');
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.usersContainer = usersContainer;
    req.postsContainer = postsContainer;
    next();
});

const postRouter = require("./routes/post.routes");
const userRouters = require("./routes/user.routes");
const postsRouters = require("./routes/post.routes");

app.use("/api", postRouter);
app.use("/api/user", userRouters);
app.use("/api/posts", postsRouters);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    }
    
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;