import os
import random
import json
import requests
from lxml import html

compsci = []
values = []
with open("out.txt",'r') as f:
	d = f.readline().split('|')
	i = 0
	while len(d) > 1:
		i += 1
		# if i == 5000: break
		# print(d)
		if d[1] == "INFO":
			inst_name = d[7].rstrip()
                        instructors = inst_name.split(",")
                        for inst in instructors:
                            names = inst.strip().split(" ")
                            full = names[0] + " " + names[-1]
                            if full not in compsci and inst != "STAFF":
                                compsci.append(full)
		d = f.readline().split('|')

for inst in compsci:
    page = requests.get("https://drexel.edu/search/?q=" + inst.strip() + "&t=people")
    parse = html.fromstring(page.content)
    l = parse.xpath('//div[@id="search-results"]//span[@class="email-address"]')
    if len(l) > 0:
        values.append({"name": inst, "email": l[0].text_content()})

print(json.dumps(values))
# with open('cs.json', 'w') as file:
# 	json.dump(compsci, 'cs.json')


'''
['', 'GST', 'T280', 'Lecture', 'Face To Face', '001', 'Global Education & Development\n']
'''
