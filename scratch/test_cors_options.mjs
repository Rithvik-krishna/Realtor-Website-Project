async function testOptions() {
  const origins = ['https://kanghomes.ca', 'https://www.kanghomes.ca'];

  for (const origin of origins) {
    console.log(`\nTesting OPTIONS preflight with Origin: ${origin}`);
    try {
      const res = await fetch('https://realtor-website-project.onrender.com/api/v1/properties', {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'content-type,authorization'
        }
      });
      console.log(`Status: ${res.status}`);
      console.log(`Access-Control-Allow-Origin: ${res.headers.get('access-control-allow-origin')}`);
      console.log(`Access-Control-Allow-Methods: ${res.headers.get('access-control-allow-methods')}`);
      console.log(`Access-Control-Allow-Headers: ${res.headers.get('access-control-allow-headers')}`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testOptions();
