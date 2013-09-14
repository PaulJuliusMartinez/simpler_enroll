/*
 * A view for dealing with sections of courses.
 */

/*
 * Constructor takes the controller of the view.
 * PARAM-TYPE: SectionController controller The controller of the view.
 */
SectionView = function(controller) {
  // TYPE: SectionController
  this.controller_ = controller;
  // TYPE: Object(string : SectionHelper)
  this.courses_ = {};
  // TYPE: jQuery
  this.courseSelect_;
  // TYPE: jQuery
  this.quarterSelect_;
  // TYPE: jQuery
  this.primaryContainer_;
  // TYPE: jQuery
  this.secondaryContainer_;
};


/*
 * Decorates an empty div.
 * PARAM-TYPE: jQuery parent The parent element of the view.
 */
SectionView.prototype.decorate = function(parent) {
  var sectionView = $($('.' + SectionView.TEMPLATE)[0]);
  sectionView.removeClass(SectionView.TEMPLATE);
  parent.append(sectionView);

  this.courseSelect_ = $(sectionView.find('.' + SectionView.COURSE_SELECT)[0]);
  this.quarterSelect_ = $(
      sectionView.find('.' + SectionView.QUARTER_SELECT)[0]);

  // Get the containers for the section lists.
  var primary = $(sectionView.find('.' + SectionView.PRIMARY));
  this.primaryContainer_ = $(primary.children()[0]);

  var secondary = $(sectionView.find('.' + SectionView.SECONDARY));
  this.secondaryContainer_ = $(secondary.children()[0]);

  // Set up the buttons
  var buttons = sectionView.find('input');
  var controller = this.controller_;
  for (var i = 0; i < 4; i++) {
    var all = (i % 2 == 0);
    var primary = (i < 2);
    $(buttons[i]).click((function(all, primary) {
      return function() {
        controller.viewAll(all, primary);
        return false;
      };
    })(all, primary));
  }
};

/*
 * Adds a class to the section viewer.
 * PARAM-TYPE: Course course The course to add.
 */
SectionView.prototype.addCourse = function(course) {
  var name = course.getShortName();
  this.courses_[name] = new SectionHelper(course);
  var option = $('<option>').text(name).attr('value', name);
  this.courses_[name].dropDownOption = option;
  this.courseSelect_.append(option);
};

/*
 * Helper object for keeping track of all the DOM elements associated with
 * a certain course.
 */
SectionHelper = function(course) {
  // TYPE: Course
  this.course = course;
  // TYPE: jQuery
  this.dropDownOption = null;
  // TYPE: jQuery[]   1 div for each quarter
  this.primarySections = [];
  // TYPE: jQuery[]   1 div for each quarter
  this.secondarySections = [];
};

SectionView.TEMPLATE = 'section-template';
SectionView.COURSE_SELECT = 'section-course-select';
SectionView.QUARTER_SELECT = 'section-quarter-select';
SectionView.PRIMARY = 'section-primary-container';
SectionView.SECONDARY = 'section-secondary-container';
SectionView.SECTION_CONTAINER = 'section-section-container';
SectionView.BUTTONS = 'section-buttons';
