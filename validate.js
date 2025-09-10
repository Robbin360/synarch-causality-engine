// Simple validation script to check for obvious errors
// This script will help us identify any remaining issues without a full build

const fs = require('fs');
const path = require('path');

// Function to check if a file has obvious errors
function checkErrors(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`Checking ${filePath} for obvious errors...`);
    
    // Check for common issues we've already fixed
    if (content.includes('scroll.onChange')) {
      console.error(`ERROR: ${filePath} still contains scroll.onChange which is incorrect`);
      return false;
    }
    
    console.log(`✓ ${filePath} appears to be okay`);
    return true;
  } catch (error) {
    console.error(`ERROR: Could not read ${filePath}`);
    return false;
  }
}

// List of files to check
const filesToCheck = [
  'src/components/NarrativeController.tsx',
  'src/components/CausalityEngine.tsx',
  'src/components/InteractionController.tsx',
  'src/components/ModeContext.tsx',
  'src/components/LoadingIndicator.tsx',
  'src/app/page.tsx',
  'src/app/layout.tsx'
];

// Check each file
let hasErrors = false;
for (const file of filesToCheck) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    if (!checkErrors(fullPath)) {
      hasErrors = true;
    }
  } else {
    console.warn(`WARNING: ${fullPath} does not exist`);
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log('All files passed basic validation checks');
  process.exit(0);
}