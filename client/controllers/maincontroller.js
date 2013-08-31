/*
 * This is the MainController that is in charge of the entire application and
 * ensuring communciation between all the components.
 */

MainController = function(parent) {
  this.view_ = new MainView(parent);
  this.view_.render();
};
