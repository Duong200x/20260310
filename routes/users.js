var express = require('express');
var router = express.Router();
let User = require('../schemas/users');

// Create User
router.post('/', async function(req, res, next) {
    try {
        let user = new User(req.body);
        await user.save();
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all Users (excluding soft deleted)
router.get('/', async function(req, res, next) {
    try {
        let users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get User by ID
router.get('/:id', async function(req, res, next) {
    try {
        let user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update User
router.put('/:id', async function(req, res, next) {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Soft Delete User
router.delete('/:id', async function(req, res, next) {
    try {
        let user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User soft deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Enable User Status
router.post('/enable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        let user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found or information incorrect"
            });
        }
        res.status(200).json({
            success: true,
            message: "User status changed to true",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Disable User Status
router.post('/disable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        let user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found or information incorrect"
            });
        }
        res.status(200).json({
            success: true,
            message: "User status changed to false",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
