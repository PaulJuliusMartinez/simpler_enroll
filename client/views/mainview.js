/*
 * This is the MainView which is responsible for the layout of the entire site.
 */

/*
 * Constructor takes the element the view is rendered in.
 * PARAM-TYPE: jQuery parent The parent element of the view.
 */
MainView = function(parent) {
  // TYPE: jQuery
  this.parent_ = parent;
  // TYPE: Object.jQuery
  this.containers_ = {};
};


/*
 * This builds all the relevant DOM elements necessary for the view.
 * The MainView is largely concerned with the layout of the application. It
 * stores each of the divs it creates in an object that can be returned so that
 * child view can be rendered.
 */
MainView.prototype.render = function() {
  var topleft = $('<div>').addClass(MainView.COURSE_SELECTION_AREA);
  var topright = $('<div>').addClass(MainView.PREFERENCES_PANEL);
  var bottom = $('<div>').addClass(MainView.SCHEDULE_PREVIEW);
  var search = $('<div>').addClass(MainView.SEARCH_BOX);
  var courselist = $('<div>').addClass(MainView.COURSE_LIST);

  // Top left is search bar on top of course list.
  topleft.append(search);
  topleft.append(courselist);

  // Add everything to parent.
  this.parent_.append(topleft);
  this.parent_.append(topright);
  this.parent_.append(bottom);

  // Set the containers.
  this.containers_[MainView.SEARCH_BOX] = search;
  this.containers_[MainView.COURSE_LIST] = courselist;
  this.containers_[MainView.PREFERENCES_PANEL] = topright;
  this.containers_[MainView.SCHEDULE_PREVIEW] = bottom;
};

/*
 * Return the containers that will hold the child views.
 * RETURN-TYPE: Object.jQuery
 */
MainView.prototype.getContainers = function() {
  return this.containers_;
};

/*
 * Constants for the container names. These are also the CSS names.
 * TYPE: string
 */
MainView.COURSE_SELECTION_AREA = 'main-course-selection-container';
MainView.SEARCH_BOX = 'main-search-box-container';
MainView.COURSE_LIST = 'main-course-list-container';
MainView.SCHEDULE_PREVIEW = 'main-schedule-preview-container';
MainView.PREFERENCES_PANEL = 'main-preferences-panel-container';
