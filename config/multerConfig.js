const multer = require('multer');
const path = require('path');
const fs = require('fs');

function getUploader(folderName = 'general') {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = `uploads/${folderName}`;
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|svg|mp4|mov|avi|webm|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/svg+xml',
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo',
            'video/webm',
            'application/pdf'
        ];
        const mimetype = allowedMimeTypes.includes(file.mimetype);

        if (!extname || !mimetype) {
            return cb(new Error('Only image, video, and PDF files are allowed'), false);
        }

        // Check file size manually per field
        const videoMaxSize = 20 * 1024 * 1024; // 20 MB
        const defaultMaxSize = 5 * 1024 * 1024; // 5 MB

        const maxSize = file.fieldname === 'videoIntro' ? videoMaxSize : defaultMaxSize;

        if (file.size > maxSize) {
            return cb(new Error(`File size for ${file.fieldname} should not exceed ${maxSize / (1024 * 1024)}MB`), false);
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 20 * 1024 * 1024 // fallback max file size for all fields, highest limit
        }
    });
}

module.exports = getUploader;

