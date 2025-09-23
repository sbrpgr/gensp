// KABridge - Insert 500+ companies via API

const fs = require('fs');

// Load generated companies data
const companiesData = JSON.parse(fs.readFileSync('mega_companies.json', 'utf8'));

async function insertCompaniesInBatches() {
  console.log(`🚀 Inserting ${companiesData.length} companies via API...`);
  
  const batchSize = 10; // Insert 10 companies at a time
  let totalInserted = 0;
  let totalFailed = 0;
  
  for (let i = 0; i < companiesData.length; i += batchSize) {
    const batch = companiesData.slice(i, i + batchSize);
    console.log(`📤 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(companiesData.length/batchSize)} (${batch.length} companies)...`);
    
    // Process batch in parallel
    const promises = batch.map(async (company) => {
      try {
        const response = await fetch('http://localhost:3000/api/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(company)
        });
        
        if (response.ok) {
          const result = await response.json();
          return { success: true, name: company.name, id: result.id };
        } else {
          const error = await response.text();
          console.log(`❌ Failed to insert ${company.name}: ${error}`);
          return { success: false, name: company.name, error };
        }
      } catch (error) {
        console.log(`💥 Error inserting ${company.name}:`, error.message);
        return { success: false, name: company.name, error: error.message };
      }
    });
    
    const results = await Promise.all(promises);
    
    // Count results
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    totalInserted += successful;
    totalFailed += failed;
    
    console.log(`✅ Batch completed: ${successful} successful, ${failed} failed`);
    
    // Small delay between batches to avoid overwhelming the API
    if (i + batchSize < companiesData.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`🎉 Insertion complete!`);
  console.log(`   ✅ Total inserted: ${totalInserted}`);
  console.log(`   ❌ Total failed: ${totalFailed}`);
  console.log(`   📊 Success rate: ${((totalInserted / companiesData.length) * 100).toFixed(1)}%`);
  
  // Verify final count
  try {
    const response = await fetch('http://localhost:3000/api/companies');
    const companies = await response.json();
    console.log(`🔍 Database verification: ${companies.length} companies in database`);
  } catch (error) {
    console.log('Could not verify database count:', error.message);
  }
}

insertCompaniesInBatches();