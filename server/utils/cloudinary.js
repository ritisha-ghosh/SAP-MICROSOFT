const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv")

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload file to Cloudinary
const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    )
  })
}

module.exports = {
  uploadToCloudinary,
}
