const parser = require('../electron/pdfParser');

const fp = process.argv[2];
if (!fp) {
  console.error('Usage: node tools/runPdfParser.js <path-to-pdf>');
  process.exit(1);
}

(async () => {
  try {
    const students = await parser.parsePdf(fp);
    console.log('\n=== PARSER OUTPUT ===');
    console.log('Parsed students count:', students.length);
    students.forEach((s, i) => console.log(i+1, s));
  } catch (err) {
    console.error('Parser error:', err);
    process.exit(1);
  }
})();
