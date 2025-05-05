const pdf = require("pdf-parse")
const fs = require("fs")

// Extract text from PDF file
const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const data = await pdf(dataBuffer)
    return data.text
  } catch (error) {
    console.error("PDF extraction error:", error)
    return ""
  }
}

module.exports = {
  extractTextFromPdf,
}
