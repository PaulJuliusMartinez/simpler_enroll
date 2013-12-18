/*
 * A view for displaying course information.
 */

/*
 * Constructor takes the controller of the view.
 * PARAM-TYPE: SectionController controller The controller of the view.
 */
InformationView = function(controller) {
  // TYPE: InformationController
  this.controller_ = controller;
  // TYPE: jQuery
  this.container_;
};


/*
 * Decorates an empty div.
 * PARAM-TYPE: jQuery parent The parent element of the view.
 */
InformationView.prototype.decorate = function(parent) {
  this.container_ = $($('.' + InformationView.TEMPLATE)[0]);
  this.container_.removeClass(InformationView.TEMPLATE);
  parent.append(this.container_);
};

/*
 * Adds a class to the info viewer.
 * PARAM-TYPE: Course course The course to add.
 */
InformationView.prototype.showCourse = function(course) {
  this.container_.find('.' + InformationView.NUMBER)[0].innerHTML =
    course.getDepartment() + ' ' + course.getNumber() + ': ';
  this.container_.find('.' + InformationView.TITLE)[0].innerHTML =
    course.getTitle();
  this.container_.find('.' + InformationView.DESCRIPTION)[0].innerHTML =
    course.getDescription();
  this.container_.find('.' + InformationView.GERS)[0].innerHTML =
    'GERs satisfied: ' + InformationView.GERsToString(course.getGERs());
};

/*
 * Convert array of strings to single string
 * PARAM-TYPE: String gers The GERS to convert to a string.
 * RETURN-TYPE: String
 */
InformationView.GERsToString = function(gers) {
  if (gers.length == 0) return 'None';
  var str = '';
  for (var i = 0; i < gers.length; i++) {
    if (i != 0) str += ', ';
    str += gers[i];
  }
  return str;
};

InformationView.TEMPLATE = 'info-template';
InformationView.CONTAINER = 'info-container';
InformationView.NUMBER = 'info-number';
InformationView.TITLE = 'info-title';
InformationView.DESCRIPTION = 'info-description';
InformationView.GERS = 'info-gers';
