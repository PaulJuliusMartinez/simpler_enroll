/*
 * This is the file that outlines the structure of the Course class and its
 * underlying Section and Meeting classes. Every Course object will be
 * instantiated from a string of JSON with the following key names.
 * Constructing a Course object primarily consists of copying the values from
 * the JSON object into this object, which will help provide a dedicated API for
 * dealing with courses.
 *
 * The type annotations indicated the type of the corresponding value in the
 * JSON object.
 */

CourseConstants = {};

/*
 * The name of the department the course is in.
 * TYPE: string
 */
CourseConstants.DEPARTMENT = 'department';

/*
 * The 'number' of the course. Actually a string because some classes have
 * letters in their names, like "106A".
 * TYPE: string
 */
CourseConstants.NUMBER = 'number';

/*
 * The title of the class.
 * TYPE: string
 */
CourseConstants.TITLE = 'title';

/*
 * The description for the class on ExploreCourses. May not be included due
 * to added size.
 * TYPE: string
 */
CourseConstants.DESCRIPTION = 'description';

/*
 * The minimum and maximum number of units you can take a class for. Large
 * irrelevant to undergrads, so may be used.
 * TYPE: number
 */
CourseConstants.MIN_UNITS = 'min_units';
CourseConstants.MAX_UNITS = 'max_units';

/*
 * The GERs satisfied by the class.
 * TYPE: string[]
 */
CourseConstants.GERS = 'gers';

/*
 * ID of the class
 * TYPE: number
 */
CourseConstants.COURSE_ID = 'id';

/*
 * Some classes have two components, a primary one, usually a lecture, and a
 * secondary one, such as a discussion section, or a lab. When these separate
 * components meet is split up within the Course object.
 * The type is an array of array of sections. The first array is to hold the
 * sections for Autumn/Winter/Spring and the second is for the sections within
 * that quarter.
 * TYPE: Section[][]
 */
CourseConstants.PRIMARY_COMPONENT = 'primary';
CourseConstants.SECONDARY_COMPONENT = 'secondary';

/*
 * The types of the two components
 * TYPE: string
 */
CourseConstants.PRIMARY_TYPE = 'primary_type';
CourseConstants.SECONDARY_TYPE = 'secondary_type';

/*
 * Constants for the different quarters.
 * TYPE: enum
 */
CourseConstants.AUTUMN = 0;
CourseConstants.WINTER = 1;
CourseConstants.SPRING = 2;

    // These are now properties that will contained in the Section class.

    /*
     * ID of the section
     * TYPE: number
     */
    CourseConstants.SECTION_ID = 'id';

    /*
     * List of instructors.
     * TYPE: string[]
     */
    CourseConstants.INSTRUCTORS = 'instructors';

    /*
     * List of meeting times.
     * TYPE: Meeting[]
     */
    CourseConstants.MEETINGS = 'meeting-times';

        // These are properties of a meeting time.

        /*
         * Which days of the week, Monday through Friday, a section meets.
         * TYPE: boolean[]
         */
        CourseConstants.DAYS = 'days';

        /*
         * Start and end time, in minutes from midnight.
         * TYPE: number
         */
        CourseConstants.START_TIME = 'start';
        CourseConstants.END_TIME = 'end';
