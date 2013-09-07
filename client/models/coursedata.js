/*
 * Utility class with methods designed for interacting with all the
 * coarse-grained course data, i.e., dealing with all the courses for a
 * department.
 */


CourseData = {};

/*
 * Initialization of the course data. (This prevents errors caused by the order
 * that we add the files at the expense of having to explicitly initialize the
 * object.)
 */
CourseData.init = function() {
  this.cache_ = new CourseDataCache();
};


/*
 * Fetch all the departments that start with a certain prefix,
 * then dispatch a DEPARTMENTS_BY_PREFIX event.
 * PARAM-TYPE: string depPrefix The prefix of the department.
 * DISPATCH-EVENT: DEPARTMENTS_BY_PREFIX
 */
CourseData.fetchDepartmentsByPrefix = function(depPrefix) {
  var re = new RegExp('^' + depPrefix.toUpperCase() + '.*$');
  var list = [];
  for (var i = 0; i < this.DEPARTMENTS.length; i++) {
    if (re.test(this.DEPARTMENTS[i].short.toUpperCase()) ||
        re.test(this.DEPARTMENTS[i].long.toUpperCase())) {
      list.push(this.DEPARTMENTS[i]);
    }
  }
  $.Events(Events.DEPARTMENTS_BY_PREFIX).dispatch(depPrefix, list);
};

/*
 * Given a department and a string, returns the courses that have the string as
 * a prefix in that particular department.
 * PARAM-TYPE: string dep The department.
 * PARAM-TYPE: string numPrefix The prefix.
 * DISPATCH-EVENT: COURSES_BY_PREFIX
 */
CourseData.fetchCoursesByPrefix = function(dep, numPrefix) {
  var courses = this.cache_.getCourses(dep);
  if (!courses) return [];
  var allCoursesInDep = courses[CourseDataCache.SORTED_COURSE_LIST];
  if (!allCoursesInDep) return [];
  var re = new RegExp('^' + numPrefix);
  var results = [];
  for (var i = 0; i < allCoursesInDep.length; i++) {
    var name = allCoursesInDep[i];
    if (re.test(name)) {
      results.push(courses[CourseDataCache.COURSE_DATA][name]);
    }
  }

  $.Events(Events.COURSES_BY_PREFIX).dispatch(dep, numPrefix, results);
};

/*
 * Returns a course given the department and course number.
 * PARAM-TYPE: string dep The department.
 * PARAM-TYPE: string number The course number.
 * RETURN-TYPE: Course
 */
CourseData.getCourse = function(dep, number) {
  var courses = this.cache_.getCourses(dep);
  if (!courses) return "";
  var course = courses[CourseDataCache.COURSE_DATA][number];
  return course;
};

CourseData.COURSE_REGEX_ = /^(\D+)(\d*.*)$/;
CourseData.REGEXP = new RegExp(CourseData.COURSE_REGEX_);

/*
 * ALL THE DEPARTMENT NAMES.
 */
