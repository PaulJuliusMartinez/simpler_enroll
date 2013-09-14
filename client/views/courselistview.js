/*
 * A file for an interactive list of courses. A number of various operations are
 * supported for the list that affect the overall schedule.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: CourseListController controller The controller of the view.
 */
CourseListView = function(controller) {
  // TYPE: CourseListController
  this.controller_ = controller;
  // Type: Object.jQuery
  this.courses_ = {};
  // TYPE: number
  this.numClasses_ = 0;
  // TYPE: jQuery
  this.template_ = $('.' + CourseListView.TEMPLATE);
};


// TYPE: jQuery The list of courses.
this.table_;

// TYPE: jQuery The 'No classes selected' row.
this.noClasses_ = 0;

/*
 * Decorates a component.
 * PARAM-TYPE: jQuery parent The parent element of the view.
 */
CourseListView.prototype.decorate = function(parent) {
  this.table_ = $(parent.find('.course-list-body')[0]);
  // Add the 'No classes' message.
  this.noClasses_ = $($('.' + CourseListView.NO_COURSES_ROW)[0]);
};

/*
 * Adds a new course to the list of courses.
 * PARAM-TYPE: Course course The course to add.
 */
CourseListView.prototype.addCourse = function(course) {
  if (this.courses_[course.getID()]) {
    // If course is already added, put it at the top.
    this.table_.prepend(this.courses_[course.getID()]);
  } else {
    // Create new course list and add it.
    var row = this.createCourseRow(course);
    this.table_.prepend(row);
    this.courses_[course.getID()] = row;
    this.numClasses_++;
    // Since we added a row, remove the 'No classes selected' message.
    // jQuery remove is idempotent, so we can do this every time.
    this.noClasses_.remove();
    // This isn't working right now.
    //this.table_.sortable({ axis: 'y' });
  }
};

/*
 * Removes a course from the list.
 * PARAM-TYPE: Course course The course to remove.
 */
CourseListView.prototype.removeCourse = function(course) {
  if (this.courses_[course.getID()]) {
    this.courses_[course.getID()].remove();
    this.courses_[course.getID()] = null;
    this.numClasses_--;

    // Add back the no classes label if needed.
    if (this.numClasses_ == 0) {
      this.table_.append(this.noClasses_);
    }
  }
};

/*
 * Creates a new row element for a course.
 * PARAM-TYPE: Course course The course to make a row for.
 * RETURN-TYPE: jQuery The new <tr> element.
 */
CourseListView.prototype.createCourseRow = function(course) {
  var row = this.template_.clone();
  row.removeClass(CourseListView.TEMPLATE);
  var cols = row.children();

  // Listen to trashcan event.
  var controller = this.controller_;
  $(cols[0]).click(function() {
    controller.removeCourse(course);
  });

  // Name
  $(cols[1]).text(course.getShortName() + ': ' + course.getTitle());

  // Quarters offered in.
  this.createCheckBox($(cols[2]), course, 0);
  this.createCheckBox($(cols[3]), course, 1);
  this.createCheckBox($(cols[4]), course, 2);

  // Discussion sections?
  $(cols[5]).text((course.hasSecondaryComponent() ? 'Yes' : 'No'));

  // Enroll/Plan/Drop
  var widgit = new EnrollPlanDrop($(cols[6]), this.controller_, course);

  return row;
};

/*
 * Creates a checkbox in a td element and returns it.
 * PARAM-TYPE: jQuery td The td element to fill.
 * PARAM-TYPE: Course course The course it is for.
 * PARAM-TYPE: number quarter Which quarter it is for (0-2).
 */
CourseListView.prototype.createCheckBox = function(td, course, quarter) {
  var isOffered = course.isOfferedIn(quarter);
  var checkbox = $(td.children()[0]);
  checkbox.prop('checked', isOffered).attr('disabled', !isOffered);

  var controller = this.controller_;
  td.click(function() {
    controller.willTakeClassInQuarter(course, quarter, checkbox.is(':checked'));
  });
  td.append(checkbox);
};

/*
 * Adds movement buttons
 * PARAM-TYPE: Course course The course that's getting removed.
 */
CourseListView.prototype.createTrashcan = function(course) {
  var cssClass = CourseListView.DELETE_COLUMN;
  var td = $('<td>').addClass(cssClass).
                     append($('<img>').
                         attr('src', './client/images/trashcan.svg'));
  return td;
};

/*
 * Constants
 * TYPE: string
 */
CourseListView.TEMPLATE = 'course-list-row-template';
CourseListView.NO_COURSES_TEXT = "You haven't selected any classes!";
// CSS Constants
CourseListView.HEADER_TEXT = 'course-list-header-text';
CourseListView.BODY = 'course-list-body';
CourseListView.TABLE = 'course-list-table';
CourseListView.HEADER_BAR = 'course-list-header-bar';
CourseListView.NO_COURSES = 'course-list-no-courses';
// Columns
CourseListView.DELETE_COLUMN = 'course-list-delete-column';
CourseListView.NAME_COLUMN = 'course-list-name-column';
CourseListView.AUTUMN_COLUMN = 'course-list-autumn-column';
CourseListView.WINTER_COLUMN = 'course-list-winter-column';
CourseListView.SPRING_COLUMN = 'course-list-spring-column';
CourseListView.QUARTER_COLUMNS = [CourseListView.AUTUMN_COLUMN,
                                  CourseListView.WINTER_COLUMN,
                                  CourseListView.SPRING_COLUMN];
CourseListView.SECTION_COLUMN = 'course-list-section-column';
CourseListView.STATUS_COLUMN = 'course-list-status-column';
// Rows
CourseListView.NO_COURSES_ROW = 'course-list-no-courses-row';
CourseListView.COURSE_ROW = 'course-list-course-row';
