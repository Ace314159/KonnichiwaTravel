from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def parseRequest():
    args = dict(request.args)
    url = args.pop("url")[0]
    r = requests.get(url, params=args, headers=request.headers)
    return r.text
