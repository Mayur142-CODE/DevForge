const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Running tsc...");
  const output = execSync('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
  fs.writeFileSync('tsc-output.txt', "SUCCESS\n" + output);
} catch (error) {
  fs.writeFileSync('tsc-output.txt', "ERROR\n" + error.stdout + "\n" + error.stderr);
}
console.log("Done.");
