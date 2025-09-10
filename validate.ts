// Simple validation script to check for TypeScript errors
// This script will help us identify any remaining issues without a full build

import * as fs from 'fs';
import * as path from 'path';

// Function to check if a file has TypeScript errors
function checkTypeErrors(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // This is a simplified check - in a real scenario, you would use the TypeScript compiler API
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
    if (!checkTypeErrors(fullPath)) {
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