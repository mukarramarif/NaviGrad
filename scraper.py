import requests
from bs4 import BeautifulSoup
import csv
# URL to scrape
url = "https://catalog.lehigh.edu/coursesprogramsandcurricula/artsandsciences/chemistry/#undergraduatetext"

# Send a GET request to the website
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.content, "html.parser")
    
    soup = BeautifulSoup(response.text,features="html.parser")

    class_all=soup.find_all('td',class_='codecol')
    classes = set()

    for element in class_all:
        classes.add(element.text.strip())

    classesList = list(classes)
    # Write the unique cleaned classes to a CSV file
    with open('cheme.csv', mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Course Code'])  # Write header
        for class_name in classesList:
            writer.writerow([class_name])  # Write each course code

    
    

else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
