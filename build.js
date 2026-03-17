const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('npm run build', { encoding: 'utf-8' });
  fs.writeFileSync('build_output.txt', output, 'utf-8');
  console.log('Build succeeded');
} catch (error) {
  const errorOut = error.stdout || '' + '\n' + error.stderr || '';
  fs.writeFileSync('build_output.txt', errorOut, 'utf-8');
  console.log('Build failed');
}
