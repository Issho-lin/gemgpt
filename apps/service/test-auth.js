const http = require('http');

async function request(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
            resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} });
        } catch (e) {
            console.log('Response body:', body);
            resolve({ status: res.statusCode, body: {} });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  try {
    console.log('1. Registering...');
    const username = 'testuser_' + Date.now();
    const email = `test_${Date.now()}@example.com`;
    
    const reg = await request('/auth/register', 'POST', {
      username,
      password: 'password123',
      email
    });
    console.log('Register status:', reg.status);
    console.log('Register body:', reg.body);

    console.log('\n2. Logging in...');
    const login = await request('/auth/login', 'POST', {
      username,
      password: 'password123'
    });
    console.log('Login status:', login.status);
    if (!login.body.access_token) {
        console.error('Login failed:', login.body);
        return;
    }

    console.log('\n3. Getting Profile...');
    const profile = await request('/auth/profile', 'GET', null, login.body.access_token);
    console.log('Profile:', profile.body);
  } catch (e) {
    console.error(e);
  }
})();
