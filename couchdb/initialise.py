# pre-populate the couchdb
import datetime
import random
import requests

# for debug
def print_res(res):
    print(res.text)

# params - general
PORT = 5984
USER = "admin"
PASSWORD = "password"
URL = "http://{}:{}@localhost:{}/".format(USER, PASSWORD, PORT)

# params - flights
N_FLIGHTS = 1000  # number of flights to generate
DATE_LIMIT = 30     # max number of days from now to allocate flights to
COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Congo {Democratic Rep}","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland {Republic}","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar, {Burma}","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russian Federation","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"] 
N_COUNTRIES = len(COUNTRIES)


# populate - flights
print("generating flights...")
flights = []
for i in range(N_FLIGHTS):
    # generate origin and dest
    origin = "Australia"
    dest = COUNTRIES[random.randint(0, N_COUNTRIES-1)]
    while dest == origin:
        dest = COUNTRIES[random.randint(0, N_COUNTRIES-1)]
    
    # generate a departure and arrival date
    departure = datetime.date.today() + \
        datetime.timedelta(days=random.randint(0, DATE_LIMIT))
    arrival = departure + datetime.timedelta(days=1)

    # generate a flight number
    flight_num = "{}{}{:03d}".format(origin[0], dest[0], i)
    # add the flight
    flight = {'flight_num':flight_num, \
              'origin':origin, 'dest':dest, \
              'departure':str(departure), 'arrival':str(arrival)}
    flights.append(flight)

requests.put(URL + "flights")
requests.post(URL + "flights/_bulk_docs", json={"docs":flights})

print("done")