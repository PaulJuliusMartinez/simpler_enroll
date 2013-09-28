/*
 * Just a simple assert function for use elsewhere.
 */

assert = function(condition, message) {
  if (!condition) {
    if (!message) message = "An error has occurred!";
    throw message;
  }
};
