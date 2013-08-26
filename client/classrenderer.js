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

  this.sortClassKeys_(classKeys);

  // Count how many conflicts each class has.
  var conflictMatrix = this.buildConflictMatrix_(classKeys, day);

  var previousPositions = new Array();
  var parent = this.calendar_.getContainer();
  for (var i = 0; i < numClasses; i++) {
    var className = this.classes_[classKeys[i]].name_;
    var cliqueSize = ClassRenderer.findLargestCliqueWith(conflictMatrix, i);
    var position = ClassRenderer.calculateNextPosition(conflictMatrix,
                                                       previousPositions,
                                                       cliqueSize);
    this.classes_[classKeys[i]].render(parent,
                                       day,
                                       position.index,
                                       position.total);
    previousPositions.push(position);
  }

};


/*
 * Build a conflict matrix given an array of keys.
 * @param Array keys The keys to the classes in the classes_ object.
 * @param number day The day we're building the conflict matrix for.
 */
ClassRenderer.prototype.buildConflictMatrix_ = function(keys, day) {
  var len = keys.length;
  var conflictMatrix  = new Array(len);
  for (var i = 0; i < len; i++) {
    conflictMatrix[i] = new Array(len);
  }

  for (var i = 0; i < len; i++) {
    for (var j = i; j < len; j++) {
      if (i == j) {
        conflictMatrix[i][j] = false;
      } else {
        if (this.classes_[keys[i]].conflictsWithOnDay(
            this.classes_[keys[j]], day)) {
          conflictMatrix[i][j] = true;
          conflictMatrix[j][i] = true;
        } else {
          conflictMatrix[i][j] = false;
          conflictMatrix[j][i] = false;
        }
      }
    }
  }
  return conflictMatrix;
};


/*
 * Sorts an array of keys of the object containing the classes.
 * Sorts based by start time of the corresponding class, then by length.
 * @param Array keys The keys to be sorted.
 * @param Object classes The object containing the classes.
 */
ClassRenderer.prototype.sortClassKeys_ = function(classKeys) {
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
};


/*
 * Calculates the size of the largest clique containing the given element
 * (given as an index).
 * @param Array.Array matrix Conflict matrix.
 * @param number index The element that must be part of the clique.
 */
ClassRenderer.findLargestCliqueWith = function(matrix, index) {
  var len = matrix.length;
  var conflicts = [];
  for (var i = 0; i < len; i++) {
    if (matrix[index][i]) conflicts.push(i);
  }

  // +1 because the original element which isn't considered in this method.
  return 1 + ClassRenderer.findLargestCliqueAmongst(matrix, [], conflicts);
};


/*
 * This recursive function checks checks if the 'yeses' make a clique when
 * adding and not adding an element from the 'maybes'. The base case is when the
 * 'maybes' is empty. Then we check if all the 'yeses' actually conflict.
 * Otherwise, we'll try adding and not adding a member from the conflicts to the
 * 'yeses', and recurse. We return the max of those two calls and 0. (-1 is
 * returned if the 'yeses' do not all conflict.)
 * @param Array.Array matrix The conflict matrix.
 * @param Array yeses The elements we are saying are in our clique.
 * @param Array maybes The elements we might say are in our clique.
 * @return number The largest clique that has all the yeses and some of the
 *     maybes.
 */
ClassRenderer.findLargestCliqueAmongst = function(matrix, yeses, maybes) {
  if (maybes.length == 0) {
    var len = yeses.length;
    for (var i = 0; i < len; i++) {
      for (var j = i + 1; j < len; j++) {
        if (!matrix[yeses[i]][yeses[j]]) return -1;
      }
    }
    return len;
  } else {
    var next = maybes.pop();
    var withoutNext = this.findLargestCliqueAmongst(matrix, yeses, maybes);
    yeses.push(next);
    var withNext = this.findLargestCliqueAmongst(matrix, yeses, maybes);
    yeses.pop();
    maybes.push(next);
    return Math.max(withoutNext, withNext, 0);
  }
};


/*
 * Considers the previous positions and calculates the first position after the
 * previous one (then looping around to the beginning) where a class of this
 * width can go. Object returned has a 'index' and 'total' field.
 * @param Array.Array matrix The conflict matrix.
 * @param Array positions Old positions.
 * @param number clique Size of the clique this element is a part of.
 * @return Position A new position, where the new object should go, containing a
 *     'index' and 'total' field.
 */
ClassRenderer.calculateNextPosition = function(matrix, positions, clique) {
  var len = positions.length;
  var pos = {'index': 1, 'total': clique}
  if (len == 0) return pos;
  pos.index = ClassRenderer.calculateBucketAfterPosition(positions[len - 1],
                                                         clique);
  for (var i = 0; i < clique; i++) {
    if (ClassRenderer.conflictsWithPreviousPositions(matrix, positions, pos)) {
      pos.index++;
      if (pos.index > clique) pos.index = 1;
    } else {
      return pos;
    }
  }

  window.console.log("Couldn't figure out where " + len + " should go.");
  return ClassRenderer.calculateNextPosition(matrix, positions, clique + 1);
};


/*
 * Find position after takes a position and a clique size and finds the first
 * bucket that can appear to the right of the position. If nothing can appear
 * to the right, then we return 1 (Position indexes are 1 indexed.)
 * @param Position position The position, with 'index' and 'total' properties.
 * @param number clique The bucket size.
 */
ClassRenderer.calculateBucketAfterPosition = function(position, clique) {
  var width = 1 / clique;
  var start = 0;
  var index = 1;
  var prevEnd = position.index / position.total - 0.01; // 0.01 for fudge factor
  // Get the start after the previous position's end
  while (start < prevEnd) {
    start += width;
    index++;
  }
  return (index <= clique) ? index : 1;
};


/*
 * Checks whether placing this element at this position will conflict with any
 * of the previously placed elements.
 * @param Array.Array matrix The conflict matrix.
 * @param Array positions Previous placed elements.
 * @param Position newPos Possible location of new position.
 * @return boolean Whether the position conflicts with any of the previous
 *     positions.
 */
ClassRenderer.conflictsWithPreviousPositions = function(
    matrix, positions, newPos) {
  var len = positions.length;
  var newIndex = len + 1;
  var newStart = (newPos.index - 1) / newPos.total;
  var newEnd = newPos.index / newPos.total;
  for (var i = 0; i < len; i++) {
    if (matrix[i][newIndex]) {
      // Simpler check when the totals are the same to avoid rounding errors
      if (positions[i].total == newPos.total) {
        if (positions[i].index == newPos.index) return true;
      } else {
        var oldStart = (positions[i].index - 1) / positions[i].total;
        var oldEnd = positions[i].index / positions[i].total;
        if (newStart < oldEnd && newEnd > oldStart) return true;
      }
    }
  }
  return false;
};
