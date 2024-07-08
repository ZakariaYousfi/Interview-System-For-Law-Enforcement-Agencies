# Context
This is my master's project. It is a web application which enables investigators to input interview data. the system provides 
two AI technologies: contradiction detection and question recommendation. Our contradiction detection is a rule based method 
where we structure the input to guarentee 100% precision by providing predefined questions to extact relation which are then 
compared. We only did contradiction detection for person-person relation and person-location relation. As for the question 
recommendation, we used the database as a means for extracting questions that are most relevant to the last question answer 
pair that was inputted in the interview. the case type and person type are taking into consideration aswell. see thesis for further info.

# Running Frontend Code
to run the frontend code cd into the front directory and then use the npm install command to download all necessary files. 
then the command npm run dev to run the server

# Running the Backend code 
to run the backend code cd into the back directory and then run the command py backend.py to run the server. make sure all the required 
libraries are installed in your python environemment, also check that you have downloaded all models (check the back folder). as for the 
database use the database file to insert all of the tables needed

 