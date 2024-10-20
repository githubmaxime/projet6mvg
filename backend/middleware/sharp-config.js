const sharp = require('sharp');
const optimizeImageSize = async (req, res, next) => {
    try {
    if(req.file) {
    console.log(req.file.path)
            sharp(req.file.path)
            .resize({ height: 500 })
            .webp({ quality: 80 })
            .toFile(req.file.path + "_thumbnail.webp")
    }
    next()
    } catch( err) {
        res.status(500).json({ err })
    }
}
module.exports = optimizeImageSize;