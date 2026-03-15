var express = require('express');
var router = express.Router();
let Role = require('../schemas/roles');

// Create Role
router.post('/', async function(req, res, next) {
    try {
        let role = new Role(req.body);
        await role.save();
        res.status(201).json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all Roles
router.get('/', async function(req, res, next) {
    try {
        let roles = await Role.find();
        res.status(200).json({
            success: true,
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get Role by ID
router.get('/:id', async function(req, res, next) {
    try {
        let role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        res.status(200).json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update Role
router.put('/:id', async function(req, res, next) {
    try {
        let role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        res.status(200).json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete Role (Hard delete)
router.delete('/:id', async function(req, res, next) {
    try {
        let role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Role deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get users by role ID
router.get('/:id/users', async function(req, res, next) {
    try {
        let User = require('../schemas/users');
        let users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
