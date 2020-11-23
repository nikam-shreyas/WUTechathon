from flask import Flask, render_template, jsonify, redirect, request
import requests, json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin,login_user, current_user, logout_user, login_required
from sqlalchemy.exc import IntegrityError
import random
from datetime import datetime,timedelta
from time import strftime


app = Flask(__name__)
app.config['SECRET_KEY'] = '9db80a7b38ecd1ba9ed4fda7fd38508a'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
freeforexSupportedPairs = ["AUDUSD","EURGBP","EURUSD","GBPUSD","NZDUSD","USDAED","USDAFN","USDALL","USDAMD","USDANG","USDAOA","USDARS","USDATS","USDAUD","USDAWG","USDAZM","USDAZN","USDBAM","USDBBD","USDBDT","USDBEF","USDBGN","USDBHD","USDBIF","USDBMD","USDBND","USDBOB","USDBRL","USDBSD","USDBTN","USDBWP","USDBYN","USDBYR","USDBZD","USDCAD","USDCDF","USDCHF","USDCLP","USDCNH","USDCNY","USDCOP","USDCRC","USDCUC","USDCUP","USDCVE","USDCYP","USDCZK","USDDEM","USDDJF","USDDKK","USDDOP","USDDZD","USDEEK","USDEGP","USDERN","USDESP","USDETB","USDEUR","USDFIM","USDFJD","USDFKP","USDFRF","USDGBP","USDGEL","USDGGP","USDGHC","USDGHS","USDGIP","USDGMD","USDGNF","USDGRD","USDGTQ","USDGYD","USDHKD","USDHNL","USDHRK","USDHTG","USDHUF","USDIDR","USDIEP","USDILS","USDIMP","USDINR","USDIQD","USDIRR","USDISK","USDITL","USDJEP","USDJMD","USDJOD","USDJPY","USDKES","USDKGS","USDKHR","USDKMF","USDKPW","USDKRW","USDKWD","USDKYD","USDKZT","USDLAK","USDLBP","USDLKR","USDLRD","USDLSL","USDLTL","USDLUF","USDLVL","USDLYD","USDMAD","USDMDL","USDMGA","USDMGF","USDMKD","USDMMK","USDMNT","USDMOP","USDMRO","USDMRU","USDMTL","USDMUR","USDMVR","USDMWK","USDMXN","USDMYR","USDMZM","USDMZN","USDNAD","USDNGN","USDNIO","USDNLG","USDNOK","USDNPR","USDNZD","USDOMR","USDPAB","USDPEN","USDPGK","USDPHP","USDPKR","USDPLN","USDPTE","USDPYG","USDQAR","USDROL","USDRON","USDRSD","USDRUB","USDRWF","USDSAR","USDSBD","USDSCR","USDSDD","USDSDG","USDSEK","USDSGD","USDSHP","USDSIT","USDSKK","USDSLL","USDSOS","USDSPL","USDSRD","USDSRG","USDSTD","USDSTN","USDSVC","USDSYP","USDSZL","USDTHB","USDTJS","USDTMM","USDTMT","USDTND","USDTOP","USDTRL","USDTRY","USDTTD","USDTVD","USDTWD","USDTZS","USDUAH","USDUGX","USDUSD","USDUYU","USDUZS","USDVAL","USDVEB","USDVEF","USDVES","USDVND","USDVUV","USDWST","USDXAF","USDXAG","USDXAU","USDXBT","USDXCD","USDXDR","USDXOF","USDXPD","USDXPF","USDXPT","USDYER","USDZAR","USDZMK","USDZMW","USDZWD"]

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

freeforexMax = freeforexMin = exchrateMax = exchrateMin = {}


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(20), unique = True, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    fx_name = db.Column(db.String(20), unique = True, nullable = False)
    password = db.Column(db.String(60), nullable = False)

    def __repr__(self):
        return f"User('{self.name}', '{self.email}', '{self.fx_name}')"



@app.route('/register',methods=['POST'])
def func_name():
    name = request.form['username']
    email = request.form['email']
    fx_name = request.form['fxprovider']
    password = request.form['passwordOne']
    confirm_password = request.form['passwordTwo']
    if password != confirm_password:
        return redirect("http://localhost:3000/Register")
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        user = User(name=name,email=email,fx_name=fx_name, password=hashed_password)
        db.session.add(user)    
        db.session.commit()
    except IntegrityError:
        print(IntegrityError)
        db.session.rollback()
        return redirect("http://localhost:3000/Register")

    return redirect("http://localhost:3000/Login")

