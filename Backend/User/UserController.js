const express = require('express');
const router = express.Router();
const User = require('./UserModel');
const validateUser = require('./UserValidation');


router.get('/v1/users/search', async (req, res) => {
    try {
        const { displayName, email, imageUrl } = req.query;
        const filter = {};

        if (displayName) filter.displayName = displayName;
        if (email) filter.email = email;
        if (imageUrl) filter.imageUrl = imageUrl;

        const users = await User.find(filter);
        
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to search users" });
    }
});

router.get('/v1/users', async (req,res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
})


router.get('/v1/users/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: `User with id ${userId} not found`});
        }
        res.status(200).json(user);
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.post('/v1/users', async (req, res) => {
    try {
        const { error } = validateUser(req.body); 
        if(error) {
            return res.status(400).json({message: error.details.map(err=> err.message)});
        }

        const {displayName, email, imageUrl} = req.body;
        const newUser = new User({
            displayName,
            email,
            imageUrl
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch(error) {
        console.error(error);
        res.status(400).json({message: "Failed to create user"});
    }
})

router.patch('/v1/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details.map(err => err.message) });
        }

        const { displayName, email, imageUrl } = req.body;

        if (displayName !== undefined) user.displayName = displayName;
        if (email !== undefined) user.email = email;
        if (imageUrl !== undefined) user.imageUrl = imageUrl;

        const updatedUser = await user.save();
        
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update user" });
    }
});

router.delete('/v1/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.remove();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

module.exports = router;