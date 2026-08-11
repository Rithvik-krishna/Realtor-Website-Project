async function testUrls() {
  const urls = [
    'https://realtor-website-project.onrender.com/health',
    'https://canadian-realtor-backend.onrender.com/health',
    'https://realtor-website-project.onrender.com/api/v1/properties?city=Toronto',
    'https://canadian-realtor-backend.onrender.com/api/v1/properties?city=Toronto'
  ];

  for (const url of urls) {
    console.log(`\nTesting: ${url}`);
    const start = Date.now();
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      console.log(`Status: ${res.status} ${res.statusText} (${Date.now() - start}ms)`);
      if (res.ok) {
        const json = await res.json();
        console.log(`Data snippet:`, JSON.stringify(json).substring(0, 150));
      }
    } catch (err) {
      console.log(`Error: ${err.message} (${Date.now() - start}ms)`);
    }
  }
}

testUrls();
