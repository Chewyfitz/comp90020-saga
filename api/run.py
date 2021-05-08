from flask import Flask, request
from flask_restful import Api, Resource
import json

app = Flask(__name__)
api = Api(app)

'''
Cases to worry about:
-microservice fails and microservice responds with negative result.
-SEC fails and starts back up where it left off.
-concurrency with the log.
'''

def addLog(trip, key, msg=True):
    with open('api/log.json', 'r') as f:
        log = json.load(f)
    log[trip['tripID']][key] = msg
    with open('api/log.json', 'w') as f:
        json.dump(log, f)

def sagaCar(trip):
    #send api request to car booking service
    response = True #example response
    if response:
        addLog(trip,'endCar')
    else:
        addLog(trip, 'abortCar')
        #compensate actions

def sagaFlights(trip):
    #send api request to car booking service
    response = True #example response
    if response:
        addLog(trip,'endFlights')
    else:
        addLog(trip, 'abortFlights')
        #compensate actions

def sagaHotel(trip):
    #send api request to car booking service
    response = True #example response
    if response:
        addLog(trip,'endHotel')
    else:
        addLog(trip, 'abortHotel')
        #compensate actions

def sagaPayment(trip):
    #send api request to car booking service
    response = True #example response
    if response:
        addLog(trip,'endPayment')
    else:
        addLog(trip, 'abortPayment')
        #compensate actions

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
            addLog(trip,'startCar')
            sagaCar(trip)

        if 'flights' in trip:
            addLog(trip,'startFlights')
            sagaFlights(trip)

        if 'hotel' in trip:
            addLog(trip,'startHotel')
            sagaHotel(trip)

        #Payment will always be present
        addLog(trip,'startPayment')
        sagaPayment(trip)

        addLog(trip, 'end')

        return True


class SEC(Resource):

    def post(self):
        trip = request.get_json()
        res = saga(trip)
        return {'result': 'data'}

api.add_resource(SEC, '/')

app.run()

