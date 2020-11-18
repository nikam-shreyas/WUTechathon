from flask import Flask, render_template, jsonify
import requests, json
from datetime import datetime

app = Flask(__name__)


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

if __name__ == '__main__':
    app.run()
