import os
import random
import json

compsci = []

with open("out.txt",'r') as f:
	d = f.readline().split('|')
	i = 0
	while len(d) > 1:
		i += 1
		# if i == 5000: break
		# print(d)
		if d[1] == "SE":
			formatted = {
				"id": d[2],
				"instructorId": d[2],
				"departmentId": 3005,
				"name": d[6],
				"title": "SE"+d[2],
				"reviewRating": random.randint(1,5),
				"surveyRating": random.randint(1,5),
				"description": d[6]
			}
			compsci.append(formatted)
		d = f.readline().split('|')

print(compsci)
# with open('cs.json', 'w') as file:
# 	json.dump(compsci, 'cs.json')


'''
['', 'GST', 'T280', 'Lecture', 'Face To Face', '001', 'Global Education & Development\n']
'''
