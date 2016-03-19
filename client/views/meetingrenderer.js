/*
 * A class for a schedule renderer. Every calendar has its own renderer.
 * This takes a list of Meetings and figures out how they should be arranged.
 */


/*
 * Constructor
 * PARAM-TYPE: Calendar calendar The calendar this is a renderer for.
 */
MeetingRenderer = function(calendar) {
  // TYPE: CalendarView
  this.calendar_ = calendar;
  // TYPE: Meeting[]
  this.meetings_ = [];
  // TYPE: MeetingDisplay[]
  this.boxes_ = [];
};


/*
 * Add a meeting to the list of meetings that should be rendered. Adding
 * duplicates will result in duplicates being rendered.
 * PARAM-TYPE: Meeting meeting Add a meeting to the renderer. The classes will
 * not re-rendered.
 */
MeetingRenderer.prototype.addMeeting = function(meeting) {
  this.meetings_.push(meeting);
};

/*
 * Draws the schedule.
 */
MeetingRenderer.prototype.draw = function() {
  if (false) { //CYCLE_MEETINGS) {
      var days = [false, false, false, false, false];
      for (var i = 0; i < this.meetings_.length; i++) {
          this.meetings_[i].days_ = days.slice();
          this.meetings_[i].days_[i % 5] = true;
      }
  }
  for (var day = 0; day < 5; day++) {
    this.renderOnDay_(day);
  }
};

/*
 * Clears all the old classes.
 */
MeetingRenderer.prototype.clear = function() {
  for (var i = 0; i < this.boxes_.length; i++) {
    this.boxes_[i].remove();
  }
  this.meetings_ = [];
  this.boxes_ = [];
};

/*
 * Renders classes on a specific day.
 * PARAM-TYPE: number day The day of the week (0-4).
 */
MeetingRenderer.prototype.renderOnDay_ = function(day) {
  // Make a temporary array of just the meetings that meet today.
  var today = [];
  for (var i = 0; i < this.meetings_.length; i++) {
    if (this.meetings_[i].meetsOn(day)) today.push(this.meetings_[i]);
  }

  var numMeetings = today.length;
  // Deal with these simple cases.
  if (numMeetings == 0) {
    return;
  }

  // Sort the meetings
  today.sort(Meeting.sort);

  // Count how many conflicts each meeting has.
  var conflictMatrix = Graph.buildConflictMatrix(today, day);

  var previousPositions = new Array();
  var parent = this.calendar_.getContainer();
  for (var i = 0; i < today.length; i++) {
    var cliqueSize = Graph.findLargestCliqueWith(conflictMatrix, i);
    var position = Graph.calculateNextPosition(conflictMatrix,
                                               previousPositions,
                                               cliqueSize);

    var box = new MeetingDisplay(today[i], day, this.calendar_);
    box.render(position.index, position.total);
    this.boxes_.push(box);

    previousPositions.push(position);
  }
};


// Create Graph helper class.
Graph = {};


/*
 * Build a conflict matrix for a list of Meetings.
 * PARAM-TYPE: Meeting[] meetings The list of Meetings.
 * PARAM-TYPE: number day The day we're building the conflict matrix for.
 */
Graph.buildConflictMatrix = function(meetings, day) {
  var len = meetings.length;
  var conflictMatrix  = new Array(len);
  for (var i = 0; i < len; i++) {
    conflictMatrix[i] = new Array(len);
  }

  for (var i = 0; i < len; i++) {
    for (var j = i; j < len; j++) {
      if (i == j) {
        conflictMatrix[i][j] = false;
      } else {
        if (meetings[i].conflictsWith(meetings[j])) {
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
 * Calculates the size of the largest clique containing the given element
 * (given as an index).
 * PARAM-TYPE: number[][] matrix Conflict matrix.
 * PARAM-TYPE: number index The element that must be part of the clique.
 */
Graph.findLargestCliqueWith = function(matrix, index) {
  var len = matrix.length;
  var conflicts = [];
  for (var i = 0; i < len; i++) {
    if (matrix[index][i]) conflicts.push(i);
  }

  // +1 because the original element which isn't considered in this method.
  return 1 + Graph.findLargestCliqueAmongst(matrix, [], conflicts);
};

/*
 * This recursive function checks checks if the 'yeses' make a clique when
 * adding and not adding an element from the 'maybes'. The base case is when the
 * 'maybes' is empty. Then we check if all the 'yeses' actually conflict.
 * Otherwise, we'll try adding and not adding a member from the conflicts to the
 * 'yeses', and recurse. We return the max of those two calls and 0. (-1 is
 * returned if the 'yeses' do not all conflict.)
 * PARAM-TYPE: Array.Array matrix The conflict matrix.
 * PARAM-TYPE: Array yeses The elements we are saying are in our clique.
 * PARAM-TYPE: Array maybes The elements we might say are in our clique.
 * @return number The largest clique that has all the yeses and some of the
 *     maybes.
 */
Graph.findLargestCliqueAmongst = function(matrix, yeses, maybes) {
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
 * PARAM-TYPE: number[][] matrix The conflict matrix.
 * PARAM-TYPE: Position[] positions Old positions.
 * PARAM-TYPE: number clique Size of the clique this element is a part of.
 * RETURN-TYPE: Position A new position, where the new object should go,
 *     containing a 'index' and 'total' field.
 */
Graph.calculateNextPosition = function(matrix, positions, clique) {
  var len = positions.length;
  var pos = {'index': 1, 'total': clique}
  if (len == 0) return pos;
  pos.index = Graph.calculateBucketAfterPosition(positions[len - 1], clique);
  for (var i = 0; i < clique; i++) {
    if (Graph.conflictsWithPreviousPositions(matrix, positions, pos)) {
      pos.index++;
      if (pos.index > clique) pos.index = 1;
    } else {
      return pos;
    }
  }

  window.console.log("Couldn't figure out where " + len + " should go.");
  return Graph.calculateNextPosition(matrix, positions, clique + 1);
};

/*
 * Find position after takes a position and a clique size and finds the first
 * bucket that can appear to the right of the position. If nothing can appear
 * to the right, then we return 1 (Position indexes are 1 indexed.)
 * PARAM-TYPE: Position position The position, with 'index' and 'total'
 *     properties.
 * PARAM-TYPE: number clique The bucket size.
 */
Graph.calculateBucketAfterPosition = function(position, clique) {
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
 * PARAM-TYPE: Array.Array matrix The conflict matrix.
 * PARAM-TYPE: Array positions Previous placed elements.
 * PARAM-TYPE: Position newPos Possible location of new position.
 * RETURN-TYPE: boolean Whether the position conflicts with any of the previous
 *     positions.
 */
Graph.conflictsWithPreviousPositions = function(matrix, positions, newPos) {
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
