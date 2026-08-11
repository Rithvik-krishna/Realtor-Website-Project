async function testBackendCities() {
  const cities = ['Toronto', 'Mississauga', 'Brampton', 'GTA'];

  for (const city of cities) {
    const url = `https://realtor-website-project.onrender.com/api/v1/properties?city=${encodeURIComponent(city)}&limit=100`;
    console.log(`\nTesting API for City: "${city}" -> ${url}`);
    const start = Date.now();
    try {
      const res = await fetch(url);
      console.log(`HTTP ${res.status} (${Date.now() - start}ms)`);
      if (res.ok) {
        const json = await res.json();
        console.log(`Success: ${json.success}`);
        console.log(`Properties Count: ${Array.isArray(json.data) ? json.data.length : 0}`);
        console.log(`Total Meta Count: ${json.meta?.total || 'N/A'}`);
        if (Array.isArray(json.data) && json.data.length > 0) {
          console.log(`Sample Listing 1: ${json.data[0].id} - ${json.data[0].title} in ${json.data[0].city} ($${json.data[0].price})`);
        }
      } else {
        const text = await res.text();
        console.log(`Error Response:`, text.substring(0, 200));
      }
    } catch (err) {
      console.log(`Fetch Error: ${err.message}`);
    }
  }
}

testBackendCities();
