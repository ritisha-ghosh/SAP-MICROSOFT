const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
}

console.log(`${colors.bright}${colors.cyan}Starting deployment process...${colors.reset}\n`)

try {
  // Build client
  console.log(`\n${colors.yellow}Building client...${colors.reset}`)
  execSync("cd client && npm install && npm run build", { stdio: "inherit" })

  console.log(`\n${colors.green}${colors.bright}Build completed successfully!${colors.reset}`)
  console.log(`\n${colors.cyan}You can now deploy the project:${colors.reset}`)
  console.log(`\n1. Deploy the backend to Render.com`)
  console.log(`2. Deploy the frontend to Netlify`)
  console.log(`\nSee README.md for detailed deployment instructions.${colors.reset}`)
} catch (error) {
  console.error(`\n${colors.red}${colors.bright}Build failed:${colors.reset}`, error)
  process.exit(1)
}
