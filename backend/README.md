To get all dependencies:

	npm install

To run mongodb database:

	npm run dbon

To run server:

	npm run start

For testing:

1) run mongodb database on one terminal

2) run server on another one

3) on the third terminal we use curl tool to make requests

3.1) add an json object to course endpoint

curl --header "Content-Type: application/json" -d "{
\"id\": \"02\",
\"instructorId\": \"14100438\",
\"departmentId\": \"001\",
\"name\": \"CS472\",
\"title\": \"Networking\",
\"reviewRating\": \"0\",
\"surveyRating\": \"0\",
\"description\": \"Network Class\"
}" http://localhost:3000/course/add

3.2)  add an json object to section endpoint:

curl --header "Content-Type: application/json" -d "{
\"id\": \"02\",
\"name\": \"CS472\",
\"quarter\": \"Winter20-21\" ,
\"number\": \"002\",
\"reviewRating\": \"2\",
\"surveyRating\": \"4\",
\"description\": \"Networking class\",
\"crn\": \"12346\",
\"instructorDescr\": \"\" 
}" http://localhost:3000/section/add

3.2) get added object using GET request: 

curl http://localhost:3000/section/?name=CS472