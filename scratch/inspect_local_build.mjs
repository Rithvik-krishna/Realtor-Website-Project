import fs from 'fs';

function inspectLocalBuild() {
  const code = fs.readFileSync('dist/assets/index-BVNwKh1-.js', 'utf8');
  console.log(`Local dist bundle size: ${code.length} bytes`);

  const index = code.indexOf('/properties?');
  if (index !== -1) {
    console.log(`\nSnippet around /properties?:`);
    console.log(code.substring(index - 300, index + 300));
  }

  const matches = code.match(/https:\/\/[a-zA-Z0-9.-]*onrender\.com[^\s"']*/g);
  console.log(`\nRender URLs found in new local dist bundle:`, matches);
}

inspectLocalBuild();
