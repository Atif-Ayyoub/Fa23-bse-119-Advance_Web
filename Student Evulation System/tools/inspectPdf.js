const fs = require('fs');
const pdf = require('pdf-parse');

async function inspect(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      process.exit(2);
    }
    const buf = fs.readFileSync(filePath);
    const data = await pdf(buf);
    const text = data.text || '';
    console.log('FILE:', filePath);
    console.log('File size (bytes):', buf.length);
    console.log('Pages:', data.numpages);
    console.log('Text length:', text.length);
    console.log('\n----- RAW TEXT PREVIEW (first 2000 chars) -----\n');
    console.log(text.substring(0, 2000));
    console.log('\n----- END PREVIEW -----\n');

    const lines = text.split(/\r?\n/).map(l => l.replace(/\u00A0/g, ' ').trim());
    console.log('Total lines:', lines.length);
    console.log('\nFirst 200 lines:');
    for (let i = 0; i < Math.min(200, lines.length); i++) {
      console.log(i, JSON.stringify(lines[i]));
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

const fp = process.argv[2];
if (!fp) {
  console.error('Usage: node tools/inspectPdf.js <path-to-pdf>');
  process.exit(1);
}
inspect(fp);
