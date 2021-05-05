from flask import Flask, request
from flask_restful import Api, Resource, reqparse
app = Flask(__name__)
api = Api(app)

trip_put_args = reqparse.RequestParser()
trip_put_args.add_argument('tripID', type=str, help='Trip ID')
trip_put_args.add_argument('services', type=str, action='append', help='Services')
trip_put_args.add_argument('date', type=str, help='Date')

class SEC(Resource):
    def get(self):
        return {'tripID': '1234'}

    def put(self):
        args = trip_put_args.parse_args()
        return {'data': args}

api.add_resource(SEC, '/')

app.run()