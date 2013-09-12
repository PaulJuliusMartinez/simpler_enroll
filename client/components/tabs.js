/*
 * This file implements a UI component that allows for a tabbale interface.
 */

/*
 * Constructor takes... nothing.
 */
Tabs = function() {
  // TYPE: jQuery The tab row
  this.tabContainer_ = null;
  // TYPE: Array[jQuery] The tab elements
  this.tabs_ = [];
  // TYPE: jQuery The tab bodies row
  this.tabBodiesContainer_ = null;
  // TYPE: Array[jQuery] The tab bodies
  this.tabBodies_ = [];
};


/*
 * Builds the tab DOM.
 * PARAM-TYPE: jQuery The parent element of the tabbed area.
 */
Tabs.prototype.render = function(parent) {
  var tabTable = $('<table>').addClass(Tabs.TABLE).attr('cellspacing', 0).
                                                   attr('cellpadding', 0);
  this.tabContainer_ = $('<tr>');
  tabTable.append(this.tabContainer_);

  this.tabBodiesContainer_ = $('<div>').addClass(Tabs.BODY);
  var container = $('<div>').addClass(Tabs.CONTAINER);
  container.append(tabTable, this.tabBodiesContainer_);
  parent.append(container);
};

/*
 * Adds a tab and returns the body element for decoration.
 * PARAM-TYPE: string tabName The name of the tab
 * RETURN-TYPE: jQuery
 */
Tabs.prototype.addTab = function(tabName) {
  var numTab = this.tabs_.length;
  var tabs = this;
  // Make tab
  var tab = $('<th>').addClass(Tabs.TAB).text(tabName);
  this.tabContainer_.append(tab);
  this.tabs_.push(tab);
  tab.click(function() {
    tabs.displayTab(numTab);
  });
  // Make tab body
  var tabBody = $('<div>').addClass(Tabs.NOT_DISPLAYED);
  this.tabBodiesContainer_.append(tabBody);
  this.tabBodies_.push(tabBody);
  // Display recently added tab
  this.displayTab(numTab);
  // Return body for decoration
  return tabBody;
};

/*
 * Sets a current tab to be selected.
 * PARAM-TYPE: number index The number of the tab.
 */
Tabs.prototype.displayTab = function(index) {
  var numTabs = this.tabs_.length;
  for (var i = 0; i < numTabs; i++) {
    this.tabs_[i].removeClass(Tabs.SELECTED);
    this.tabBodies_[i].removeClass(Tabs.DISPLAYED);
    this.tabBodies_[i].addClass(Tabs.NOT_DISPLAYED);
  }
  this.tabs_[index].addClass(Tabs.SELECTED);
  this.tabBodies_[index].removeClass(Tabs.NOT_DISPLAYED);
  this.tabBodies_[index].addClass(Tabs.DISPLAYED);
};


// CSS STYLES
Tabs.CONTAINER = 'tabs-container';

Tabs.TABLE = 'tabs-table';
Tabs.TAB = 'tabs-tab';
Tabs.SELECTED = 'tabs-selected';

Tabs.BODY = 'tabs-body';
Tabs.BODY_ROW = 'tabs-body-row';
Tabs.NOT_DISPLAYED = 'tabs-not-displayed';
Tabs.DISPLAYED = 'tabs-displayed';
