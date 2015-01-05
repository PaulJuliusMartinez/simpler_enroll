/*
 * Class for dealing with entire course objects.
 */

/*
 * The constructor for the Course object takes a JSON object and simply
 * populates its own fields. If the JSON object does not contain a field, it is
 * then initalized to an appropriate default.
 * TYPE: Object obj A JSON object containing the course data.
 */
Course = function(obj) {
  // TYPE: string
  this.department_ = obj[CourseConstants.DEPARTMENT] || '';
  // TYPE: string
  this.number_ = obj[CourseConstants.NUMBER] || '';
  // TYPE: string
  this.title_ = obj[CourseConstants.TITLE] || '';
  // TYPE: string
  this.description_ = obj[CourseConstants.DESCRIPTION] || '';
  // TYPE: number
  this.minUnits_ = obj[CourseConstants.MIN_UNITS] || 0;
  // TYPE: number
  this.maxUnits_ = obj[CourseConstants.MAX_UNITS] || 0;
  // TYPE: string[]
  this.gers_ = obj[CourseConstants.GERS] || [];
  // We have a problem if there's no primary component...
  //assert(obj[CourseConstants.PRIMARY_COMPONENT], 'This course object had no primary component!');
  // TYPE: Section[][]
  this.primaryComponent_ = this.convertJSONSectionsToSectionArray(
      obj, CourseConstants.PRIMARY_COMPONENT, true);
  // TYPE: string
  this.primaryComponentType_ = obj[CourseConstants.PRIMARY_TYPE] || 'N/A';
  // TYPE: Section[][]
  this.secondaryComponent_ = this.convertJSONSectionsToSectionArray(
      obj, CourseConstants.SECONDARY_COMPONENT, false);
  // TYPE: string
  this.secondaryComponentType_ = obj[CourseConstants.SECONDARY_TYPE] || 'N/A';
  // TYPE: Status
  this.status_ = new Status();
  // TYPE: number
  this.id_ = obj[CourseConstants.COURSE_ID];
};

/*
 * Takes the list of sections and converts them to Section objects.
 * PARAM-TYPE: Object obj The JSON object.
 * PARAM-TYPE: string key The key of the relevant field.
 * PARAM-TYPE: boolean show Whether the section should initially be shown.
 * RETURN-TYPE: Section[][]
 */
Course.prototype.convertJSONSectionsToSectionArray = function(obj, key, show) {
  if (!obj[key]) return null;
  var arr = [[], [], []];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < obj[key][i].length; j++) {
      var section = new Section(this, obj[key][i][j]);
      section.setShow(show);
      arr[i].push(section);
    }
  }
  return arr;
};

/*
 * Some basic getters.
 */
Course.prototype.getDepartment = function() { return this.department_; };
Course.prototype.getNumber = function() { return this.number_; };
Course.prototype.getShortName = function() {
  return this.department_ + ' ' + this.number_;
};
Course.prototype.getTitle = function() { return this.title_; };
Course.prototype.getDescription = function() { return this.description_; };
Course.prototype.getMinUnits = function() { return this.minUnits_; };
Course.prototype.getMaxUnits = function() { return this.maxUnits_; };
// Return a shallow copy.
Course.prototype.getGERs = function() { return this.gers_.slice(); };
// Status and ID
Course.prototype.getStatus = function() { return this.status_; };
Course.prototype.getID = function() { return this.id_; };
// Section types
Course.prototype.getPrimarySectionType = function() {
  return this.primaryComponentType_;
};
Course.prototype.getSecondarySectionType = function() {
  return this.secondaryComponentType_;
};

// Some basic util methods.
/*
 * Gets the primary/secondary sections for the specified quarter.
 * PARAM-TYPE: enum
 * RETURN-TYPE: Section[]
 */
Course.prototype.getPrimarySectionsForQuarter = function(quarter) {
  return this.primaryComponent_[quarter].slice();
};

Course.prototype.getSecondarySectionsForQuarter = function(quarter) {
  if (!this.secondaryComponent_) return [];
  return this.secondaryComponent_[quarter].slice();
};

/*
 * Check if there is a secondary component to the class.
 * RETURN-TYPE: boolean
 */
Course.prototype.hasSecondaryComponent = function() {
  return (this.secondaryComponent_ != null);
};

/*
 * Returns the first quarter the course is taught in.
 * RETURN-TYPE: quarter
 */
Course.prototype.firstQuarterOffered = function() {
  if (this.isOfferedIn(0)) return 0;
  if (this.isOfferedIn(1)) return 1;
  return 2;
};

/*
 * Check if the class if offered a certain quarter.
 * PARAM-TYPE: enum quarter What quarter.
 * RETURN-TYPE: boolean
 */
Course.prototype.isOfferedIn = function(quarter) {
  return (this.primaryComponent_[quarter].length != 0);
};

/*
 * Resets the status of the course.
 */
Course.prototype.resetStatus = function() {
  this.status_ = new Status();
};
