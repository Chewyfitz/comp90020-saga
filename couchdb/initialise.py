# pre-populate the couchdb
import datetime
import random
import requests

# constants
COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Congo {Democratic Rep}","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland {Republic}","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar, {Burma}","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russian Federation","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"] 
N_COUNTRIES = len(COUNTRIES)

# params - program
PORT = 5984
USER = "admin"
PASSWORD = "password"
URL = "http://{}:{}@localhost:{}/".format(USER, PASSWORD, PORT)

# params - flights
N_FLIGHTS = 1000    # number of flights to generate
DATE_LIMIT = 30     # max number of days from now to allocate flights to
RETURN_MAX = 14     # max number of days from the original flight to allocate return flights to 
F_PRICE_MEAN = 1000 # average price of flight
F_PRICE_SD = 150    # standard deviation for flight prices
F_PRICE_MIN = 400   # minimum flight price

# params - hotels
N_HOTELS = 1000     # number of hotels to generate
H_PRICE_MEAN = 250
H_PRICE_SD = 75
H_PRICE_MIN = 50

# functions
def print_res(res):
    print(res.text)

def add_days(date, days):
    return date + datetime.timedelta(days=days)

def generate_price(mean, sd, minimum):
    return max(minimum, int(random.normalvariate(mean, sd)))

def generate_flight():
    # generate origin and dest
    origin = "Australia"
    dest = random.choice(COUNTRIES)
    while dest == origin:
        dest = random.choice(COUNTRIES)
    
    # generate a departure and arrival date
    departure = add_days(datetime.date.today(), random.randint(0, DATE_LIMIT))
    arrival = add_days(departure, 1)
    departure_return = add_days(arrival, random.randint(0, RETURN_MAX))
    arrival_return = add_days(departure_return, 1)

    # generate a flight number
    flight_num = "{}{}{:03d}".format(origin[0], dest[0], i)

    # generate a price for the flight
    price = generate_price(F_PRICE_MEAN, F_PRICE_SD, F_PRICE_SD)
    return_price = generate_price(F_PRICE_MEAN, F_PRICE_SD, F_PRICE_SD)

    # add the flight
    flight = {'flight_num':flight_num, 'price': price, \
              'origin':origin, 'dest':dest, \
              'departure':str(departure), 'arrival':str(arrival)}
    return_flight = {'flight_num':flight_num, 'price': return_price,  \
              'origin':dest, 'dest':origin, \
              'departure':str(departure_return), 'arrival':str(arrival_return)}

    return (flight, return_flight)

def generate_hotel():
    # generate location
    location = random.choice(COUNTRIES)
    # generate nightly price
    price = generate_price(H_PRICE_MEAN, H_PRICE_SD, H_PRICE_MIN)

    hotel = {'price': price, 'location': location}
    return hotel

# populate flights
print("generating flights...")
flights = []
for i in range(N_FLIGHTS):
    # for each loop, generate a to and from flight
    flight, return_flight = generate_flight()

    flights.append(flight)
    flights.append(return_flight)

requests.put(URL + "flights")
requests.post(URL + "flights/_bulk_docs", json={"docs":flights})

# populate hotels
print("generating hotels...")
hotels = []
for i in range(N_HOTELS):
    hotel = generate_hotel()
    hotels.append(hotel)

requests.put(URL + "hotels")
requests.post(URL + "hotels/_bulk_docs", json={"docs":hotels})

# bookings
requests.put(URL + "flight_bookings")
requests.put(URL + "hotel_bookings")

# payment accounts
print("setting up accounts...")
accounts = [ {"_id": "flight", "name": "SAGA Flights", "balance":  10000},
             {"_id":  "hotel", "name":  "SAGA Hotels", "balance":  10000},
             {"_id":   "rich", "name":  "Richie Rich", "balance": 200000},
             {"_id":   "poor", "name":        "Kenny", "balance":    400},
             {"_id":  "rich2", "name":          "Joe", "balance": 125000}]
# just manually insert the accounts into the db
requests.put(URL + "accounts")
requests.post(URL + "accounts/_bulk_docs", json={"docs":accounts})

print("done")