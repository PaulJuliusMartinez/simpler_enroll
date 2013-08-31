/*
 * This is the MainController that is in charge of the entire application and
 * ensuring communciation between all the components.
 */

/*
 * Constructor takes the main element of the page.
 * PARAM-TYPE: jQuery parent The parent element for the MainView.
 */
MainController = function(parent) {
  this.view_ = new MainView(parent);
  this.view_.render();

  var containers = this.view_.getContainers();
  this.searcBox_ = new SearchBoxController(containers[MainView.SEARCH_BOX]);
};
