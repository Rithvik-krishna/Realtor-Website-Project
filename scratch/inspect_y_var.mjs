async function inspectYVar() {
  const url = 'https://kanghomes.ca/assets/index-DICyRjKS.js';
  const res = await fetch(url);
  const text = await res.text();

  const index = text.indexOf('/properties?');
  const snippet = text.substring(index - 1000, index);
  console.log(`Snippet before /properties?:`);
  console.log(snippet);
}

inspectYVar();
