/*
 * Class for dealing with course sections.
 */

/*
 * The constructor takes the Course object the course is a part of as well as
 * a part of JSON string.
 * PARAM-TYPE: Course course The course
 * PARAM-TYPE: Object obj The JSON object.
 */
Section = function(course, obj) {
  // TYPE: Course
  this.course_ = course;
  // TYPE: string[]
  this.instructors_ = obj[CourseConstants.INSTRUCTORS];
  // TYPE: Meeting[]
  this.meetings_ = [];
  if (obj[CourseConstants.MEETINGS]) {
    for (var i = 0; i < obj[CourseConstants.MEETINGS].length; i++) {
      this.meetings_.push(new Meeting(this, obj[CourseConstants.MEETINGS][i]));
    }
  }
  // TYPE: boolean
  this.shouldShow_ = true;
  // TYPE: number
  this.id_ = UniqueID.newID();
};

/* Simple getters */
Section.prototype.getCourse = function() { return this.course_; };
Section.prototype.getInstructors = function() {
  return this.instructors_.slice();
};
Section.prototype.getMeetings = function() {
  return this.meetings_.slice();
};
Section.prototype.shouldShow = function() { return this.shouldShow_; };
Section.prototype.getID = function() { return this.id_; };

/* Setters */
Section.prototype.setShow = function(should) { this.shouldShow_ = should; };

/*
 * Check if a section conflicts with another section of a different class.
 * PARAM-TYPE: Section other The other section.
 * RETURN-TYPE: boolean
 */
Section.prototype.conflictsWith = function(other) {
  for (var i = 0; i < this.meetings_.length; i++) {
    for (var j = 0; j < other.meetings_.length; j++) {
      if (this.meetings_[i].conflictsWith(other.meetings_[j])) return true;
    }
  }
  return false;
};