CourseData.DEPARTMENTS = [
  {short: "AA", long: "Aeronautics & Astronautics"},
  {short: "ACCT", long: "Accounting"},
  {short: "AFRICAAM", long: "African & African American Studies"},
  {short: "AFRICAST", long: "African Studies"},
  {short: "AMELANG", long: "African & Middle Eastern Languages"},
  {short: "AMSTUD", long: "American Studies"},
  {short: "ANES", long: "Anesthesia"},
  {short: "ANTHRO", long: "Anthropology"},
  {short: "APPPHYS", long: "Applied Physics"},
  {short: "ARABLANG", long: "Arabic Language"},
  {short: "ARCHLGY", long: "Archaeology"},
  {short: "ARCHLGY", long: "Archaeology"},
  {short: "ARTHIST", long: "Art History"},
  {short: "ARTSTUDI", long: "Art Studio"},
  {short: "ASNAMST", long: "Asian American Studies"},
  {short: "ASNLANG", long: "Asian Languages"},
  {short: "ASTRNMY", long: "Astronomy"},
  {short: "ATHLETIC", long: "Athletics, Physical Education, Recreation"},
  {short: "BIO", long: "Biology"},
  {short: "BIOC", long: "Biochemistry"},
  {short: "BIOE", long: "Bioengineering"},
  {short: "BIOHOPK", long: "Biology/Hopkins Marine"},
  {short: "BIOMEDIN", long: "Biomedical Informatics"},
  {short: "BIOPHYS", long: "Biophysics"},
  {short: "BIOS", long: "Biosciences Interdisciplinary"},
  {short: "CATLANG", long: "Catalan Language Courses"},
  {short: "CBIO", long: "Cancer Biology"},
  {short: "CEE", long: "Civil & Environmental Engineering"},
  {short: "CHEM", long: "Chemistry"},
  {short: "CHEMENG", long: "Chemical Engineering"},
  {short: "CHILATST", long: "Chicana/o-Latina/o Studies"},
  {short: "CHINGEN", long: "Chinese General"},
  {short: "CHINLANG", long: "Chinese Language"},
  {short: "CHINLIT", long: "Chinese Literature"},
  {short: "CLASSART", long: "Classics Art/Archaeology"},
  {short: "CLASSGEN", long: "Classics General"},
  {short: "CLASSGRK", long: "Classics Greek"},
  {short: "CLASSHIS", long: "Classics History"},
  {short: "CLASSLAT", long: "Classics Latin"},
  {short: "CME", long: "Computational & Mathematical Engineering"},
  {short: "COMM", long: "Communication"},
  {short: "COMPLIT", long: "Comparative Literature"},
  {short: "COMPMED", long: "Comparative Medicine"},
  {short: "CS", long: "Computer Science"},
  {short: "CSB", long: "Chemical & Systems Biology"},
  {short: "CSRE", long: "Comparative Studies in Race & Ethnicity"},
  {short: "CTL", long: "Center for Teaching & Learning"},
  {short: "CTS", long: "Cardiothoracic Surgery"},
  {short: "DANCE", long: "Dance"},
  {short: "DBIO", long: "Developmental Biology"},
  {short: "DERM", long: "Dermatology"},
  {short: "DLCL", long: "Division of Literatures, Cultures, & Languages"},
  {short: "EARTHSCI", long: "Earth Science"},
  {short: "EARTHSYS", long: "Earth Systems"},
  {short: "EASTASN", long: "East Asian Studies"},
  {short: "ECON", long: "Economics"},
  {short: "EDUC", long: "Education"},
  {short: "EE", long: "Electrical Engineering"},
  {short: "EEES", long: "Earth, Energy, & Environmental Sciences"},
  {short: "EESS", long: "Environmental Earth System Science"},
  {short: "EFSLANG", long: "English for Foreign Students"},
  {short: "ENERGY", long: "Energy Resources Engineering"},
  {short: "ENGLISH", long: "English"},
  {short: "ENGR", long: "Engineering"},
  {short: "ENVRES", long: "Environment and Resources"},
  {short: "ESF", long: "Education as Self-Fashioning"},
  {short: "ETHICSOC", long: "Ethics in Society"},
  {short: "FAMMED", long: "Family and Community Medicine"},
  {short: "FEMGEN", long: "Feminist, Gender and Sexuality Studies"},
  {short: "FILMPROD", long: "Film Production"},
  {short: "FILMSTUD", long: "Film Studies"},
  {short: "FINANCE", long: "Finance"},
  {short: "FRENCH", long: "French Studies"},
  {short: "FRENLANG", long: "French Language"},
  {short: "GENE", long: "Genetics"},
  {short: "GEOPHYS", long: "Geophysics"},
  {short: "GERLANG", long: "German Language"},
  {short: "GERMAN", long: "German Studies"},
  {short: "GES", long: "Geological & Environmental Sciences"},
  {short: "GSBGEN", long: "GSB General & Interdisciplinary"},
  {short: "HISTORY", long: "History"},
  {short: "HPS", long: "History & Philosophy of Science"},
  {short: "HRMGT", long: "Human Resource Management"},
  {short: "HRP", long: "Health Research & Policy"},
  {short: "HUMBIO", long: "Human Biology"},
  {short: "HUMNTIES", long: "Interdisciplinary Studies in the Humanities"},
  {short: "HUMSCI", long: "Humanities & Sciences"},
  {short: "IBERLANG", long: "Iberian Languages"},
  {short: "IIS", long: "Institute for International Studies (FSI)"},
  {short: "ILAC", long: "Iberian & Latin American Cultures"},
  {short: "ILAC", long: "Spanish, Portuguese, & Catalan Literature"},
  {short: "IMMUNOL", long: "Immunology"},
  {short: "INDE", long: "Medicine Interdisciplinary"},
  {short: "INTNLREL", long: "International Relations"},
  {short: "IPS", long: "International Policy Studies"},
  {short: "ITALIAN", long: "Italian Studies"},
  {short: "ITALIC", long: "Immersion in the Arts"},
  {short: "ITALLANG", long: "Italian Language"},
  {short: "JAPANGEN", long: "Japanese General"},
  {short: "JAPANLIT", long: "Japanese Literature"},
  {short: "JAPANLNG", long: "Japanese Language"},
  {short: "JEWISHST", long: "Jewish Studies"},
  {short: "KORGEN", long: "Korean General"},
  {short: "KORLANG", long: "Korean Language"},
  {short: "KORLIT", long: "Korean Literature"},
  {short: "LATINAM", long: "Latin American Studies"},
  {short: "LAW", long: "Law"},
  {short: "LAWGEN", long: "Law, Nonprofessional"},
  {short: "LINGUIST", long: "Linguistics"},
  {short: "MATH", long: "Mathematics"},
  {short: "MATSCI", long: "Materials Science & Engineer"},
  {short: "MCP", long: "Molecular & Cellular Physiology"},
  {short: "MCS", long: "Mathematical & Computational Science"},
  {short: "ME", long: "Mechanical Engineering"},
  {short: "MED", long: "Medicine"},
  {short: "MEDVLST", long: "Medieval Studies"},
  {short: "MGTECON", long: "Economic Analysis & Policy"},
  {short: "MI", long: "Microbiology & Immunology"},
  {short: "MKTG", long: "Marketing"},
  {short: "MLA", long: "Master of Liberal Arts"},
  {short: "MS&E", long: "Management Science & Engineering"},
  {short: "MTL", long: "Modern Thought & Literature"},
  {short: "MUSIC", long: "Music"},
  {short: "NATIVEAM", long: "Native American Studies"},
  {short: "NBIO", long: "Neurobiology"},
  {short: "NENS", long: "Neurology & Neurological Sciences"},
  {short: "NEPR", long: "Neurosciences Program"},
  {short: "NSUR", long: "Neurosurgery"},
  {short: "OB", long: "Organizational Behavior"},
  {short: "OBGYN", long: "Obstetrics & Gynecology"},
  {short: "OIT", long: "Operations Information & Technology"},
  {short: "OPHT", long: "Ophthalmology"},
  {short: "ORALCOMM", long: "Oral Communications"},
  {short: "ORTHO", long: "Orthopedic Surgery"},
  {short: "OSPAUSTL", long: "Overseas Studies in Australia"},
  {short: "OSPBARCL", long: "Overseas Studies in Barcelona (CASB)"},
  {short: "OSPBEIJ", long: "Overseas Studies in Beijing"},
  {short: "OSPBER", long: "Overseas Studies in Berlin"},
  {short: "OSPCPTWN", long: "Overseas Studies in Cape Town"},
  {short: "OSPFLOR", long: "Overseas Studies in Florence"},
  {short: "OSPGEN", long: "Overseas Studies General"},
  {short: "OSPKYOCT", long: "Overseas Studies in Kyoto (KCJS)"},
  {short: "OSPKYOTO", long: "Overseas Studies in Kyoto"},
  {short: "OSPMADRD", long: "Overseas Studies in Madrid"},
  {short: "OSPMOSC", long: "Overseas Studies in Moscow"},
  {short: "OSPOXFRD", long: "Overseas Studies in Oxford"},
  {short: "OSPPARIS", long: "Overseas Studies in Paris"},
  {short: "OSPSANTG", long: "Overseas Studies in Santiago"},
  {short: "OTOHNS", long: "Otolaryngology"},
  {short: "PATH", long: "Pathology"},
  {short: "PEDS", long: "Pediatrics"},
  {short: "PHIL", long: "Philosophy"},
  {short: "PHYSICS", long: "Physics"},
  {short: "POLECON", long: "Political Economics"},
  {short: "POLISCI", long: "Political Science"},
  {short: "PORTLANG", long: "Portuguese Language"},
  {short: "PSYC", long: "Psychiatry"},
  {short: "PSYCH", long: "Psychology"},
  {short: "PUBLPOL", long: "Public Policy"},
  {short: "PWR", long: "Writing & Rhetoric, Program in"},
  {short: "RAD", long: "Radiology"},
  {short: "RADO", long: "Radiation Oncology"},
  {short: "REES", long: "Russian, East European, & Eurasian Studies"},
  {short: "RELIGST", long: "Religious Studies"},
  {short: "ROTCAF", long: "ROTC Air Force"},
  {short: "ROTCARMY", long: "ROTC Army"},
  {short: "ROTCNAVY", long: "ROTC Navy"},
  {short: "SBIO", long: "Structural Biology"},
  {short: "SCCM", long: "Scientific Computing & Comput'l Math"},
  {short: "SIW", long: "Stanford in Washington"},
  {short: "SLAVIC", long: "Slavic Studies"},
  {short: "SLAVLANG", long: "Slavic Language"},
  {short: "SLE", long: "Structured Liberal Education"},
  {short: "SOC", long: "Sociology"},
  {short: "SOMGEN", long: "School of Medicine General"},
  {short: "SPANLANG", long: "Spanish Language"},
  {short: "SPECLANG", long: "Special Language Program"},
  {short: "STATS", long: "Statistics"},
  {short: "STEMREM", long: "Stem Cell Biology and Regenerative Medicine"},
  {short: "STRAMGT", long: "Strategic Management"},
  {short: "STS", long: "Science, Technology, & Society"},
  {short: "SURG", long: "Surgery"},
  {short: "SYMSYS", long: "Symbolic Systems"},
  {short: "SiMILE", long: "Science in the Making"},
  {short: "TAPS", long: "Drama"},
  {short: "TAPS", long: "Theater and Performance Studies"},
  {short: "THINK", long: "Thinking Matters"},
  {short: "TIBETLNG", long: "Tibetan Language"},
  {short: "UAR", long: "Undergraduate Advising and Research"},
  {short: "URBANST", long: "Urban Studies"},
  {short: "UROL", long: "Urology"}
];
