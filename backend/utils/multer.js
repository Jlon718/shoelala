const multer = require("multer");
const path = require("path");

module.exports = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit individual file size to 5 MB
    },
    storage: multer.memoryStorage(), // Store files in memory as buffer
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        console.log(`File Filter: Checking file ${file.originalname} with extension ${ext}`);
    
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            console.error("Unsupported file type:", ext);
            cb(new Error("Unsupported file type!"), false);
            return;
        }
    
        cb(null, true);
    },    
});
