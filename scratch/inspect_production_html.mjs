async function inspectProductionHtml() {
  const url = 'https://kanghomes.ca';
  console.log(`Fetching HTML from: ${url}`);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    console.log(`HTML Status: ${res.status}`);
    
    // Find all script tags
    const scriptMatches = html.match(/<script[^>]*src=["']([^"']+)["']/g);
    console.log(`Script tags found in production index.html:`, scriptMatches);

    // If there is an assets index bundle, let's fetch it and inspect what API URL it contains!
    if (scriptMatches) {
      for (const match of scriptMatches) {
        const srcMatch = match.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
          const scriptUrl = srcMatch[1].startsWith('http') ? srcMatch[1] : `${url}${srcMatch[1].startsWith('/') ? '' : '/'}${srcMatch[1]}`;
          console.log(`\nFetching JS Bundle: ${scriptUrl}`);
          const jsRes = await fetch(scriptUrl);
          const jsText = await jsRes.text();
          console.log(`Bundle Size: ${jsText.length} bytes`);
          
          // Check if realtor-website-project.onrender.com or canadian-realtor-backend.onrender.com or /api/v1 is in the bundle
          const hasRenderNew = jsText.includes('realtor-website-project.onrender.com');
          const hasRenderOld = jsText.includes('canadian-realtor-backend.onrender.com');
          const hasApiV1 = jsText.includes('/api/v1');
          
          console.log(`  Contains realtor-website-project.onrender.com: ${hasRenderNew}`);
          console.log(`  Contains canadian-realtor-backend.onrender.com: ${hasRenderOld}`);
          console.log(`  Contains /api/v1: ${hasApiV1}`);

          // Search for snippet around getApiBaseUrl or API_BASE_URL
          const apiMatch = jsText.match(/https:\/\/[a-zA-Z0-9.-]*onrender\.com[^\s"']*/g);
          console.log(`  Render URLs found in bundle:`, apiMatch);
        }
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

inspectProductionHtml();
