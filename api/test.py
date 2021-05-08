import requests


BASE = "http://127.0.0.1:5000/"
tripRequest = {'tripID': '1234', 'car': {'carDetails': 'asdf'}, 'hotel': {'hotelDetails': 'jkl'}}
try:
    response = requests.post(BASE, json=tripRequest)
    success = True
except:
    success = False

print(success)
if success:
    print(response.json())

