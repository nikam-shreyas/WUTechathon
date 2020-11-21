from flask import Flask, render_template, jsonify, redirect, request
import requests, json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin,login_user, current_user, logout_user, login_required
from sqlalchemy.exc import IntegrityError
import operator

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
    name = request.form['name']
    email = request.form['email']
    fx_name = request.form['fx_name']
    password = request.form['password']
    confirm_password = request.form['confirm_password']
    if password != confirm_password:
        return ({"error":"Passwords do not match"})
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        user = User(name=name,email=email,fx_name=fx_name, password=hashed_password)
        db.session.add(user)    
        db.session.commit()
    except IntegrityError:
        print(IntegrityError)
        db.session.rollback()
        return jsonify({"error":"This user already exists"})

    return ({"msg":"Registration successful"})

@app.route('/login',methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    

    user = User.query.filter_by(email = email).first()
    if not user:
        return {"error":"User does not exist"}
    elif bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return {"msg":"Login successful"}
    else:
        return {"error":"Incorrect username or password"}
    return redirect("http://localhost:3000")

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

if __name__ == '__main__':
    app.run()
