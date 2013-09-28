#!/bin/bash

# Shell script for quickly updating all the course files.

# Move to this directory
cd ${0%/*}

# Compile
ERRORS=`javac -cp "jdom-2.0.1.jar:explorecourses.jar:." FetchCourses.java 2>&1`

if [ "$ERRORS" != "" ];then
  echo "There were errors!"
  echo
  echo "$ERRORS"
  exit 2
fi

# Delete all the old ones
rm ../client/models/data/*

# Run with more memory
java -Xmx512m -cp "jdom-2.0.1.jar:explorecourses.jar:." FetchCourses

# Return to original directory
cd - > /dev/null
