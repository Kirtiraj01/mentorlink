const fs = require('fs');
const lines = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (line.includes('var(--primary)') && !line.includes('\'var(--primary)\'') && !line.includes('\"var(--primary)\"')) {
    console.log(i + 1, line.trim());
  }
});
