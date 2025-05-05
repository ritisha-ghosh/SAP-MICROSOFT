# AI Resume Screening and Ranking System

A full-stack application that uses AI to screen and rank resumes based on job descriptions.

## Architecture

This project uses a decoupled architecture:
- Frontend: React.js deployed on Netlify
- Backend: Express.js API deployed on Render.com
- Database: MongoDB Atlas
- File Storage: Cloudinary
- AI Analysis: OpenAI API

## Features

- User authentication (register, login, logout)
- Create job listings with descriptions and requirements
- Upload resumes for AI analysis
- View ranked resumes with match scores and detailed analysis
- Dashboard with statistics and overview

## Deployment Instructions

### Backend Deployment (Render.com)

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service:
   - Name: ai-resume-ranker-api
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server/server.js`
   - Add the following environment variables:
     - MONGODB_URI
     - JWT_SECRET
     - CLOUDINARY_CLOUD_NAME
     - CLOUDINARY_API_KEY
     - CLOUDINARY_API_SECRET
     - OPENAI_API_KEY
     - NODE_ENV=production

### Frontend Deployment (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure the build settings:
   - Base directory: (leave blank)
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
4. Add environment variables:
   - REACT_APP_API_URL=https://your-render-api-url.onrender.com/api

## Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   cd client && npm install
   \`\`\`
3. Create a `.env` file in the root directory with the required environment variables
4. Start the development servers:
   \`\`\`
   npm run dev
   \`\`\`

## Project Structure

\`\`\`
├── client/                 # React frontend
│   ├── public/             # Public assets
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── index.jsx       # Entry point
│   └── package.json        # Frontend dependencies
├── server/                 # Express backend
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
├── .env                    # Environment variables
├── netlify.toml            # Netlify configuration
└── package.json            # Project dependencies
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
\`\`\`

### Frontend (client/.env)
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
