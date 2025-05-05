const { Configuration, OpenAIApi } = require("openai")
const dotenv = require("dotenv")

dotenv.config()

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// Analyze resume with AI
const analyzeResume = async (resumeText, jobDescription, jobRequirements) => {
  try {
    // Prepare prompt for AI
    const prompt = `
      Analyze this resume for a job position with the following description and requirements:
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      JOB REQUIREMENTS:
      ${jobRequirements}
      
      RESUME:
      ${resumeText}
      
      Provide a JSON response with the following structure:
      {
        "candidateName": "Full name of the candidate",
        "email": "Candidate's email if available",
        "phone": "Candidate's phone number if available",
        "position": "Current or most recent position",
        "score": "Overall match score as a number between 0-100",
        "matchCategories": [
          {
            "name": "Technical Skills",
            "score": "Match score as a number between 0-100"
          },
          {
            "name": "Experience",
            "score": "Match score as a number between 0-100"
          },
          {
            "name": "Education",
            "score": "Match score as a number between 0-100"
          }
        ],
        "keySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
        "summary": "A brief summary of the candidate's fit for the position"
      }
    `

    // Call OpenAI API
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.5,
    })

    // Parse response
    const responseText = response.data.choices[0].text.trim()
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    } else {
      console.error("Failed to parse AI response:", responseText)
      return {
        candidateName: "Unknown Candidate",
        score: 0,
        matchCategories: [
          { name: "Technical Skills", score: 0 },
          { name: "Experience", score: 0 },
          { name: "Education", score: 0 },
        ],
        keySkills: [],
        summary: "Failed to analyze resume",
      }
    }
  } catch (error) {
    console.error("AI analysis error:", error)
    return {
      candidateName: "Unknown Candidate",
      score: 0,
      matchCategories: [
        { name: "Technical Skills", score: 0 },
        { name: "Experience", score: 0 },
        { name: "Education", score: 0 },
      ],
      keySkills: [],
      summary: "Failed to analyze resume",
    }
  }
}

module.exports = {
  analyzeResume,
}
