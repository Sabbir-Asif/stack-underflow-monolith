const express = require('express');
const router = express.Router();
const Post = require('./PostModel');
const { validateCreatePost, validateUpdatePost, validateQuery } = require('./PostValidation');
const { minioClient } = require('../util/minioConnection')


router.get('/v1/posts', validateQuery, async (req, res) => {
    try {
        const { page = 1, limit = 10, fileType, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const filter = {};

        if (fileType) filter.fileType = fileType;

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const posts = await Post.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'displayName email');

        const total = await Post.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: {
                posts,
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/v1/posts/search', async (req, res) => {
    try {
        const { question, fileType, userId, fromDate, toDate } = req.query;
        const filter = {};

        if (question) filter.question = { $regex: question, $options: 'i' };
        if (fileType) filter.fileType = fileType;
        if (userId) filter.userId = userId;

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);
            if (toDate) filter.createdAt.$lte = new Date(toDate);
        }

        const posts = await Post.find(filter).populate('userId', 'displayName email');

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to search posts" });
    }
});

router.get('/v1/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('userId', 'displayName email');

        if (!post) {
            return res.status(404).json({ message: `Post with id ${postId} not found` });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/v1/posts', validateCreatePost, async (req, res) => {
    try {
        const { fileName, fileContent } = req.body;
        console.log(req.body);
        const post = new Post({
            ...req.body
        });

        const bucketName = 'stackunderflow';
        const bufferContent = Buffer.from(fileContent, 'utf-8');
        const result = await minioClient
            .putObject(bucketName, fileName, bufferContent)
            .catch((e) => {
                console.log("Error while creating object in MinIO: ", e);
                throw e;
            });

        // console.log("Object uploaded successfully to MinIO: ", result);

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error occurred: ", error);
        res.status(400).json({ message: "Failed to create post", error: error.message });
    }
});


// Update a post by ID
router.patch('/v1/posts/:id', validateUpdatePost, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to update post" });
    }
});

// Delete a post by ID
router.delete('/v1/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const bucketName = 'stackunderflow';
        const fileName = post.fileName;

        await minioClient.removeObject(bucketName, fileName);
        console.log(`File ${fileName} deleted from MinIO.`);

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
});


module.exports = router;
