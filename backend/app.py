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
from flask_cors import CORS


app = Flask(__name__)
app.config['SECRET_KEY'] = '9db80a7b38ecd1ba9ed4fda7fd38508a'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
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


dictionary = {}

def updateRates():
    str = "https://www.freeforexapi.com/api/live?pairs=AUDUSD,EURGBP,EURUSD,GBPUSD,NZDUSD,USDAED,USDAFN,USDALL,USDAMD,USDANG,USDAOA,USDARS,USDATS,USDAUD,USDAWG,USDAZM,USDAZN,USDBAM,USDBBD,USDBDT,USDBEF,USDBGN,USDBHD,USDBIF,USDBMD,USDBND,USDBOB,USDBRL,USDBSD,USDBTN,USDBWP,USDBYN,USDBYR,USDBZD,USDCAD,USDCDF,USDCHF,USDCLP,USDCNH,USDCNY,USDCOP,USDCRC,USDCUC,USDCUP,USDCVE,USDCYP,USDCZK,USDDEM,USDDJF,USDDKK,USDDOP,USDDZD,USDEEK,USDEGP,USDERN,USDESP,USDETB,USDEUR,USDFIM,USDFJD,USDFKP,USDFRF,USDGBP,USDGEL,USDGGP,USDGHC,USDGHS,USDGIP,USDGMD,USDGNF,USDGRD,USDGTQ,USDGYD,USDHKD,USDHNL,USDHRK,USDHTG,USDHUF,USDIDR,USDIEP,USDILS,USDIMP,USDINR,USDIQD,USDIRR,USDISK,USDITL,USDJEP,USDJMD,USDJOD,USDJPY,USDKES,USDKGS,USDKHR,USDKMF,USDKPW,USDKRW,USDKWD,USDKYD,USDKZT,USDLAK,USDLBP,USDLKR,USDLRD,USDLSL,USDLTL,USDLUF,USDLVL,USDLYD,USDMAD,USDMDL,USDMGA,USDMGF,USDMKD,USDMMK,USDMNT,USDMOP,USDMRO,USDMRU,USDMTL,USDMUR,USDMVR,USDMWK,USDMXN,USDMYR,USDMZM,USDMZN,USDNAD,USDNGN,USDNIO,USDNLG,USDNOK,USDNPR,USDNZD,USDOMR,USDPAB,USDPEN,USDPGK,USDPHP,USDPKR,USDPLN,USDPTE,USDPYG,USDQAR,USDROL,USDRON,USDRSD,USDRUB,USDRWF,USDSAR,USDSBD,USDSCR,USDSDD,USDSDG,USDSEK,USDSGD,USDSHP,USDSIT,USDSKK,USDSLL,USDSOS,USDSPL,USDSRD,USDSRG,USDSTD,USDSTN,USDSVC,USDSYP,USDSZL,USDTHB,USDTJS,USDTMM,USDTMT,USDTND,USDTOP,USDTRL,USDTRY,USDTTD,USDTVD,USDTWD,USDTZS,USDUAH,USDUGX,USDUSD,USDUYU,USDUZS,USDVAL,USDVEB,USDVEF,USDVES,USDVND,USDVUV,USDWST,USDXAF,USDXAG,USDXAU,USDXBT,USDXCD,USDXDR,USDXOF,USDXPD,USDXPF,USDXPT,USDYER,USDZAR,USDZMK,USDZMW,USDZWD"
    resp = requests.get(str)
    rates = resp.json().get('rates')
    for rate in rates:
        dictionary[rate] = rates[rate]['rate']




@app.route('/getAll', methods=['GET'])
def getAll():
    updateRates()
    temp = dictionary.copy()
    for item in temp:
        if temp.get(item):
            if item[0:3]!=item[3:]:
                temp[item] = round(temp[item] + random.uniform(0,1),5)
    return temp

@app.route('/getTop')
def getTop():
    updateRates()
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
    updateRates()
    pairs = request.args.get('pair').split(',')
    mylist = {}
    for pair in pairs:
        if pair in dictionary.keys():
            val = round(dictionary.get(pair)+random.uniform(0,1),5)
            mylist[pair]=val
        else:
            mylist[pair]="_"
    return jsonify(mylist)

@app.route('/getHistory')
def getHistory():
    updateRates()
    pair = request.args.get('pair')
    if pair not in dictionary.keys():
        return {"error":"Invalid pair"}
    start_ms = request.args.get('start')
    end_ms = request.args.get('end')
    st_date = datetime.fromtimestamp(int(start_ms)/1000)
    en_date = datetime.fromtimestamp(int(end_ms)/1000)
    day_count = (en_date-st_date).days +1
    rate = dictionary.get(pair)
    mylist = []
    for single_date in (st_date + timedelta(n) for n in range(day_count)):
        mylist.append(
            {
                "date":strftime("%Y-%m-%d", single_date.timetuple()),
                "best_rate":round(rate+random.uniform(0,2),5),
                "worst_rate":round(rate-random.uniform(0,2),5)
            }
        )
    return jsonify(mylist)


if __name__ == '__main__':
    app.run()
