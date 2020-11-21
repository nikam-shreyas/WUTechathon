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
    print("rates",rates)
    str2 = "https://www.freeforexapi.com/api/live?pairs="
    for rate in rates:
        str2+=base+rate+","
    print("str2", str2)
    str2=str2[:-1]
    frates = requests.get(str2)
    frates = frates.json().get('rates')
    print("frates",frates)
    response={}
    for rate in rates:
        response[rate]={}
        response[rate]["exchangerate"]=rates[rate]
    for rate in frates:
        response[rate[3:]]["freeforex"]=frates[rate]['rate']
    list1 = list(response.items())
    return {"resp":list1}

if __name__ == '__main__':
    app.run()
