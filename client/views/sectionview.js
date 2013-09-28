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
  // TYPE: Object(number : SectionHelper)
  this.courses_ = {};
  // TYPE: jQuery
  this.courseSelect_;
  // TYPE: jQuery
  this.quarterSelect_;
  // TYPE: jQuery
  this.primaryType_;
  // TYPE: jQuery
  this.secondaryType_;
  // TYPE: jQuery
  this.primaryContainer_;
  // TYPE: jQuery
  this.secondaryContainer_;
};


// TYPE: jQuery
SectionView.NOT_OFFERED_PRIMARY_DIV = $('<div>').
    text('This course is not offered during this quarter');

// TYPE: jQuery
SectionView.NOT_OFFERED_SECONDARY_DIV = $('<div>').
    text('This course is not offered during this quarter');

// TYPE: jQuery
SectionView.NO_SECONDARY_COMPONENT_DIV = $('<div>').
    text('There is no secondary component for this class during this quarter.');

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
  // Listen to the select change events.
  var view = this;
  this.courseSelect_.on('change', function() { view.fixDisplay(); });
  this.quarterSelect_.on('change', function() { view.fixDisplay(); });

  // Get the headers for the section names
  var headers = sectionView.find('.' + SectionView.HEADER);
  this.primaryType_ = $(headers[0]);
  this.secondaryType_ = $(headers[1]);

  // Get the containers for the section lists.
  var primary = $(sectionView.find('.' + SectionView.PRIMARY));
  this.primaryContainer_ = $(primary.children()[1]);

  var secondary = $(sectionView.find('.' + SectionView.SECONDARY));
  this.secondaryContainer_ = $(secondary.children()[1]);

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
 * Gets the current selected section helper.
 * RETURN-TYPE: SectionHelper
 */
SectionView.prototype.getSelectedCourse = function() {
  return this.courses_[this.courseSelect_.val()];
};

/*
 * Gets the currently selected quarter.
 * RETURN-TYPE: number
 */
SectionView.prototype.getSelectedQuarter = function() {
  return this.quarterSelect_.val();
};

/*
 * Adds a class to the section viewer.
 * PARAM-TYPE: Course course The course to add.
 */
SectionView.prototype.addCourse = function(course) {
  var id = course.getID();
  // If the courses is already added, we'll just select it and return.
  if (this.courses_[id]) {
    this.courseSelect_.val(id);
    this.selectQuarter(course.firstQuarterOffered());
    this.fixDisplay();
    return;
  }

  // Otherwise, we have to build everything up.
  var name = course.getShortName();
  var helper = new SectionHelper(course);
  var option = $('<option>').text(name).attr('value', id);
  helper.dropDownOption = option;
  this.courseSelect_.append(option);

  // Create the actual section divs
  for (var quarter = 0; quarter < 3; quarter++) {
    if (!course.isOfferedIn(quarter)) {
      this.primaryContainer_.append(SectionView.NOT_OFFERED_PRIMARY_DIV);
      helper.primarySections.push(SectionView.NOT_OFFERED_PRIMARY_DIV);
      this.secondaryContainer_.append(SectionView.NOT_OFFERED_SECONDARY_DIV);
      helper.secondarySections.push(SectionView.NOT_OFFERED_SECONDARY_DIV);
      continue;
    }
    // Make primary section things
    var primaryDiv = $('<div>').addClass(SectionView.COURSE_SECTIONS);
    var primarySections = course.getPrimarySectionsForQuarter(quarter);
    for (var i = 0; i < primarySections.length; i++) {
      var display = new SectionDisplay(primaryDiv, primarySections[i]);
      helper.primarySectionDisplays[quarter].push(display);
    }
    this.primaryContainer_.append(primaryDiv);
    helper.primarySections.push(primaryDiv);

    // Make secondary section things, if needed
    var secondaryDiv;
    if (course.hasSecondaryComponent()) {
      secondaryDiv = $('<div>').addClass(SectionView.COURSE_SECTIONS);
      var secondarySections = course.getSecondarySectionsForQuarter(quarter);
      for (var i = 0; i < secondarySections.length; i++) {
        var display = new SectionDisplay(secondaryDiv, secondarySections[i]);
        helper.secondarySectionDisplays[quarter].push(display);
      }
    } else {
      secondaryDiv = SectionView.NO_SECONDARY_COMPONENT_DIV;
    }
    this.secondaryContainer_.append(secondaryDiv);
    helper.secondarySections.push(secondaryDiv);
  }

  // Save the helper and fix the display.
  this.courses_[id] = helper;
  this.courseSelect_.val(id);
  this.selectQuarter(course.firstQuarterOffered());
  this.fixDisplay();
};

/*
 * Removes a class from the display
 * PARAM-TYPE: Course course The course to remove.
 */
