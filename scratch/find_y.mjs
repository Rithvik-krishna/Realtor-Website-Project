async function findY() {
  const url = 'https://kanghomes.ca/assets/index-DICyRjKS.js';
  const res = await fetch(url);
  const text = await res.text();

  const index = text.indexOf('getItem(`auth_token`)');
  console.log(text.substring(index - 500, index));
}

findY();
