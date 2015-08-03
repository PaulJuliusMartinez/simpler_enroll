/*
 * Simple way to store the course list the user has selected.
 */

UserState = {};

/*
 * Loads the previously stored user state.
 */
UserState.loadSavedCourses = function() {
  this.ignoreSaveCalls();
  // Get the most updated UserState.
  var courses = localStorage[UserState.COURSE_LIST_V3];

  if (!courses) {
    localStorage[UserState.COURSE_LIST_V3] = "{\"courses\":[]}";
  } else {
    courses = JSON.parse(courses).courses;
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
  localStorage[UserState.COURSE_LIST_V3] = JSON.stringify(data);
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
UserState.COURSE_LIST_V2 = 'scheduling_course_list_v2';
UserState.COURSE_LIST_V3 = 'scheduling_course_list_v3';
