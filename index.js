const http = require('http');

const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_PATH = 'ProTecGames/HTML-Editor-PRO';
const FILE_PATH = 'app/accounts.json';

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/uid=')) {
      const parameter = req.url.split('=')[1];
      try {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Working, please wait...');
        const fetch = await import('node-fetch');
        const url = `https://api.github.com/repos/${REPO_PATH}/contents/${FILE_PATH}`;
        const response = await fetch.default(url, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        });
        const jsonContent = await response.json();
        const content = Buffer.from(jsonContent.content, 'base64').toString();
        const jsonData = JSON.parse(content);
        jsonData['PREMIUM ACCOUNTS'].push(parameter);
        const updatedContent = Buffer.from(JSON.stringify(jsonData, null, 2)).toString('base64');
        await fetch.default(url, {
          method: 'PUT',
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Add UID to accounts.json',
            content: updatedContent,
            sha: jsonContent.sha,
          }),
        });
        res.writeHead(302, {'Location': 'https://html-editor-pro.vercel.app'});
        res.end();
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(302, {'Location': 'mailto:protecgamesofficial@gmail.com?subject=Error%20after%20purchasing'});
        res.end();
      }
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not found');
    }
  } catch (error) {
    console.error('Server error:', error);
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
