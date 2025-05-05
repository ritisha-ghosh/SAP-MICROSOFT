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

console.log(`${colors.bright}${colors.cyan}Starting build process...${colors.reset}\n`)

try {
  // Install server dependencies
  console.log(`${colors.yellow}Installing server dependencies...${colors.reset}`)
  execSync("npm install", { stdio: "inherit" })

  // Install client dependencies
  console.log(`\n${colors.yellow}Installing client dependencies...${colors.reset}`)
  execSync("cd client && npm install", { stdio: "inherit" })

  // Build client
  console.log(`\n${colors.yellow}Building client...${colors.reset}`)
  execSync("cd client && npm run build", { stdio: "inherit" })

  // Create netlify functions directory if it doesn't exist
  const functionsDir = path.join(__dirname, "..", "netlify", "functions")
  if (!fs.existsSync(functionsDir)) {
    fs.mkdirSync(functionsDir, { recursive: true })
  }

  console.log(`\n${colors.green}${colors.bright}Build completed successfully!${colors.reset}`)
  console.log(`\n${colors.cyan}You can now deploy the project to Netlify.${colors.reset}`)
} catch (error) {
  console.error(`\n${colors.red}${colors.bright}Build failed:${colors.reset}`, error)
  process.exit(1)
}
