import requests

url = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI"

querystring = {"pageSize":"10","q":"forex","autoCorrect":"true","pageNumber":"1","toPublishedDate":"null","fromPublishedDate":"null"}

headers = {
    'x-rapidapi-key': "5812113f4bmshfa9aaa56fd6325cp1518c7jsn2e3209951355",
    'x-rapidapi-host': "contextualwebsearch-websearch-v1.p.rapidapi.com"
    }

response = requests.request("GET", url, headers=headers, params=querystring)

with open('temp.txt','w') as f:
    f.write(response.text)