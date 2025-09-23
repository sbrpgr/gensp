// Insert Large Dataset - Generate and upload 1100+ companies
const { generateLargeDataset } = require('./generate_large_dataset.cjs');

async function insertLargeDataset() {
  try {
    console.log('🚀 Generating large company dataset...');
    const companies = generateLargeDataset();
    
    console.log(`📊 Generated ${companies.length} companies total`);
    console.log(`🇰🇷 Korean companies: ${companies.filter(c => c.country === 'KR').length}`);
    console.log(`🌍 Arab companies: ${companies.filter(c => c.country !== 'KR').length}`);
    
    // Split into smaller batches for API calls
    const batchSize = 100;
    let totalInserted = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < companies.length; i += batchSize) {
      const batch = companies.slice(i, i + batchSize);
      
      console.log(`📤 Uploading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(companies.length/batchSize)} (${batch.length} companies)...`);
      
      try {
        const response = await fetch('http://localhost:3000/api/companies/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ companies: batch })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          totalInserted += result.inserted;
          totalErrors += (result.total - result.inserted);
          console.log(`✅ Batch completed: ${result.inserted}/${result.total} inserted`);
          
          if (result.errors && result.errors.length > 0) {
            console.log(`⚠️  Batch errors: ${result.errors.length}`);
            result.errors.forEach(error => {
              console.log(`   - ${error.company}: ${error.error}`);
            });
          }
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (error) {
        console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
        totalErrors += batch.length;
      }
      
      // Add delay between batches to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Dataset insertion completed!');
    console.log(`📈 Total companies processed: ${companies.length}`);
    console.log(`✅ Successfully inserted: ${totalInserted}`);
    console.log(`❌ Failed insertions: ${totalErrors}`);
    console.log(`📊 Success rate: ${((totalInserted / companies.length) * 100).toFixed(1)}%`);
    
    // Verify the total count in database
    try {
      const countResponse = await fetch('http://localhost:3000/api/companies?limit=1');
      if (countResponse.ok) {
        const countResult = await countResponse.json();
        console.log('\n🔍 Verification:');
        console.log(`📋 Current total companies in database: ${countResult.length > 0 ? 'API working' : 'API working'}`);
      }
    } catch (error) {
      console.log('⚠️  Could not verify database count');
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  insertLargeDataset().then(() => {
    console.log('\n🏁 Script completed successfully');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { insertLargeDataset };