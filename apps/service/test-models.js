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
    console.log('1. Logging in as admin...');
    const login = await request('/auth/login', 'POST', {
      username: 'admin',
      password: 'password123'
    });
    console.log('Login status:', login.status);
    const token = login.body.access_token;

    if (!token) {
        console.error('Login failed, cannot proceed.');
        return;
    }

    console.log('\n2. Testing AIProxy Connection...');
    const testResult = await request('/models/test', 'POST', {
        // Empty config means use system default env vars
    }, token);
    
    console.log('Test Result:', testResult.body);

    if (testResult.body.success) {
        console.log('\n3. Creating Model Config...');
        const createResult = await request('/models', 'POST', {
            name: 'System Default GPT-3.5',
            provider: 'aiproxy',
            modelName: 'gpt-3.5-turbo',
            config: {},
            isActive: true
        }, token);
        console.log('Create Result:', createResult.body);
    }

  } catch (e) {
    console.error(e);
  }
})();
