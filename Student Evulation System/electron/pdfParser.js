const fs = require('fs');
const pdf = require('pdf-parse');

function parseTokens(text) {
  // Clean the text - handle non-breaking spaces but preserve line breaks
  text = text.replace(/\u00A0/g, ' ');
  
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map(l => l.replace(/\u00A0/g, ' ').trim())
    .filter(Boolean);

  console.log('\n=== LINE-BY-LINE DEBUG ===');
  console.log('Total lines:', lines.length);
  lines.slice(0, 50).forEach((l, i) => {
    console.log(`[${i}] ${JSON.stringify(l)}`);
  });
  console.log('=== END LINE DEBUG ===\n');

  const students = [];

  let currentSection = "";
  let currentRoll = "";
  let nameParts = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Ignore numbering (1,2,3...)
    if (/^\d+$/.test(line)) {
      continue;
    }

    // Detect FA23- on one line followed by BSE-XXX on the next line and combine
    const faFollowBse = line.match(/^FA\d{2}-$/i);
    if (faFollowBse && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      const bseMatch = nextLine.match(/^BSE-\d+$/i);
      if (bseMatch) {
        currentRoll = (line + nextLine).toUpperCase(); // e.g. FA23-BSE-053
        // set section from FA portion
        currentSection = line.replace('-', '').toUpperCase();
        console.log(`✓ Full Roll Found: ${currentRoll}`);
        i++; // consume next line
        nameParts = [];
        continue;
      }
    }

    // Detect Section line like FA23- or FA23 or FA23-BSE (sometimes combined)
    const sectionMatch = line.match(/^FA\d{2}-?$/i);
    if (sectionMatch) {
      currentSection = line.replace("-", "").toUpperCase();
      console.log(`✓ Section found: ${currentSection}`);
      continue;
    }

    // Detect Roll line like BSE-058
    const rollMatch = line.match(/^BSE-\d+$/i);
    if (rollMatch) {
      currentRoll = line.toUpperCase();
      nameParts = [];
      console.log(`✓ Roll found: ${currentRoll}`);
      continue;
    }

    // More tolerant name matching - allow mixed case, spaces, hyphens, apostrophes
    // Must have at least 2 letters
    if (/^[A-Za-z][A-Za-z\s\-'\.]{1,}$/.test(line) && currentRoll) {
      const upperLine = line.toUpperCase();
      nameParts.push(upperLine);
      console.log(`✓ Name part: ${upperLine}`);

      // Check next line — if next is not a name part, finalize student
      const nextLine = lines[i + 1] || "";
      const isNextNamePart = /^[A-Za-z][A-Za-z\s\-'\.]{1,}$/.test(nextLine) && 
                             !/^FA\d{2}-?$/i.test(nextLine) && 
                             !/^BSE-\d+$/i.test(nextLine) && 
                             !/^\d+$/.test(nextLine);
      
      if (!isNextNamePart) {
        const student = {
          section: currentSection,
          roll_no: currentRoll,
          name: nameParts.join(" ").trim()
        };
        console.log('✅ STUDENT ADDED:', student);
        students.push(student);

        currentRoll = "";
        nameParts = [];
      }
    }
  }

  console.log('\n📊 Total students parsed:', students.length);
  return students;
}

function parseLines(text) {
  // More tolerant line-based parser
  const lines = text.split(/\r?\n/).map(l => l.replace(/\u00A0/g, ' ').trim()).filter(Boolean);
  const students = [];
  
  console.log('\n=== FALLBACK PARSER ===');
  console.log('Trying more tolerant regex patterns...\n');
  
  // Tolerant pattern that can catch section, roll, and name even if spaced oddly
  const regex = /(FA\d{2})?\s*BSE-(\d+)\s*([A-Za-z\s.'-]+)/i;
  
  let currentSection = '';
  
  for (const line of lines) {
    // Skip pure numbers
    if (/^\d+$/.test(line.trim())) continue;
    
    // Try standalone section
    const sectionOnly = line.match(/^FA(\d{2})-?$/i);
    if (sectionOnly) {
      currentSection = 'FA' + sectionOnly[1];
      console.log('Found section:', currentSection);
      continue;
    }
    
    // Try the main regex
    const m = line.match(regex);
    if (m) {
      const section = m[1] ? m[1].toUpperCase() : currentSection;
      const roll = 'BSE-' + m[2];
      const name = m[3].trim().toUpperCase();
      
      if (section && roll && name.length > 1) {
        currentSection = section;
        const student = { section, roll_no: roll, name };
        console.log('✓ Student matched:', student);
        students.push(student);
      }
    }
  }
  
  console.log('\n=== FALLBACK COMPLETE ===\n');
  return students;
}

async function parsePdf(filePath) {
  try {
    console.log('\n========================================');
    console.log('🔍 PDF PARSER START');
    console.log('========================================');
    console.log('Reading file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    
    const dataBuffer = fs.readFileSync(filePath);
    console.log('📄 File size:', dataBuffer.length, 'bytes');
    
    const data = await pdf(dataBuffer);
    const text = data.text || '';

    console.log('📊 Extracted text length:', text.length, 'characters');
    console.log('📖 Number of pages:', data.numpages);
    
    // Check if PDF might be image-based
    if (!text || text.trim().length < 50) {
      console.error('⚠️  WARNING: PDF appears to be empty or image-based!');
      console.error('⚠️  pdf-parse cannot extract text from image PDFs.');
      console.error('⚠️  You may need OCR (Optical Character Recognition).');
      throw new Error('PDF appears to be empty or image-based. Text extraction failed.');
    }

    console.log('\n📝 RAW EXTRACTED TEXT (first 1000 chars):');
    console.log('--- START ---');
    console.log(text.substring(0, 1000));
    console.log('--- END ---\n');

    // Token-based parsing handles multi-line names and wrapped rows
    const students = parseTokens(text);
    console.log('\n✅ Token-based parsing result:', students.length, 'students found');
    
    if (students.length > 0) {
      console.log('\n📋 Sample students (first 5):');
      students.slice(0, 5).forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.section} | ${s.roll_no} | ${s.name}`);
      });
      console.log('\n========================================');
      console.log('✅ PDF PARSER SUCCESS');
      console.log('========================================\n');
      return students;
    }

    // Fallback to simple line regex if tokens fail
    console.log('\n⚠️  Token parsing found 0 students, trying fallback...');
    const fallbackStudents = parseLines(text);
    console.log('📊 Line-based parsing result:', fallbackStudents.length, 'students found');
    
    if (fallbackStudents.length > 0) {
      console.log('\n📋 Sample students from fallback (first 5):');
      fallbackStudents.slice(0, 5).forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.section} | ${s.roll_no} | ${s.name}`);
      });
    }
    
    console.log('\n========================================');
    console.log('PDF PARSER COMPLETE');
    console.log('========================================\n');
    return fallbackStudents;
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ PDF PARSER ERROR');
    console.error('========================================');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    console.error('========================================\n');
    throw error;
  }
}

module.exports = { parsePdf };
