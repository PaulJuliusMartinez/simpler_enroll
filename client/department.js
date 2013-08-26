/*
 * This file contains information about all the departments. This is a static
 * class.
 */

var Department = {};

/*
 * Finds the departments this is a valid prefix of. Returns an array of objects
 * with two fields, 'short' and 'long', that are the short and long names of the
 * departments that the string is a valid prefix of.
 * @param string prefix The prefix.
 */
Department.thatStartWith = function(prefix) {
  var re = new RegExp('^' + prefix.toUpperCase() + '.*$');
  var list = [];
  for (var i = 0; i < Department.ALL_.length; i += 2) {
    if (re.test(Department.ALL_[i].toUpperCase()) ||
        re.test(Department.ALL_[i + 1].toUpperCase())) {
      list.push({short: Department.ALL_[i], long: Department.ALL_[i + 1]});
    }
  }
  return list;
};


/*
 * Gets the department with the given name (short or long). Returns an object
 * with 'short' and 'long' fields. Comparison is case insensitive.
 * @param string dep The department name.
 */
Department.getDepartmentNames = function(dep) {
  dep = dep.toUpperCase();
  for (var i = 0; i < Department.ALL_.length; i += 2) {
    if (Department.ALL_[i].toUpperCase() == dep ||
        Department.ALL_[i + 1].toUpperCase() == dep) {
      return {short: Department.ALL_[i], long: Department.ALL_[i + 1]};
    }
  }
  return null;
};


/*
 * ALL THE DEPARTMENT NAMES.
 */
