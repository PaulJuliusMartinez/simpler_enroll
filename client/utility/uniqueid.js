/*
 * This provides a simple unique ID generator. This doesn't produce random IDs;
 * they start at 0 and go up.
 */

UniqueID = (function () {
  var id = 0;
  return {
    newID: function() {
      return id++;
    }
  }
})();
