/*
 * This file implements a publish/subscription model for use throughout the
 * application via jQuery Callbacks.
 * See: http://api.jquery.com/jQuery.Callbacks/
 */

var eventCallbackLists_ = {};

jQuery.Events = function(eventType) {
  assert(eventType);

  if (eventCallbackLists_[eventType]) return eventCallbackLists_[eventType];

  var callbacks = jQuery.Callbacks();
  var list = {
    dispatch: callbacks.fire,
    listen: callbacks.add,
    unlisten: callbacks.remove
  };
  eventCallbackLists_[eventType] = list;
  return list;
};
