const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request'); // Adjust path if needed
const userService = require('../services/user.service'); // Adjust path if needed

// Routes for user preferences
router.get('/:id/preferences', getPreferences);
router.put('/:id/preferences', updatePreferencesSchema, updatePreferences);

module.exports = router;

// Retrieve user preferences
async function getPreferences(req, res, next) {
    try {
        const preferences = await userService.getPreferences(req.params.id);
        res.json(preferences);
    } catch (error) {
        next(error);
    }
}

// Update user preferences
async function updatePreferences(req, res, next) {
    try {
        await userService.updatePreferences(req.params.id, req.body);
        res.json({ message: 'Preferences updated' });
    } catch (error) {
        next(error);
    }
}

// Validation schema for updating preferences
function updatePreferencesSchema(req, res, next) {
    const schema = Joi.object({
        themeColor: Joi.string().valid('light', 'dark','blue').optional(),
        emailNotifications: Joi.boolean().optional(),
        language: Joi.string().valid('en', 'es', 'fr').optional()
    });
    validateRequest(req, next, schema);
}
