async function testCors() {
  const origins = [
    'https://kanghomes.ca',
    'https://www.kanghomes.ca',
    'http://localhost:5173'
  ];

  for (const origin of origins) {
    console.log(`\nTesting CORS with Origin: ${origin}`);
    try {
      const res = await fetch('https://realtor-website-project.onrender.com/api/v1/properties?city=Toronto', {
        method: 'GET',
        headers: {
          'Origin': origin
        }
      });
      console.log(`Status: ${res.status}`);
      console.log(`Access-Control-Allow-Origin: ${res.headers.get('access-control-allow-origin')}`);
      console.log(`Access-Control-Allow-Credentials: ${res.headers.get('access-control-allow-credentials')}`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testCors();
