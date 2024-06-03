from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask import request, Response
import json

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res
    
@app.route("/", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def hello_world():
    content = request.get_json(silent=True)
    print("hi")
    print(content)
    resp = Response(json.dumps(content))
    return resp

@app.route("/people", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def admin_page(opt=None):
    with open('people.json', encoding='utf-8') as f:
        people = json.load(f)
        f.close()
    print(people)
    resp = Response(json.dumps(people["people"]))
    resp.headers["Access-Control-Expose-Headers"] = "*"
    resp.headers["Content-Range"] = "people 0-24/319"
    resp.status = 200
    return resp

@app.route("/auth", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def auth_page(opt=None):
    login = False
    content = request.get_json(silent=True)
    if(content["username"] == "abcd" and content["password"] == "abcdabcd" ):
        login = True
        resp = Response(json.dumps({"name" : "lolmaster"}))
        resp.headers["Access-Control-Expose-Headers"] = "*"
        resp.status = 200
    else:
        resp = Response()
        resp.status = 401
    return resp
       

if __name__ == "__main__":
  app.run(host='127.0.0.1', port=5000, debug=True)