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
		if d[1] == "CS":
			formatted = {
				"departmentId": "3005",
				"inst_name": d[7].rstrip(),
				"course_name": d[6],
				"number": d[5],
				"quarter": "202035"
			}
			compsci.append(formatted)
		d = f.readline().split('|')

print(json.dumps(compsci))
# with open('cs.json', 'w') as file:
# 	json.dump(compsci, 'cs.json')


'''
['', 'GST', 'T280', 'Lecture', 'Face To Face', '001', 'Global Education & Development\n']
'''
