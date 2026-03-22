const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const generateController = require('../controllers/generate.controller');

const router = Router();

// Secure Multer Storage setup explicitly bound to the routes
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

/**
 * Route Mapping Layer
 * POST /api/generate
 */
router.post('/', upload.single('htmlFile'), generateController.generate.bind(generateController));

module.exports = router;
