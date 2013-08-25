/*
 * This file deals with dynamically bringing in the files containing all the
 * classes for a certain department.
 */

/*
 * Constructor:
 */
CourseDataCache = function() {
  this.storedCourses_ = {};
};


/*
 * Get the course data for a department.
 * @param string dep The short name of the department.
 */
CourseDataCache.prototype.getCourses = function(dep) {
  if (this.storedCourses_[dep]) {
    return this.storedCourses_[dep];
  } else {
    var filename = './courses/courses/' + dep + '.js';
    var cache = this;

    // Load data NOT asynchronously
    $.ajax({
        dataType: "json",
        url: filename,
        async: false,
        success: function(data) {
          cache.storedCourses_[dep] = data;
        }
    });
    return this.storedCourses_[dep];
  }
};
