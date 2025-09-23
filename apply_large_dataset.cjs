// Apply large dataset in chunks to avoid SQLITE_TOOBIG error

const fs = require('fs');
const { execSync } = require('child_process');

function splitSQLFile(filename, chunkSize = 50) {
  const content = fs.readFileSync(filename, 'utf8');
  // Split by semicolon and filter out empty lines and comments
  const lines = content.split(';')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('--') && line !== '')
    .map(line => line + ';'); // Add semicolon back
  
  console.log(`Total SQL statements: ${lines.length}`);
  
  let chunkIndex = 0;
  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize);
    const chunkContent = chunk.join('\n');
    
    const chunkFilename = `chunk_${chunkIndex}.sql`;
    fs.writeFileSync(chunkFilename, chunkContent);
    
    console.log(`Created ${chunkFilename} with ${chunk.length} statements`);
    
    // Apply chunk to database
    try {
      console.log(`Applying ${chunkFilename} to database...`);
      execSync(`npx wrangler d1 execute kabridge-production --local --file=./${chunkFilename}`, { 
        stdio: 'inherit',
        timeout: 30000 
      });
      console.log(`✓ Successfully applied ${chunkFilename}`);
    } catch (error) {
      console.error(`✗ Error applying ${chunkFilename}:`, error.message);
    }
    
    // Clean up chunk file
    fs.unlinkSync(chunkFilename);
    
    chunkIndex++;
    
    // Add delay between chunks
    if (i + chunkSize < lines.length) {
      console.log('Waiting 2 seconds before next chunk...');
      execSync('sleep 2');
    }
  }
  
  console.log('\\nAll chunks have been applied to the database.');
}

// Run the function
splitSQLFile('large_dataset.sql', 30); // Process 30 statements at a time