from flask import Flask, render_template, jsonify, redirect, request
import requests, json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin,login_user, current_user, logout_user, login_required

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
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"


@app.route('/')
def index():
    x = requests.get("https://www.freeforexapi.com/api/live")
    pairs = x.json().get('supportedPairs')
    str = "https://www.freeforexapi.com/api/live?pairs="
    for pair in pairs:
        str+=pair+","
    str = str[:-1]
    resp = requests.get(str)
    rates = resp.json().get('rates')
    for rate in rates:
        ts = rates[rate]['timestamp']
        ts = int(ts)
        rates[rate]['timestamp'] = datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({"rates":rates})


@app.route('/register',methods=['POST'])
def func_name():
    name = request.form['name']
    email = request.form['email']
    fx_name = request.form['fx_name']
    password = request.form['password']
    confirm_password = request.form['confirm_password']
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(name=name,email=email,fx_name=fx_name, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return redirect("http://localhost:3000")

@app.route('/login',methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    
    user = User.query.filter_by(email = email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return "Login successful"
    else:
        return "Login unsuccessful"
    return redirect("http://localhost:3000")




if __name__ == '__main__':
    app.run()
