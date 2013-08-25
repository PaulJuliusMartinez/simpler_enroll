/*
 * A class for a class renderer. Every calendar has its own class renderer.
 * This takes a list of classes and figures out how they should be arranged.
 */

/*
 * Constructor
 * @param Calendar calendar The calendar this is a renderer for.
 */
ClassRenderer = function(calendar) {
  this.calendar_ = calendar;
  this.classes_ = {};
};

/*
 * @param Class Add a class to the renderer. The calendar will be re-rendered.
 */
ClassRenderer.prototype.addClass = function(newClass) {
  this.classes_[newClass.getUniqueID()] = newClass;
  this.render_();
};

/*
 * @param Class Remove class from renderer. The calendar will be re-rendered.
 */
ClassRenderer.prototype.removeClass = function(deleteClass) {
  delete this.classes_[deleteClass.getUniqueID()];
  this.render_();
};

/*
 * Renders the schedule.
 */
ClassRenderer.prototype.render_ = function() {
  this.unrender_();
  for (var day = 0; day < 5; day++) {
    this.renderOnDay_(day);
  }
};

/*
 * Unrender all the classes;
 */
ClassRenderer.prototype.unrender_ = function() {
  for (key in this.classes_) {
    this.classes_[key].unrender();
  }
};

/*
 * Renders classes on a specific day.
 */
ClassRenderer.prototype.renderOnDay_ = function(day) {
  // Get the keys for the relevant classes.
  var classKeys = [];
  for (key in this.classes_) {
    if (this.classes_[key].meetsOn(day)) classKeys.push(key);
  }

  var numClasses = classKeys.length;
  // Deal with these simple cases.
  if (numClasses == 0) {
    return;
  } else if (numClasses == 1) {
    this.classes_[classKeys[0]].render(this.calendar_.getContainer(), day);
    return;
  }
  // Sort classes by start time. I think this should make things easier.
  var classes = this.classes_;
  var sortFn = function(keyA, keyB) {
    var classA = classes[keyA];
    var classB = classes[keyB];
    if (classA.getStartTime() < classB.getStartTime()) return -1;
    if (classA.getStartTime() > classB.getStartTime()) return 1;
    if (classA.getEndTime() < classB.getEndTime()) return -1;
    if (classA.getEndTime() > classB.getEndTime()) return 1;
    return 0;
  };

  classKeys.sort(sortFn);

  // Count how many conflicts each class has.
  var numConflicts = new Array(numClasses);
  for (var i = 0; i < numClasses; i++) numConflicts[i] = 0;
  for (var i = 0; i < numClasses; i++) {
    for (var j = i + 1; j < numClasses; j++) {
      if (this.classes_[classKeys[i]].conflictsWithOnDay(
          this.classes_[classKeys[j]], day)) {
        numConflicts[i]++;
        numConflicts[j]++;
      }
    }
  }

  var currentNum = 1;
  var total = numConflicts[0] + 1;
  var parent = this.calendar_.getContainer();
  for (var i = 0; i < numClasses; i++) {
    if (numConflicts[i] == 0) {
      this.classes_[classKeys[i]].render(parent, day);
      currentNum = 1;
      total = 0; // Just trigger the recalculation.
    } else {
      if (currentNum > total) {
        currentNum = 1;
      }
      this.classes_[classKeys[i]].render(parent, day, currentNum, total);
      currentNum++;
    }
  }

};
