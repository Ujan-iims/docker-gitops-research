const http = require('http');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`  PASS: ${testName}`);
        passed++;
    } else {
        console.error(`  FAIL: ${testName}`);
        failed++;
    }
}

// Start the server on a test port
process.env.PORT = 3001;
const app = require('../server');

setTimeout(() => {
    // Test 1: GET /
    http.get('http://localhost:3001/', (res) => {
        assert(res.statusCode === 200, 'GET / returns 200');

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const body = JSON.parse(data);
            assert(body.status === 'running', 'GET / returns status: running');

            // Test 2: GET /health
            http.get('http://localhost:3001/health', (res2) => {
                assert(res2.statusCode === 200, 'GET /health returns 200');

                let data2 = '';
                res2.on('data', chunk => data2 += chunk);
                res2.on('end', () => {
                    const body2 = JSON.parse(data2);
                    assert(body2.status === 'healthy', 'GET /health returns status: healthy');

                    console.log(`\nResults: ${passed} passed, ${failed} failed`);
                    process.exit(failed > 0 ? 1 : 0);
                });
            });
        });
    });
}, 500);