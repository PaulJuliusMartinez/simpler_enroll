Smart Scheduler
==============

This is a webapp designed to make it easier to plan out a schedule at Stanford
University. It was initially developed by me, Paul Martinez, during late August
- early September 2013.


Running Locally
---------------

If you would like to contribute, here the necessary steps for running everything
locally.

1. The .js files containing the course data for each department are fetched and
   created using the ExploreCourses API. This consists of two .jar files:

   jdom-2.0.1.jar
   explorecourses.jar

   These can be downloaded [here](http://www.examplesample.com/java/fetch-stanford-courses-from-explore-courses).

2. To actually fetch the courses, navigate the the `/databackend/` directory and
   run the shell script `refetchcourses.sh`. This compiles FetchCourses.java and
   executes it. The resulting files are save in `/client/models/data/*`. The
   script first deletes all the files in `/client/models/data/`, so the first
   time you run this the script may warn that no files were deleted.

   The actual FetchCourses program may print stuff out. The ExploreCourses
   database seems to be in flux and so messages may be printed out occasionally
   indicating that some data is or is not available.

3. Once all the course data has been fetched, navigate to the root directory and
   run a local webserver. Personally I have been using:

   ```
   python -m SimpleHTTPServer
   ```

   Then navigate to `localhost:8000/simpler_enroll.html`.


Contributing
------------

If you would like to contribute, here are some general style guidelines:

- 2 space tabs
- Keep `js` files to 80 columns (and the one `java` file to 100 columns). I
  think I'm inconsistent with super long function calls, but generally indent 4
  spaces or align after the open parentheses. So:
  ```
  thisIsAReallyLongFunctionCallAndItHasLotsOfParameters(
      firstArgument, thenTheSecondArgument);
  ```
  Or:
  ```
  thisIsAReallyLongFunctionCall(firstArgument,
                                thenTheSecondArgument);
  ```
  The second is preferred when chaining multiple jQuery functions together.
- Capitalization and naming:
  + variablesLikeThis
  + functionsLikeThis
  + ClassesLikeThis
  + CONSTANTS_LIKE_THIS
  + css_constants_like_this
- I put type declarations for all parameters, return values and instance
  variables. The notation used for these are:
  + `PARAM-TYPE: `
  + `RETURN-TYPE: `
  + `TYPE: `

That should about cover it...


Current Issues
--------------

Some issues users have noticed.

- Random classes are missing. Ex., English 91. I don't know why this is.
  Currently in FetchCourses.java I have some checks to make sure that I don't
  load some 'bad' classes. I consider bad classes as ones that don't actually
  have set class times, so this kicks out a lot of Senior Project classes that
  the rendering program wouldn't know how to handle.
- The interface completely fails on Safari, Chrome on Linux and mobile. I'm not
  a CSS expert and I don't really know what's going on. The interface also looks
  pretty bad on FireFox. FireFox seems to always render scrollbars, which is
  annoying, and it also doesn't allow styling on checkboxes.


Future Features
---------------

Currently everything is written in homegrown Javascript, and it's a pretty big
mess. It would be great to rewrite using an actual framework, but that would
require, naturally, a rewrite.

As far as actual features, I like to:

- Allow fuzzy searching, maybe by keyword or class name, or perhaps create a
  more advanced search with capabilities to search by time or GERs satisfied.
  The way course data is handled is currently very optimized around the
  'Department+Number' format. Adding different search capabilities would require
  a major reconstruction of the 'backend' part of the application.
- Provide more general information about classes, like the box on Simple Enroll
  or the blurb in Explore Courses. This could occupy a tab in the top right.
- Have a way for adding custom classes. These could be used for outside activities,
  classes that for whatever reason aren't showing up, or sections for classes
  that aren't in the database.
- Provide a system that will 'solve' a schedule. Basically it would take all the
  courses in the course list and figure out how to take as many of them as
  possible. This could probably be implemented by a simple depth first search.
  Ideally the course list on the left would be sortable (there's a call to
  jQueryUI.sortable, but it causes all the style to get screwed up) and it would
  assign the highest priority to the classes at the top of the list. Doing a
  depth first search would naturally produce results that have more of the first
  few classes. I think it would make sense to return multiple schedules that the
  user would be able to flip through.
- In addition to the previously system, allow constraints to be placed on the
  generated schedules, such as min/max units per quarter, no classes before 10AM
  or after 5PM, etc.

I imagine these features occupying their own tabs in the top right. (The
'Sections' display is current the only tab. It is relatively trivial to add more
tabs.)
