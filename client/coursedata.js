/*
 * Utility class with methods designed for interacting with all the
 * coarse-grained course data, i.e., dealing with all the courses for a
 * department.
 */


CourseData = {};

/*
 * Initialization of the course data. (This prevents errors caused by the order
 * that we add the files at the expense of having to explicitly initialize the
 * object.)
 */
CourseData.init = function() {
  this.cache_ = new CourseDataCache();
};


/*
 * Gets lists of course names for a department.
 * @param string dep The department name.
 */
CourseData.getCourseNamesForDepartment = function(dep) {
  var courses = this.cache_.getCourses(dep);
  if (courses) return courses[CourseDataCache.COURSE_DATA];
  return null;
};


/*
 * Given a department and a string, returns the courses that have the string as
 * a prefix in that particular department.
 * @param string dep The department.
 * @param string prefix The prefix.
 */
CourseData.getCourseNamesForDepartmentByPrefix = function(dep, prefix) {
  var courses = this.cache_.getCourses(dep);
  if (!courses) return [];
  var allCoursesInDep = courses[CourseDataCache.SORTED_COURSE_LIST];
  if (!allCoursesInDep) return [];
  var re = new RegExp('^' + prefix);
  var results = [];
  for (var i = 0; i < allCoursesInDep.length; i++) {
    if (re.test(allCoursesInDep[i])) results.push(allCoursesInDep[i]);
  }
  return results;
};


/*
 * Returns the name a course given the department and course number.
 * @param string dep The department.
 * @param string number The course number.
 * @return string The name of the class.
 */
CourseData.getCourseName = function(dep, number) {
  var courses = this.cache_.getCourses(dep);
  if (!courses) return "";
  var course = courses[CourseDataCache.COURSE_DATA][number];
  if (!course) return "";
  return course.title;
};
