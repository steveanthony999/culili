// Import necessary modules for testing
const request = require('supertest'); // For making HTTP requests in tests
const app = require('../server'); // The Express server instance

// Test suite for error handling functionality
describe('Error Handling Tests', () => {
  // Test case: Check if a custom error message is returned for a specific route
  it('should return a custom error message', async () => {
    // Make a GET request to the '/error-test' route
    const response = await request(app).get('/error-test');

    // Expect the response status to be 404 (Not Found)
    expect(response.status).toBe(404);

    // Expect the error message in the response body to match the custom error message
    expect(response.body.error).toBe('Intentional Test Error');
  });

  // Test case: Check if a default error message is returned for unhandled errors
  it('should return a default error message for unhandled errors', async () => {
    // Make a GET request to the '/unhandled-error-test' route
    const response = await request(app).get('/unhandled-error-test');

    // Expect the response status to be 500 (Internal Server Error)
    expect(response.status).toBe(500);

    // Expect the error message in the response body to match the default error message
    expect(response.body.error).toBe('Internal Server Error');
  });
});
