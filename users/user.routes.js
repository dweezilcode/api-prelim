const express = require('express');
const router = express.Router();
const userController = require('./users.controller'); // Ensure the path is correct

// Routes for user CRUD operations
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.createSchema, userController.create);
router.put('/:id', userController.updateSchema, userController.update);
router.delete('/:id', userController._delete);

// Routes for user preferences
router.get('/:userId/preferences', userController.getPreferences);
router.put('/:userId/preferences', userController.updatePreferencesSchema, userController.updatePreferences);

module.exports = router;
