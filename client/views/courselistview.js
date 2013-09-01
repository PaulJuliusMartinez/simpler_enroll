/*
 * A file for an interactive list of courses. A number of various operations are
 * supported for the list that affect the overall schedule.
 */

/*
 * Constructor takes:
 * PARAM-TYPE: jQuery parent The parent element of the view.
 * PARAM-TYPE: CourseListController controller The controller of the view.
 */
CourseListView = function(parent, controller) {
  // TYPE: jQuery
  this.parent_ = parent;
  // TYPE: CourseListController
  this.controller_ = controller;
  // Type: Object.jQuery
  this.courses_ = {};
};


// TYPE: jQuery The list of courses.
this.table_;

// TYPE: jQuery The 'No classes selected' row.
this.noClasses_;

/*
 * Renders the view.
 */
CourseListView.prototype.render = function() {
  var headertext = $('<h1>').text('Courses I Want To Take:');
  var body = $('<div>').addClass(CourseListView.BODY);
  this.table_ = $('<table>').addClass(CourseListView.TABLE).
                             attr('cellspacing', 0).
                             attr('cellpadding', 0);
  this.tableHeader_ = $('<thead>').addClass(CourseListView.HEADER_BAR);
  this.tableHeader_.append($('<tr>').append(
      $('<th>').addClass(CourseListView.NAME_COLUMN).text('Class:'),
      $('<th>').addClass(CourseListView.AUTUMN_COLUMN).text('A'),
      $('<th>').addClass(CourseListView.WINTER_COLUMN).text('W'),
      $('<th>').addClass(CourseListView.SPRING_COLUMN).text('S'),
      $('<th>').addClass(CourseListView.SECTION_COLUMN).text('Section?'),
      $('<th>').addClass(CourseListView.CERTAINTY_COLUMN).text('Yes/Maybe/No'),
      $('<th>').addClass(CourseListView.EDIT_COLUMN)
  ));

  body.append(this.table_);
  this.table_.append(this.tableHeader_);
  this.noClasses_ = $('<tr>').
                        addClass(CourseListView.NO_COURSES_ROW).
                        append($('<td>').text(CourseListView.NO_COURSES_TEXT),
                               $('<td>'), $('<td>'), $('<td>'),
                               $('<td>'), $('<td>'), $('<td>')
                        );
  this.table_.append(this.noClasses_);

  // A tbody element is added after adding a row. In the future, that's what we
  // want to append stuff to.
  this.table_ = this.table_.children('tbody');

  this.parent_.append(headertext, body);
};

/*
 * Adds a new course to the list of courses.
 * PARAM-TYPE: Course course The course to add.
 */
CourseListView.prototype.addCourse = function(course) {
  if (this.courses_[course.getID()]) {
    // If course is already added, put it at the top.
    this.tableHeader_.preent
    this.courses_[course.getID()].insertAfter(this.tableHeader_);
  } else {
    // Create new course list and add it.
    var row = this.createCourseRow(course);
    this.table_.append(row);
    this.courses_[course.getID()] = row;
    // Since we added a row, remove the 'No classes selected' message.
    // jQuery remove is idempotent, so we can do this every time.
    this.noClasses_.remove();
  }
};

/*
 * Creates a new row element for a course.
 * PARAM-TYPE: Course course The course to make a row for.
 * RETURN-TYPE: jQuery The new <tr> element.
 */
CourseListView.prototype.createCourseRow = function(course) {
  var row = $('<tr>').addClass(CourseListView.COURSE_ROW);

  // Name
  row.append($('<td>').addClass(CourseListView.NAME_COLUMN).
                       text(course.getShortName() + ': ' + course.getTitle()));

  // Quarters offered in.
  row.append(this.createCheckBox(course, 0));
  row.append(this.createCheckBox(course, 1));
  row.append(this.createCheckBox(course, 2));

  // Discussion sections?
  row.append($('<td>').text((course.hasSecondaryComponent() ? 'Yes' : 'No')));

  // Yes/maybe/no

  // Move up/down, remove

  row.append($('<td>'), $('<td>'));
  return row;
};

/*
 * Creates a checkbox in a td element and returns it.
 * PARAM-TYPE: Course course The course it is for.
 * PARAM-TYPE: number quarter Which quarter it is for (0-2).
 * RETURN-TYPE: jQuery The new checkbox, embedded in a td element.
 */
CourseListView.prototype.createCheckBox = function(course, quarter) {
  var cssClass = CourseListView.QUARTER_COLUMNS[quarter];
  var td = $('<td>').addClass(cssClass);
  var isOffered = course.isOfferedIn(quarter);
  var checkbox = $('<input>').attr('type', 'checkbox').
                              prop('checked', isOffered).
                              attr('disabled', !isOffered);
  td.append(checkbox);
  return td;
};

/*
 * Constants
 * TYPE: string
 */
CourseListView.NO_COURSES_TEXT = "You haven't selected any classes!";
// CSS Constants
CourseListView.HEADER_TEXT = 'course-list-header-text';
CourseListView.BODY = 'course-list-body';
CourseListView.TABLE = 'course-list-table';
CourseListView.HEADER_BAR = 'course-list-header-bar';
CourseListView.NO_COURSES = 'course-list-no-courses';
// Columns
CourseListView.NAME_COLUMN = 'course-list-name-column';
CourseListView.AUTUMN_COLUMN = 'course-list-autumn-column';
CourseListView.WINTER_COLUMN = 'course-list-winter-column';
CourseListView.SPRING_COLUMN = 'course-list-spring-column';
CourseListView.QUARTER_COLUMNS = [CourseListView.AUTUMN_COLUMN,
                                  CourseListView.WINTER_COLUMN,
                                  CourseListView.SPRING_COLUMN];
CourseListView.SECTION_COLUMN = 'course-list-section-column';
CourseListView.CERTAINTY_COLUMN = 'course-list-certainty-column';
CourseListView.EDIT_COLUMN = 'course-list-edit-column';
// Rows
CourseListView.NO_COURSES_ROW = 'course-list-no-courses-row';
CourseListView.COURSE_ROW = 'course-list-course-row';