Department.ALL_ = [
    "AA", "Aeronautics & Astronautics",
    "ACCT", "Accounting",
    "AFRICAAM", "African & African American Studies",
    "AFRICAST", "African Studies",
    "AMELANG", "African & Middle Eastern Languages",
    "AMSTUD", "American Studies",
    "ANES", "Anesthesia",
    "ANTHRO", "Anthropology",
    "APPPHYS", "Applied Physics",
    "ARABLANG", "Arabic Language",
    "ARCHLGY", "Archaeology",
    "ARCHLGY", "Archaeology",
    "ARTHIST", "Art History",
    "ARTSTUDI", "Art Studio",
    "ASNAMST", "Asian American Studies",
    "ASNLANG", "Asian Languages",
    "ASTRNMY", "Astronomy",
    "ATHLETIC", "Athletics, Physical Education, Recreation",
    "BIO", "Biology",
    "BIOC", "Biochemistry",
    "BIOE", "Bioengineering",
    "BIOHOPK", "Biology/Hopkins Marine",
    "BIOMEDIN", "Biomedical Informatics",
    "BIOPHYS", "Biophysics",
    "BIOS", "Biosciences Interdisciplinary",
    "CATLANG", "Catalan Language Courses",
    "CBIO", "Cancer Biology",
    "CEE", "Civil & Environmental Engineering",
    "CHEM", "Chemistry",
    "CHEMENG", "Chemical Engineering",
    "CHILATST", "Chicana/o-Latina/o Studies",
    "CHINGEN", "Chinese General",
    "CHINLANG", "Chinese Language",
    "CHINLIT", "Chinese Literature",
    "CLASSART", "Classics Art/Archaeology",
    "CLASSGEN", "Classics General",
    "CLASSGRK", "Classics Greek",
    "CLASSHIS", "Classics History",
    "CLASSLAT", "Classics Latin",
    "CME", "Computational & Mathematical Engineering",
    "COMM", "Communication",
    "COMPLIT", "Comparative Literature",
    "COMPMED", "Comparative Medicine",
    "CS", "Computer Science",
    "CSB", "Chemical & Systems Biology",
    "CSRE", "Comparative Studies in Race & Ethnicity",
    "CTL", "Center for Teaching & Learning",
    "CTS", "Cardiothoracic Surgery",
    "DANCE", "Dance",
    "DBIO", "Developmental Biology",
    "DERM", "Dermatology",
    "DLCL", "Division of Literatures, Cultures, & Languages",
    "EARTHSCI", "Earth Science",
    "EARTHSYS", "Earth Systems",
    "EASTASN", "East Asian Studies",
    "ECON", "Economics",
    "EDUC", "Education",
    "EE", "Electrical Engineering",
    "EEES", "Earth, Energy, & Environmental Sciences",
    "EESS", "Environmental Earth System Science",
    "EFSLANG", "English for Foreign Students",
    "ENERGY", "Energy Resources Engineering",
    "ENGLISH", "English",
    "ENGR", "Engineering",
    "ENVRES", "Environment and Resources",
    "ESF", "Education as Self-Fashioning",
    "ETHICSOC", "Ethics in Society",
    "FAMMED", "Family and Community Medicine",
    "FEMGEN", "Feminist, Gender and Sexuality Studies",
    "FILMPROD", "Film Production",
    "FILMSTUD", "Film Studies",
    "FINANCE", "Finance",
    "FRENCH", "French Studies",
    "FRENLANG", "French Language",
    "GENE", "Genetics",
    "GEOPHYS", "Geophysics",
    "GERLANG", "German Language",
    "GERMAN", "German Studies",
    "GES", "Geological & Environmental Sciences",
    "GSBGEN", "GSB General & Interdisciplinary",
    "HISTORY", "History",
    "HPS", "History & Philosophy of Science",
    "HRMGT", "Human Resource Management",
    "HRP", "Health Research & Policy",
    "HUMBIO", "Human Biology",
    "HUMNTIES", "Interdisciplinary Studies in the Humanities",
    "HUMSCI", "Humanities & Sciences",
    "IBERLANG", "Iberian Languages",
    "IIS", "Institute for International Studies (FSI)",
    "ILAC", "Iberian & Latin American Cultures",
    "ILAC", "Spanish, Portuguese, & Catalan Literature",
    "IMMUNOL", "Immunology",
    "INDE", "Medicine Interdisciplinary",
    "INTNLREL", "International Relations",
    "IPS", "International Policy Studies",
    "ITALIAN", "Italian Studies",
    "ITALIC", "Immersion in the Arts",
    "ITALLANG", "Italian Language",
    "JAPANGEN", "Japanese General",
    "JAPANLIT", "Japanese Literature",
    "JAPANLNG", "Japanese Language",
    "JEWISHST", "Jewish Studies",
    "KORGEN", "Korean General",
    "KORLANG", "Korean Language",
    "KORLIT", "Korean Literature",
    "LATINAM", "Latin American Studies",
    "LAW", "Law",
    "LAWGEN", "Law, Nonprofessional",
    "LINGUIST", "Linguistics",
    "MATH", "Mathematics",
    "MATSCI", "Materials Science & Engineer",
    "MCP", "Molecular & Cellular Physiology",
    "MCS", "Mathematical & Computational Science",
    "ME", "Mechanical Engineering",
    "MED", "Medicine",
    "MEDVLST", "Medieval Studies",
    "MGTECON", "Economic Analysis & Policy",
    "MI", "Microbiology & Immunology",
    "MKTG", "Marketing",
    "MLA", "Master of Liberal Arts",
    "MS&E", "Management Science & Engineering",
    "MTL", "Modern Thought & Literature",
    "MUSIC", "Music",
    "NATIVEAM", "Native American Studies",
    "NBIO", "Neurobiology",
    "NENS", "Neurology & Neurological Sciences",
    "NEPR", "Neurosciences Program",
    "NSUR", "Neurosurgery",
    "OB", "Organizational Behavior",
    "OBGYN", "Obstetrics & Gynecology",
    "OIT", "Operations Information & Technology",
    "OPHT", "Ophthalmology",
    "ORALCOMM", "Oral Communications",
    "ORTHO", "Orthopedic Surgery",
    "OSPAUSTL", "Overseas Studies in Australia",
    "OSPBARCL", "Overseas Studies in Barcelona (CASB)",
    "OSPBEIJ", "Overseas Studies in Beijing",
    "OSPBER", "Overseas Studies in Berlin",
    "OSPCPTWN", "Overseas Studies in Cape Town",
    "OSPFLOR", "Overseas Studies in Florence",
    "OSPGEN", "Overseas Studies General",
    "OSPKYOCT", "Overseas Studies in Kyoto (KCJS)",
    "OSPKYOTO", "Overseas Studies in Kyoto",
    "OSPMADRD", "Overseas Studies in Madrid",
    "OSPMOSC", "Overseas Studies in Moscow",
    "OSPOXFRD", "Overseas Studies in Oxford",
    "OSPPARIS", "Overseas Studies in Paris",
    "OSPSANTG", "Overseas Studies in Santiago",
    "OTOHNS", "Otolaryngology",
    "PATH", "Pathology",
    "PEDS", "Pediatrics",
    "PHIL", "Philosophy",
    "PHYSICS", "Physics",
    "POLECON", "Political Economics",
    "POLISCI", "Political Science",
    "PORTLANG", "Portuguese Language",
    "PSYC", "Psychiatry",
    "PSYCH", "Psychology",
    "PUBLPOL", "Public Policy",
    "PWR", "Writing & Rhetoric, Program in",
    "RAD", "Radiology",
    "RADO", "Radiation Oncology",
    "REES", "Russian, East European, & Eurasian Studies",
    "RELIGST", "Religious Studies",
    "ROTCAF", "ROTC Air Force",
    "ROTCARMY", "ROTC Army",
    "ROTCNAVY", "ROTC Navy",
    "SBIO", "Structural Biology",
    "SCCM", "Scientific Computing & Comput'l Math",
    "SIW", "Stanford in Washington",
    "SLAVIC", "Slavic Studies",
    "SLAVLANG", "Slavic Language",
    "SLE", "Structured Liberal Education",
    "SOC", "Sociology",
    "SOMGEN", "School of Medicine General",
    "SPANLANG", "Spanish Language",
    "SPECLANG", "Special Language Program",
    "STATS", "Statistics",
    "STEMREM", "Stem Cell Biology and Regenerative Medicine",
    "STRAMGT", "Strategic Management",
    "STS", "Science, Technology, & Society",
    "SURG", "Surgery",
    "SYMSYS", "Symbolic Systems",
    "SiMILE", "Science in the Making",
    "TAPS", "Drama",
    "TAPS", "Theater and Performance Studies",
    "THINK", "Thinking Matters",
    "TIBETLNG", "Tibetan Language",
    "UAR", "Undergraduate Advising and Research",
    "URBANST", "Urban Studies",
    "UROL", "Urology"
];
