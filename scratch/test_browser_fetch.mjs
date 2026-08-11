async function testBrowserFetch() {
  const url = 'https://realtor-website-project.onrender.com/api/v1/properties?city=Brampton&limit=300';
  console.log(`Testing direct fetch to Render API: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);
    const text = await res.text();
    console.log(`First 200 chars of response:`);
    console.log(text.substring(0, 200));

    try {
      const json = JSON.parse(text);
      console.log(`JSON parse successful! Success: ${json.success}, Items: ${json.data?.length}`);
    } catch (e) {
      console.log(`JSON parse error: ${e.message}`);
    }
  } catch (err) {
    console.log(`Fetch error: ${err.message}`);
  }
}

testBrowserFetch();
