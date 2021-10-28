import requests
import bs4
import lxml
import os
import json as json

base_url = 'https://termmasterschedule.drexel.edu'
home_res = requests.get('https://termmasterschedule.drexel.edu/webtms_du/app')

home_soup = bs4.BeautifulSoup(home_res.text,'lxml')
f = open("course_links.txt","w")

"""
What:	Extract classes from the table returned when follow subject link
How: 	Found a very specific attribute width=99% that only that table elements has.
		Select "even" and "odd" classnames and parse their content, ignoring Day/Time column
Return:	List of classes for a required subject
"""
def get_rows(soup):
	result = soup.find_all('table', attrs={"width": "99%"})
	arr = []

	for r in result:
		even = r.select(".even")
		odd = r.select(".odd")
		arr.append(even)
		arr.append(odd)

	even_rows = arr[0]
	odd_rows = arr[1]
	total_rows = even_rows + odd_rows

	tt = []

	for i in total_rows:
		tds = i.find_all('td')
		if len(tds) > 5:
			tt.append(i)

	return tt

"""
What:	Extract links based on selector
How: 	Search soup object based on selector. 
		Search result for <a> tags and extract "href" link and tag content. 
		Assemble a dictionary with tag_content as key and "href" as value pairs
Return:	Dictionary with "tag_content": "href" structure
"""
def get_links(soup,selector):
	result = soup.select(selector)
	tmp = []
	for block in result:
		tmp.append(block.find_all('a',href=True))

	link_objects = tmp[0]
	links = {}

	for link in link_objects:
		link_value = link.contents[0]
		link_url = link.get('href')
		links[link_value] = link_url

	return links

"""
What:	Extract one level down links tree for term -> college links
How: 	Loops through dictionary and follow links in the values.
		Calls to get_links*() to get sublinks. 
		Assemble nested dictionary with structure: 
		{
			term: {
				college : "href"
			}
		}
Return:	One level down nested dictionary
"""
def term_level_tree(current_tree):
	tmp = {}
	for term in current_tree:
		res = requests.get(base_url + current_tree[term])
		college_soup = bs4.BeautifulSoup(res.text,'lxml')
		college_links = get_links(college_soup,'#sideLeft')
		tmp[term] = college_links

	return tmp

"""
What:	Extract two level down links tree for term -> college -> subject links
How: 	Loops through dictionary and follow links in the values.
		Calls to get_links*() to get sublinks. 
		Assemble nested dictionary with structure: 
		{
			term: {
				college : {
					subject: "href"
				}
			}
		}
Return:	Two levels down nested dictionary
"""
def college_level_tree(current_tree):
	tmp1 = {}
	for term in current_tree:
		tmp2 = {}
		for college in current_tree[term]:
			res = requests.get(base_url + current_tree[term][college])
			subject_soup = bs4.BeautifulSoup(res.text,'lxml')
			subject_links = get_links(subject_soup,'.collegePanel')
			tmp2[college] = subject_links
		tmp1[term] = tmp2

	return tmp1

"""
What:	Extract string representative of a row of class information from  three(final) levels down links tree for term -> college -> subject -> class
		For testing purposes print() instead of writing to file. 
How: 	Loops through dictionary and follow links in the values.
		Calls to get_links*() to get sublinks. 
		When reached the bottom level, search table data for values and assemble a string.
		For testing output is redirected to out.txt file
Return:	
"""
def subject_level_tree_print(current_tree):
	f = open("a.out", "w")
	for term in current_tree:
		for college in current_tree[term]:
			for subject in current_tree[term][college]:
				res = requests.get(base_url + current_tree[term][college][subject])
				class_soup = bs4.BeautifulSoup(res.text,'lxml')
				
				r = get_rows(class_soup)
				for i in r:
					tds = i.find_all('td')
					write_string = ""
					for c in i:
						try:
							if len(c.contents) == 1:
								write_string = write_string + "|" + c.contents[0] 
						except:
							pass
					f.write(write_string + "\n")
					print(write_string)
	f.close()

def main():
	term_links = get_links(home_soup,'.termPanel')
	for l in term_links:
		write_string = l + ": " + term_links[l] + "\n"
		f.write(write_string)
	f.close()
	#print(term_links)
	winter_link_tree = {}
	winter_link_tree['Winter Quarter 20-21'] = term_links['Winter Quarter 20-21']

	term_college_tree = term_level_tree(winter_link_tree)
	print(term_college_tree)
	college_subject_tree = college_level_tree(term_college_tree)

	subject_level_tree_print(college_subject_tree)

main()


