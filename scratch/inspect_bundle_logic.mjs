async function inspectBundleLogic() {
  const url = 'https://kanghomes.ca/assets/index-DICyRjKS.js';
  const res = await fetch(url);
  const text = await res.text();

  console.log(`Bundle total length: ${text.length}`);

  // Find occurrences of getProperties or properties? or fetch
  const index = text.indexOf('/properties?');
  if (index !== -1) {
    console.log(`\n--- Snippet around /properties? ---`);
    console.log(text.substring(index - 200, index + 300));
  }

  const index2 = text.indexOf('Unable to load properties');
  if (index2 !== -1) {
    console.log(`\n--- Snippet around "Unable to load properties" ---`);
    console.log(text.substring(index2 - 200, index2 + 300));
  }
}

inspectBundleLogic();
