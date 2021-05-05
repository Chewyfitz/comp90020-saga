import requests

BASE = "http://127.0.0.1:5000/"
tripRequest = {'tripID': '1234', 'services':['car','hotel'], 'date':'12/5/2021'}
response = requests.put(BASE, tripRequest)
print(response.json())