@app.route('/login',methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    

    user = User.query.filter_by(email = email).first()
    if not user:
        return redirect("http://localhost:3000")
    elif bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return redirect("http://localhost:3000/App")
    else:
        return redirect("http://localhost:3000")
    return redirect("http://localhost:3000/App")

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.with_entities(User.fx_name).all()
    return jsonify({"users":users})


@app.route('/exchrate', methods=['GET'])
def get_exchrate():
    string = "https://api.exchangeratesapi.io/latest"
    base = request.args.get('base')
    string+="?base="+base
    x = requests.get(string)
    rates = x.json().get('rates')
    rates = {k:v for k,v in sorted(rates.items(), key=lambda v: v[1])}
    str2 = "https://www.freeforexapi.com/api/live?pairs="
    for rate in rates:
        if base+rate in freeforexSupportedPairs:
            str2+=base+rate+","
    str2=str2[:-1]
    frates = requests.get(str2)
    frates = frates.json().get('rates')
    response={}
    for rate in rates:
        response[rate]=[]
        response[rate].append({"exchangerate":rates[rate]})
    if frates is not None:
        fratesKey = frates.keys()
        fratesKey = [f[3:] for f in frates]
        for rate in fratesKey:
            response[rate].append({"freeforex":frates[base+rate]["rate"]})
        for rate in rates:
            if rate not in fratesKey:
                response[rate].append({"freeforex":"_"})
    else:
        for rate in rates:
            response[rate].append({"freeforex":"_"})
    list1 = list(response.items())
    return {"resp":list1}

@app.route('/history')
def historical_rates():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    base = request.args.get('base')
    quote= request.args.get('quote')
    apiStr = f"https://api.exchangeratesapi.io/history?start_at={start_date}&end_at={end_date}&base={base}&symbols={quote}"
    x = requests.get(apiStr)
    if(x.json().get('error')):
        return {"error":"symbols not supported"}
    rates = x.json().get('rates')
    rates = {k:v for k,v in sorted(rates.items(), key=lambda v:v[0])}
    print(rates)
    newlist=[]
    Maxx = -1
    Min = 99999
    for rate in rates:
        q = rates[rate][quote]
        if q<Min:
            Min=q
        if q>Maxx:
            Maxx=q
        newlist.append({rate:q})
    return {"list":newlist, "max_rate":Maxx, "min_rate":Min}


dictionary = {
  "EURGBP": 0.89518,
  "EURUSD": 1.187611,
  "GBPUSD": 1.326673,
  "NZDUSD": 0.689708,
  "USDAED": 3.673199,
  "USDAFN": 77.070706,
  "USDALL": 104.441726,
  "USDAMD": 497.379627,
  "USDANG": 1.798626,
  "USDAOA": 666.072039,
  "USDARS": 80.014818,
  "USDAUD": 1.371234,
  "USDAWG": 1.8,
  "USDAZN": 1.699135,
  "USDBAM": 1.649919,
  "USDBBD": 2.023097,
  "USDBDT": 84.964527,
  "USDBGN": 1.650499,
  "USDBHD": 0.377106,
  "USDBIF": 1940.678502,
  "USDBMD": 1,
  "USDBND": 1.3457,
  "USDBOB": 6.918817,
  "USDBRL": 5.328899,
  "USDBSD": 1.00202,
  "USDBTN": 74.638412,
  "USDBWP": 11.109293,
  "USDBYN": 2.562911,
  "USDBYR": 19600,
  "USDBZD": 2.019723,
  "USDCAD": 1.309555,
  "USDCDF": 1964.999729,
  "USDCHF": 0.910355,
  "USDCLP": 763.197232,
  "USDCNY": 6.546694,
  "USDCOP": 3644.5,
  "USDCRC": 613.208144,
  "AUDUSD": 0.72927,
  "USDCUC": 1,
  "USDCUP": 26.5,
  "USDCVE": 93.019626,
  "USDCZK": 22.306502,
  "USDDJF": 178.377102,
  "USDDKK": 6.272601,
  "USDDOP": 58.497307,
  "USDDZD": 128.495577,
  "USDEGP": 15.639918,
  "USDERN": 14.999862,
  "USDETB": 38.221452,
  "USDEUR": 0.842026,
  "USDFJD": 2.0965,
  "USDFKP": 0.753825,
  "USDGBP": 0.753765,
  "USDGEL": 3.309612,
  "USDGGP": 0.753825,
  "USDGHS": 5.831727,
  "USDGIP": 0.753825,
  "USDGMD": 51.780029,
  "USDGNF": 9835.625799,
  "USDGTQ": 7.79816,
  "USDGYD": 209.474479,
  "USDHKD": 7.75255,
  "USDHNL": 24.605093,
  "USDHRK": 6.371802,
  "USDHTG": 64.078522,
  "USDHUF": 304.519577,
  "USDIDR": 14099.55,
  "USDILS": 3.36845,
  "USDIMP": 0.753825,
  "USDINR": 74.39975,
  "USDIQD": 1196.193722,
  "USDIRR": 42105.000014,
  "USDISK": 135.999482,
  "USDJEP": 0.753825,
  "USDJMD": 147.795901,
  "USDJOD": 0.708952,
  "USDJPY": 104.009907,
  "USDKES": 109.41013,
  "USDKGS": 84.799692,
  "USDKHR": 4066.120862,
  "USDKMF": 414.999907,
  "USDKPW": 900.070062,
  "USDKRW": 1104.259664,
  "USDKWD": 0.305901,
  "USDKYD": 0.834985,
  "USDKZT": 429.94407,
  "USDLAK": 9288.51621,
  "USDLBP": 1515.256325,
  "USDLKR": 185.570309,
  "USDLRD": 155.988745,
  "USDLSL": 15.398789,
  "USDLTL": 2.95274,
  "USDLVL": 0.60489,
  "USDLYD": 1.361048,
  "USDMAD": 9.134231,
  "USDMDL": 17.154234,
  "USDMGA": 3948.074408,
  "USDMKD": 51.977797,
  "USDMMK": 1301.602659,
  "USDMNT": 2831.570986,
  "USDMOP": 8.00162,
  "USDMRO": 357.000515,
  "USDMUR": 39.999764,
  "USDMVR": 15.410004,
  "USDMWK": 759.81964,
  "USDMXN": 20.26425,
  "USDMYR": 4.095496,
  "USDMZN": 73.739965,
  "USDNAD": 15.404788,
  "USDNGN": 381.201466,
  "USDNIO": 34.919711,
  "USDNOK": 9.05569,
  "USDNPR": 119.420789,
  "USDNZD": 1.44989,
  "USDOMR": 0.384997,
  "USDPAB": 1.002008,
  "USDPEN": 3.672822,
  "USDPGK": 3.50589,
  "USDPHP": 48.217012,
  "USDPKR": 158.474206,
  "USDPLN": 3.78103,
  "USDPYG": 7043.723269,
  "USDQAR": 3.641016,
  "USDRON": 4.103043,
  "USDRSD": 98.974985,
  "USDRUB": 76.2821,
  "USDRWF": 989.860134,
  "USDSAR": 3.750478,
  "USDSBD": 8.100485,
  "USDSCR": 20.575789,
  "USDSDG": 55.325014,
  "USDSEK": 8.616604,
  "USDSGD": 1.341739,
  "USDSHP": 0.753825,
  "USDSLL": 9984.99998,
  "USDSOS": 583.000068,
  "USDSRD": 14.153976,
  "USDSTD": 21031.906016,
  "USDSVC": 8.767431,
  "USDSYP": 512.916402,
  "USDSZL": 15.402539,
  "USDTHB": 30.209851,
  "USDTJS": 11.350309,
  "USDTMT": 3.51,
  "USDTND": 2.748498,
  "USDTOP": 2.29445,
  "USDTRY": 7.724101,
  "USDTTD": 6.808109,
  "USDTWD": 28.513398,
  "USDTZS": 2319.000038,
  "USDUAH": 28.178808,
  "USDUGX": 3707.456164,
  "USDUSD": 1,
  "USDUYU": 43.061232,
  "USDUZS": 10381.716031,
  "USDVEF": 9.987499,
  "USDVND": 23165,
  "USDVUV": 111.986096,
  "USDWST": 2.572688,
  "USDXAF": 553.356419,
  "USDXAG": 0.040854,
  "USDXAU": 0.000532,
  "USDXCD": 2.70255,
  "USDXDR": 0.704939,
  "USDXOF": 553.361088,
  "USDXPF": 100.874964,
  "USDYER": 250.374959,
  "USDZAR": 15.38945,
  "USDZMK": 9001.197294,
  "USDZMW": 20.966838,
}  

@app.route('/getAll', methods=['GET'])
def getAll():
    temp = dictionary.copy()
    for item in temp:
        if temp.get(item):
            if item[0:3]!=item[3:]:
                temp[item] = round(temp[item] + random.uniform(0,1),5)
    return temp

@app.route('/getTop')
def getTop():
    temp = dictionary.copy()
    temp = {k:v for k,v in sorted(temp.items(), key=lambda v:v[1], reverse=True)}
    newtemp = list(temp)
    newlist = []
    for i in range(4):
        temp[newtemp[i]] = round(temp[newtemp[i]] + random.uniform(0,1),5)
        newlist.append({newtemp[i]:temp[newtemp[i]]})
    return jsonify(newlist)

@app.route('/getPair')
def getPair():
    pairs = request.args.get('pair').split(',')
    mylist = []
    for pair in pairs:
        if pair in dictionary.keys():
            val = round(dictionary.get(pair)+dictionary.get(pair)+random.uniform(0,1),5)
            mylist.append({pair:val})
        else:
            mylist.append({pair:"_"})
    return jsonify(mylist)

@app.route('/getHistory')
def getHistory():
    pair = request.args.get('pair')
    if pair not in dictionary.keys():
        return {"error":"Invalid pair"}
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    st = start_date.split('-')
    end = end_date.split('-')
    st_date = datetime(int(st[0]), int(st[1]), int(st[2]))
    en_date = datetime(int(end[0]), int(end[1]), int(end[2]))
    day_count = (en_date-st_date).days +1
    rate = dictionary.get(pair)
    mylist = []
    for single_date in (st_date + timedelta(n) for n in range(day_count)):
        mylist.append(
            {
                "date":strftime("%Y-%m-%d", single_date.timetuple()),
                "best_rate":round(rate+rate+random.uniform(0,2),5),
                "worst_rate":round(rate+rate-random.uniform(0,2),5)
            }
        )
    return jsonify(mylist)


    




if __name__ == '__main__':
    app.run()