SectionView.prototype.removeCourse = function(course) {
  var helper = this.courses_[course.getID()];
  if (!helper) return;

  helper.dropDownOption.remove();
  for (var i = 0; i < 3; i++) {
    helper.primarySections[i].remove();
    helper.secondarySections[i].remove();
  }
  delete this.courses_[course.getID()];

  this.fixDisplay();
};

/*
 * Selects a specific course.
 * PARAM-TYPE: Course course The course to select.
 */
SectionView.prototype.selectCourse = function(course) {
  this.courseSelect_.val(course.getID());
};

/*
 * Selects a specific quarter.
 * PARAM-TYPE: number quarter The quarter to select.
 */
SectionView.prototype.selectQuarter = function(quarter) {
  this.quarterSelect_.val(quarter);
};

/*
 * Fixes the display by properly hiding all the elements and showing only the
 * ones that should be displayed.
 */
SectionView.prototype.fixDisplay = function() {
  // First hide everything
  for (id in this.courses_) {
    for (var i = 0; i < 3; i++) {
      this.courses_[id].primarySections[i].hide();
      this.courses_[id].secondarySections[i].hide();
    }
  }

  // Get the current course/quarter and show that
  var selectedCourse = this.courseSelect_.val();
  var selectedQuarter = this.quarterSelect_.val();
  if (selectedCourse && selectedQuarter) {
    this.courses_[selectedCourse].primarySections[selectedQuarter].show();
    this.courses_[selectedCourse].secondarySections[selectedQuarter].show();

    // Set the course types:
    var course = this.courses_[selectedCourse].course;
    this.primaryType_.text(course.getPrimarySectionType());
    this.secondaryType_.text(course.getSecondarySectionType());
  }
}

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
  // TYPE: SectionDisplay[][]
  this.primarySectionDisplays = [[], [], []];
  // TYPE: jQuery[]   1 div for each quarter
  this.secondarySections = [];
  // TYPE: SectionDisplay[][]
  this.secondarySectionDisplays = [[], [], []];
};

/*
 * Helper object for the actual div with the section information
 * PARAM-TYPE: jQuery parent The parent to append the div to.
 * PARAM-TYPE: Section section The section this div corresponds to.
 * RETURN-TYPE: Retru
 */
SectionDisplay = function(parent, section) {
  // TYPE: Section
  this.section_ = section;
  // TYPE: jQuery
  this.div_ = $('<div>').addClass(SectionView.INDIVIDUAL_SECTION);

  if (section.shouldShow()) this.div_.addClass(SectionView.SHOWING_SECTION);

  // TYPE: jQuery
  this.showText_ = $('<span>').
    text((section.shouldShow() ? 'Showing' : 'Not showing'));
  this.div_.append(this.showText_);
  this.div_.append('<br>');

  // TODO: Add instructors here? I don't think that's working right now.
  var meetings = section.getMeetings();
  for (var i = 0; i < meetings.length; i++) {
    if (i > 0) this.div_.append('<br>');
    this.div_.append(meetings[i].toString());
  }

  // Add click listener
  var display = this;
  this.div_.click(function() {
    display.setShow(!section.shouldShow());
    $.Events(Events.COURSE_CHANGE).dispatch();
  });

  var id = section.getID();
  this.div_.hover(function() {
                    $.Events(Events.SECTION_ACCENT_PREFIX + id).dispatch();
                  },
                  function() {
                    $.Events(Events.SECTION_UNACCENT_PREFIX + id).dispatch();
                  });

  // Append the div
  parent.append(this.div_);
};


/*
 * Sets the display to reflect that the current section is (not) shown.
 * PARAM-TYPE: boolean show True if the current section is shown.
 */
SectionDisplay.prototype.setShow = function(show) {
  if (show) {
    this.div_.addClass(SectionView.SHOWING_SECTION);
  } else {
    this.div_.removeClass(SectionView.SHOWING_SECTION);
  }
  this.showText_.text((show ? 'Showing' : 'Not showing'));
  this.section_.setShow(show);
};

SectionView.TEMPLATE = 'section-template';
SectionView.COURSE_SELECT = 'section-course-select';
SectionView.QUARTER_SELECT = 'section-quarter-select';
SectionView.PRIMARY = 'section-primary-container';
SectionView.SECONDARY = 'section-secondary-container';
SectionView.HEADER = 'section-section-header';
SectionView.SECTION_CONTAINER = 'section-section-container';
SectionView.BUTTONS = 'section-buttons';
SectionView.COURSE_SECTIONS = 'section-course-sections';
SectionView.INDIVIDUAL_SECTION = 'section-individual-section';
SectionView.SHOWING_SECTION = 'section-showing-section';
