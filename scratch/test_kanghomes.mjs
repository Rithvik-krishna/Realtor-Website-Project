async function testKanghomes() {
  const urls = [
    'https://www.kanghomes.ca/api/v1/properties?city=Toronto',
    'https://kanghomes.ca/api/v1/properties?city=Toronto',
    'https://www.kanghomes.ca/health',
    'https://kanghomes.ca/health'
  ];

  for (const url of urls) {
    console.log(`\nTesting: ${url}`);
    const start = Date.now();
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      console.log(`Status: ${res.status} ${res.statusText} (${Date.now() - start}ms)`);
      const contentType = res.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      if (res.ok && contentType && contentType.includes('json')) {
        const json = await res.json();
        console.log(`Data snippet:`, JSON.stringify(json).substring(0, 150));
      } else {
        const text = await res.text();
        console.log(`Text snippet:`, text.substring(0, 150));
      }
    } catch (err) {
      console.log(`Error: ${err.message} (${Date.now() - start}ms)`);
    }
  }
}

testKanghomes();
