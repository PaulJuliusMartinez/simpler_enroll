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
  // Type: string[]
  this.gers_ = obj[CourseConstants.GERS] || [];
  // We have a problem if there's no primary component...
  assert(obj[CourseConstants.PRIMARY_COMPONENT],
      'This course object had no primary component!');
  // Type: Section[][]
  this.primaryComponent_ = Course.convertJSONSectionsToSectionArray(
      obj, CourseConstants.PRIMARY_COMPONENT);
  // Type: Section[][]
  this.secondaryComponent_ = Course.convertJSONSectionsToSectionArray(
      obj, CourseConstants.SECONDARY_COMPONENT);
  // TYPE: number
  this.id_ = UniqueID.newID();
};

/*
 * Takes the list of sections and converts them to Section objects.
 * PARAM-TYPE: Object obj The JSON object.
 * PARAM-TYPE: string key The key of the relevant field.
 * RETURN-TYPE: Section[][]
 */
Course.convertJSONSectionsToSectionArray = function(obj, key) {
  if (!obj[key]) return null;
  var arr = [[], [], []];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < obj[key][i].length; j++) {
      arr[i].push(new Section(this, obj[key][i][j]));
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
Course.prototype.getID = function() { return this.id_; };

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
 * Check if the class if offered a certain quarter.
 * PARAM-TYPE: enum quarter What quarter.
 * RETURN-TYPE: boolean
 */
Course.prototype.isOfferedIn = function(quarter) {
  return (this.primaryComponent_[quarter].length != 0);
};
