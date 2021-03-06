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
 * PARAM-TYPE: string dep The short name of the department.
 * PARAM-TYPE: function(Course[]) callback The callback.
 */
CourseDataCache.prototype.getCourses = function(dep, callback) {
  if (this.storedCourses_[dep]) {
    callback(this.storedCourses_[dep]);
  } else {
    var filename = './client/models/data/' + dep + '.js';
    var cache = this;

    $.ajax({
        dataType: "json",
        url: filename,
        success: function(data) {
          cache.storedCourses_[dep] =
              CourseDataCache.createSortedCourseNameObject_(data);
          callback(cache.storedCourses_[dep]);
        },
        error: function() {
          window.console.log('Error in downloading/parsing ' + dep);
        }
    });
  }
};


/*
 * Takes a object containing courses that has every class as a key and creates
 * another object that has two fields: 'coursenames' and 'courses'. The first is
 * a sorted list of the course names, the second is the original object
 * containing all the courses.
 * PARAM-TYPE: Object courses The courses object.
 * RETURN-TYPE: Object
 */
CourseDataCache.createSortedCourseNameObject_ = function(data) {
  var sortedNames = [];
  for (key in data) {
    sortedNames.push(key);
    data[key] = new Course(data[key]);
  }
  sortedNames.sort(function(a, b) {
    var courseDiff = parseInt(a) - parseInt(b);
    if (courseDiff != 0) return courseDiff;
    return (a < b) ? -1 : 1;
  });
  var obj = {};
  obj[this.SORTED_COURSE_LIST] = sortedNames;
  obj[this.COURSE_DATA] = data;
  return obj;
};


/*
 * Constants for those two field names above.
 * TYPE: string
 */
CourseDataCache.SORTED_COURSE_LIST = 'sorted-names';
CourseDataCache.COURSE_DATA = 'course-data';
