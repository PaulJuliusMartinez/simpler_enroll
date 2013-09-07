Smart Scheduler
==============

A program designed to help Stanford Students plan out their classes for the
year.


TODOs:
X Make class autocompletion asynchronous
X Update Units labels
- Refactor to use a publisher/subscribe model, to be able to do things like:
  - highlight classes when you hover over them in the course list
  - easier propagation of adding a course

More Features:
- Add panel in right side for small tweaks. Current idea:
  - Tabbed interface for:
    - Handling of multiple lectures and discussions
    - Handling additional restrictions on the schedule (min/max units, no class
      before 10, etc.)
    - Initiating the schedule creation and viewing multiple different options.
- Cookies for saving user state
