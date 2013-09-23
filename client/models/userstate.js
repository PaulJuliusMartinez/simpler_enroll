/*
 * Simple way to store the course list the user has selected.
 */

UserState = {};

/*
 * Loads the previously stored user state.
 */
UserState.loadSavedCourses = function() {
  this.ignoreSaveCalls();
  var cookie = document.cookie;
  var start = cookie.indexOf(UserState.COURSE_LIST_V1 + "=");
  if (start == -1) {
    // If there was no cookie, we'll add one.
    document.cookie = UserState.COURSE_LIST_V1 + "={\"courses\":[]};" + cookie;
  } else {
    start = cookie.indexOf("=", start) + 1;
    var end = cookie.indexOf(";", start);
    if (end == -1) end = cookie.length;
    var courses = JSON.parse(cookie.substring(start, end)).courses;
    for (var i = 0; i < courses.length; i++) {
      var dep = courses[i].dep;
      var num = courses[i].num;
      (function(i) {
        CourseData.getCourse(dep, num, function(course) {
          if (course) {
            var quarters = courses[i].quarterStatus;
            var status = courses[i].status;
            for (var quarter = 0; quarter < 3; quarter++) {
              course.getStatus().setQuarterStatus(quarter, quarters[quarter]);
            }
            course.getStatus().setEnrollmentStatus(status);
            $.Events(Events.COURSE_ADDED).dispatch(course);
          }
        });
      })(i);
    }
  }
};

/*
 * Saves the state of an array of courses.
 * PARAM-TYPE: Course[] courses The courses to save.
 */
UserState.saveCourses = function(courses) {
  if (this.shouldIgnore_) return;
  var cookie = document.cookie;
  var start = cookie.indexOf(UserState.COURSE_LIST_V1 + "=");
  start = cookie.indexOf("=", start) + 1;
  var end = cookie.indexOf(";", start);
  if (end == -1) end = cookie.length;
  var oldCookie = cookie.substring(start, end);

  var courseArr = [];
  for (var i = 0; i < courses.length; i++) {
    var quarterArr = [];
    for (var quarter = 0; quarter < 3; quarter++) {
      quarterArr.push(courses[i].getStatus().getQuarterStatus(quarter));
    }
    var obj = {
      dep: courses[i].getDepartment(),
      num: courses[i].getNumber(),
      quarterStatus: quarterArr,
      status: courses[i].getStatus().getEnrollmentStatus()
    };
    courseArr.push(obj);
  }
  var data = {courses: courseArr};
  document.cookie = cookie.replace(oldCookie, JSON.stringify(data));
  window.console.log(JSON.stringify(data));
};

/*
 * Tells the UserState to ignore calls to saveCourses.
 */
UserState.ignoreSaveCalls = function() {
  this.shouldIgnore_ = true;
};

/*
 * Tells the UserState to stop ignoring calls to saveCourses.
 */
UserState.stopIgnoring = function() {
  this.shouldIgnore_ = false;
};


UserState.COURSE_LIST_V1 = 'scheduling_course_list_v1';
