/**
 * CustomError Class
 * Extends the built-in Error class to provide additional functionality
 * for handling HTTP status codes alongside error messages.
 */
class CustomError extends Error {
  /**
   * Constructor for the CustomError class.
   *
   * @param {number} statusCode - HTTP status code for the error.
   * @param {string} message - Error message to be displayed.
   */
  constructor(statusCode, message) {
    super(message); // Call the parent class (Error) constructor with the message
    this.statusCode = statusCode; // Assign the provided HTTP status code to the error instance
  }
}

// Export the CustomError class for use in other modules
module.exports = CustomError;
