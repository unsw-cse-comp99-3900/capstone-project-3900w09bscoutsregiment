#!/bin/bash

# Grabs a list of all of the outlines available for 2023 and 2024
curl https://courseoutlines.unsw.edu.au/v1/publicsitecourseoutlines/search\?searchText\&pageNumber\=1\&top\=4000\&year\=2024 -o courses2024.json
curl https://courseoutlines.unsw.edu.au/v1/publicsitecourseoutlines/search\?searchText\&pageNumber\=1\&top\=4000\&year\=2023 -o courses2023.json

# run the script.js script (unpacks all the courses for each year makes a friendly list)
node script.js courses2024.json courses2024urls.txt
node script.js courses2023.json courses2023urls.txt

mkdir 2024_courses

# loop through the courses for each year
# then curl the data for the outline of that specific course
i=0
while read code; do
    read url;
    echo "2024: ${code} ${i}"
    curl ${url} -o 2024_courses/${code}.json
    #echo  "${url} -o json_out/${code}.json" >> poop.txt
    i=$((i+1))
done < courses2024urls.txt

mkdir 2023_courses

i=0
while read code; do
    read url;
    echo "2023: ${code} ${i}"
    curl ${url} -o 2023_courses/${code}.json
    #echo  "${url} -o json_out/${code}.json" >> poop.txt
    i=$((i+1))
done < courses2023urls.txt

# for each course that we curled run the unpacker.js script
# this script makes a database call to insert
for filename in 2024_courses/*.json; do
    node course_unpacker.js ${filename}
done
for filename in 2023_courses/*.json; do
    node course_unpacker.js ${filename}
done

