This is a termmaster web scrapping tool. 

Requrements: Python3.6+, pip or pip3

Setup virtual enviroments:
	1) Create virtual env: python3 -m venv env
	2) exclude ./env in .gitignore
	3) source env/bin/activate 
	4) Install dependecies: pip3 install -r requirements.txt

#Only when you test or need to update the info. Otherwise, just use the out.txt to read in the info.
Run the scrapper code:
	1) python3 main.py > out.txt #This will override the existing file

Notes: It takes a long time to run the code. It is trying to recursively follow the links down to the class and print the string. Expect the code to run 7-10 minutes. 
