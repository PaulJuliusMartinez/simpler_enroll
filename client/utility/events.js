/*
 * This file implements a publish/subscription model for use throughout the
 * application via jQuery Callbacks.
 * See: http://api.jquery.com/jQuery.Callbacks/
 */

Events = {};
Events.eventCallbackLists_ = {};

$.Events = function(eventType) {
  assert(eventType);

  if (Events.eventCallbackLists_[eventType]) {
    return Events.eventCallbackLists_[eventType];
  }

  var callbacks = $.Callbacks();
  var list = {
    dispatch: callbacks.fire,
    listen: callbacks.add,
    unlisten: callbacks.remove
  };
  Events.eventCallbackLists_[eventType] = list;
  return list;
};

Events.COURSE_ADDED = 'course-added';
