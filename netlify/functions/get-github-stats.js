const HTTPS = require('https');

exports.handler = async (event, context) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const USERNAME = "RohanKrishnagoudar";
  const ALLOWED_ORIGINS = ['https://rohan.fouralpha.org', 'https://rohan-krishnagoudar.netlify.app'];

  // 1. Basic Security: Referrer check (Can be bypassed, but adds a layer)
  const referer = event.headers.referer || '';
  const isAllowed = ALLOWED_ORIGINS.some(origin => referer.startsWith(origin));

  // Skip check in local development if needed, or keep it strict
  if (!isAllowed && process.env.NODE_ENV === 'production') {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Access Denied: Unrecognized Origin' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GITHUB_TOKEN is not defined in environment variables' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const query = `
    query {
      user(login: "${USERNAME}") {
        repositories(first: 6, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
          nodes {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  try {
    const response = await fetchGitHub(GITHUB_TOKEN, query);
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data.user),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Netlify handles routing, but this is safe
        'Cache-Control': 'public, s-maxage=3600' // Cache for 1 hour on CDN
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch GitHub data', details: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};

async function fetchGitHub(token, query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Netlify-Function',
        'Content-Type': 'application/json'
      }
    };

    const req = HTTPS.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API responded with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(JSON.stringify({ query }));
    req.end();
  });
}
