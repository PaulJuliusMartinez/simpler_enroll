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
Events.COURSE_REMOVED = 'course-removed';
Events.COURSE_CHANGE = 'course-change';
Events.COURSE_SELECTED  = 'course-selected';
Events.SECTION_ACCENT_PREFIX = 'section-accent-';
Events.SECTION_UNACCENT_PREFIX = 'section-unaccent-';
