import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.jdom2.Document;
import org.jdom2.JDOMException;

import edu.stanford.services.explorecourses.Course;
import edu.stanford.services.explorecourses.Department;
import edu.stanford.services.explorecourses.MeetingSchedule;
import edu.stanford.services.explorecourses.School;
import edu.stanford.services.explorecourses.Section;
import edu.stanford.services.explorecourses.ExploreCoursesConnection;

/** Prints a list of all courses offered at Stanford in the current academic year **/
public class FetchClasses {
	public static void main(String[] args) throws IOException, JDOMException {
		init();
		ExploreCoursesConnection connection = new ExploreCoursesConnection();
//		FileInputStream fr = new FileInputStream("database.xml");
//		Document d = connection.toXmlDocument(fr);
//		fr.close();
		
		for(School s : connection.getSchools()) {
			for(Department d : s.getDepartments()) {
				//if (!departments.contains(d.getCode())) continue;
        if (d.getCode().equals("ENVRINST")) continue; // This one breaks things.
				writeDepartmentClassesToFile(d, connection);
			}
		}
	}
	
	private static void init() {
		List<String> s = permissibleClassComponents;
		s.add("LEC"); // Lecture
		s.add("SEM"); // Seminar
		s.add("DIS"); // Discussion
		s.add("LAB"); // Lab
		s.add("LBS"); // Lab Section
		s.add("ACT"); // Activity
		s.add("IDS"); // Intro Dial, Sophmore?
		s.add("ISF"); // Introsem, Freshman
		s.add("ISS"); // Introsem, Sophormore
		s.add("LNG"); // Language
		s.add("PRA"); // Practicum
		s.add("PRC"); // Practicum
		
		try {
			BufferedReader rd = new BufferedReader(new FileReader("Notes"));
			for (int i = 0; i < 38; i++) {
				String department = rd.readLine();
				if (department == null) break;
				departments.add(department);
			}
			rd.close();
		} catch (IOException e) {
			/* Ignored */
		}
	}
	
	private static List<String> permissibleClassComponents = new ArrayList<String>();
	private static List<String> departments = new ArrayList<String>();
	
	private static void writeDepartmentClassesToFile(Department d, ExploreCoursesConnection con) {
		String filename = d.getCode();
		filename = filename.replace(' ', '_');
		filename = filename.replace('&', '+');
		filename = filename.replace('/', '-');
		filename = filename.replace(',', '_');
		filename += ".js";
//		if (!filename.equals("Computer_Science.js")) return;
		
		try {
			File file = new File("./classes/" + filename);
			file.createNewFile();
			FileWriter fw = new FileWriter(file.getAbsoluteFile());
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(d.getCode() + " = {");
			
			boolean isFirst = true;
			for (Course c : con.getCoursesByQuery(d.getCode())) {
				if (tooHighLevelClass(c.getSubjectCodeSuffix())) continue;
				
				String json = "{";
				json += "\"department\":\"" + c.getSubjectCodePrefix() + "\",";
				json += "\"number\":\"" + c.getSubjectCodeSuffix() + "\",";
				json += "\"title\":\"" + c.getTitle() + "\",";
				//json += "\"description\":\"" + c.getDescription() + "\",";
				json += "\"min_units\":" + c.getMinimumUnits() + ",";
				json += "\"max_units\":" + c.getMaximumUnits() + ",";
				
				List<String> autumnClasses = new ArrayList<String>();
				List<String> winterClasses = new ArrayList<String>();
				List<String> springClasses = new ArrayList<String>();
				
				boolean shouldContinue = false;
				for (Section s : c.getSections()) {
					if (!permissibleClassComponents.contains(s.getComponent())) continue;
					if (d.getCode().equals("CS") && s.getComponent().equals("DIS")) continue; // Ignore CS discussions
					String term = s.getTerm();
					String meeting = "";
					int i = 0;
					for (MeetingSchedule m : s.getMeetingSchedules()) {
						i++;
						//if (i > 1) System.out.println("We're missing info: " + c.getSubjectCodeSuffix());
						meeting = "{";
						meeting += "\"days\":" + convertDaysToBoolArray(m.getDays()) + ",";
						meeting += "\"start_time\":\"" + m.getStartTime() + "\",";
						meeting += "\"end_time\":\"" + m.getEndTime() + "\"";
						meeting += "}";
						if (m.getStartTime().equals(m.getEndTime()) && !m.getStartTime().equals("00:00:00")) shouldContinue = true;
					}
					
					if (!meeting.isEmpty()) {
						if (term.contains("Autumn")) {
							autumnClasses.add(meeting);
						} else if (term.contains("Winter")) {
							winterClasses.add(meeting);
						} else if (term.contains("Spring")) {
							springClasses.add(meeting);
						}
					}
					// TODO Add professors? (Primary Instructor?)
				}
				if (shouldContinue) {
					System.out.println("Skipping " + c.getSubjectCodePrefix() + " " + c.getSubjectCodeSuffix() + " because it has a class that lasts 0 minutes.");
					continue;
				}
				if (autumnClasses.size() == 0 && winterClasses.size() == 0 && springClasses.size() == 0) continue;
				json += "\"autumn_classes\":" + convertListToJSONArray(autumnClasses) + ",";
				json += "\"winter_classes\":" + convertListToJSONArray(winterClasses) + ",";
				json += "\"spring_classes\":" + convertListToJSONArray(springClasses) + ",";
				
				
				json += "\"gers\":\"" + c.getGeneralEducationRequirementsSatisfied() + "\""; 
				json += "}";
				if (!isFirst) {
					bw.write(",\n");
				} else {
					isFirst = false;
				}
				bw.write("\"" + c.getSubjectCodeSuffix() + "\":" + json);
			}
			bw.write('\n');
			bw.write("}");
			bw.close();
		} catch (IOException e) {
      e.printStackTrace();
			System.out.println("Fuck IOException " + d.getCode());
		} catch (JDOMException e) {
      e.printStackTrace();
			System.out.println("Fuck JDOMException (What the hell is that!?!) " + d.getCode());
		}
		
	}
	
	private static String convertDaysToBoolArray(String days) {
		String str = "[";
		str += days.contains("Monday") ? "true" : "false";
		str += ",";
		str += days.contains("Tuesday") ? "true" : "false";
		str += ",";
		str += days.contains("Wednesday") ? "true" : "false";
		str += ",";
		str += days.contains("Thursday") ? "true" : "false";
		str += ",";
		str += days.contains("Friday") ? "true" : "false";
		str += "]";
		return str;
	}
	
	private static String convertListToJSONArray(List<String> list) {
		String str = "[";
		for (int i = 0; i < list.size(); i++) {
			str += list.get(i);
			if (i != list.size() - 1) str += ",";
		}
		str += "]";
		return str;
	}
	
	private static boolean tooHighLevelClass(String className) {
		//System.out.print(className);
		if (className.length() < 3) return false;
		char first = className.charAt(0);
		char second = className.charAt(1);
		char third = className.charAt(2);
		if (Character.isDigit(first) && Character.isDigit(second) && Character.isDigit(third)) {
			if (Integer.parseInt(className.substring(0, 3)) > 299) {
				//System.out.println(": Too high!");
				return true;
			}
		}
		//System.out.println(": OK!");
		return false;
	}
}
