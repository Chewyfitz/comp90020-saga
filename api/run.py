from flask import Flask, request
from flask_restful import Api, Resource
import json

app = Flask(__name__)
api = Api(app)

'''
Cases to worry about:
-microservice fails
-SEC fails and starts back up where it left off. How does it know who to send the result back to? 
Should front end just get a 'failed' and when SEC comes back, it just compensates anything it finds unfinished?
-concurrency with the log if multiple posts.

NOTE: currently using just a txt file as the SAGA log. This may cause issues. may need a database?

You can test this by running test.py while the SEC is up. Make sure the log.json only has {} in it. 
'''

def addLog(trip, key, msg=True):
    with open('api/log.json', 'r') as f:
        log = json.load(f)
    log[trip['tripID']][key] = msg
    with open('api/log.json', 'w') as f:
        json.dump(log, f)

def carBook(trip):
    #send api request
    response = True #example response
    if response:
        addLog(trip,'carEnd')
        return True
    else:
        addLog(trip, 'carAbort')
        return False

def flightsBook(trip):
    #send api request
    response = True #example response
    if response:
        addLog(trip,'flightsEnd')
        return True
    else:
        addLog(trip, 'flightsAbort')
        return False

def hotelBook(trip):
    #send api request
    response = False #example response
    if response:
        addLog(trip,'hotelEnd')
        return True
    else:
        addLog(trip, 'hotelAbort')
        return False

def paymentBook(trip):
    #send api request
    response = True #example response
    if response:
        addLog(trip,'paymentEnd')
        return True
    else:
        addLog(trip, 'paymentAbort')
        return False

def carComp(trip):
    #send api request
    addLog(trip, 'carAbort')

def flightsComp(trip):
    #send api request 
    addLog(trip, 'flightsAbort')

def hotelComp(trip):
    #send api request 
    addLog(trip, 'hotelAbort')

def paymentComp(trip):
    #send api request 
    addLog(trip, 'paymentAbort')

def compensateSaga(trip):
    with open('api/log.json', 'r') as f:
        log = json.load(f)
    
    if not ('carStart' not in log[trip['tripID']] or 'carAbort' in log[trip['tripID']]):
        carComp(trip)

    if not ('flightsStart' not in log[trip['tripID']] or 'flightsAbort' in log[trip['tripID']]):
        flightsComp(trip)

    if not ('hotelStart' not in log[trip['tripID']] or 'hotelAbort' in log[trip['tripID']]):
        hotelComp(trip)

    if not ('paymentStart' not in log[trip['tripID']] or 'paymentAbort' in log[trip['tripID']]):
        paymentComp(trip)
    
    addLog(trip, 'end', False)


def saga(trip):
        with open('api/log.json', 'r') as f:
            log = json.load(f)
        
        if trip['tripID'] not in log:
            log[trip['tripID']] = {'start': True}
            with open('api/log.json', 'w') as f:
                json.dump(log, f)
        
        if 'end' in log[trip['tripID']]:
            return log[trip['tripID']]['end'] #True or False

        if 'car' in trip:
            addLog(trip,'carStart')
            result = carBook(trip)
            if not result:
                compensateSaga(trip)
                return False

        if 'flights' in trip:
            addLog(trip,'flightsStart')
            result = flightsBook(trip)
            if not result:
                compensateSaga(trip)
                return False

        if 'hotel' in trip:
            addLog(trip,'hotelStart')
            result = hotelBook(trip)
            if not result:
                compensateSaga(trip)
                return False

        #Payment will always be present
        addLog(trip,'paymentStart')
        paymentBook(trip)

        addLog(trip, 'end')

        return True

class SEC(Resource):

    def post(self):
        trip = request.get_json()
        res = saga(trip)
        return {'ok': res}

api.add_resource(SEC, '/')

app.run()

