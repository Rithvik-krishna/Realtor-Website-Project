const idx = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2ZW5kb3IvdHJyZWIvMTMxNjIiLCJhdWQiOiJBbXBVc2Vyc1ByZCIsInJvbGVzIjpbIkFtcFZlbmRvciJdLCJpc3MiOiJwcm9kLmFtcHJlLmNhIiwiZXhwIjoyNTM0MDIzMDA3OTksImlhdCI6MTc4NTE3OTE3OSwic3ViamVjdFR5cGUiOiJ2ZW5kb3IiLCJzdWJqZWN0S2V5IjoiMTMxNjIiLCJqdGkiOiI1ZTM4ZjZlYzY3YTJiYTNiIiwiY3VzdG9tZXJOYW1lIjoidHJyZWIifQ.EjK2dVzSaf3AvoL4US7HX6__iGmzskfrkP3qVjGOL0c';

async function testQuery() {
  const urls = [
    'https://query.ampre.ca/odata/Property?$top=5&$count=true&$filter=contains(City,\'Toronto\')',
    'https://query.ampre.ca/odata/Property?$top=5&$count=true&$filter=contains(City,\'Oakville\')',
    'https://query.ampre.ca/odata/Property?$top=5&$count=true&$filter=contains(City,\'Mississauga\')',
    'https://query.ampre.ca/odata/Property?$top=5&$count=true&$filter=contains(City,\'Brampton\')'
  ];

  for (const url of urls) {
    console.log('Testing URL:', url);
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${idx}`, 'Accept': 'application/json' } });
    console.log('Status:', res.status, res.statusText);
    if (res.ok) {
      const data = await res.json();
      console.log('🎉 SUCCESS! Total OData count:', data['@odata.count']);
      if (data.value && data.value[0]) {
        console.log('Sample Property:', data.value[0].ListingKey, data.value[0].UnparsedAddress, data.value[0].City, '$' + data.value[0].ListPrice);
      }
    }
  }
}
testQuery();
