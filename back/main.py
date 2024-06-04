from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask import request, Response
import json

# Opening JSON file
f1 = open('auditions/a1.json', encoding="utf8")
 
# returns JSON object as 
# a dictionary
d1 = json.load(f1)
 

# Closing file
f1.close()


from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')




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

@app.route("/recommendation", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def question_recommendation():
    content = request.get_json(silent=True)
    print(content)
    qcosine_scores = []
    for i in d1['content']:
        embeddingsq1 = model.encode(content['q'])
        embeddingsq2 = model.encode(i['q'])
        embeddingsa1 = model.encode(content['a'])
        embeddingsa2 = model.encode(i['a'])
        #Compute cosine-similarits
        qcosine_scores.append({"q": util.
        pytorch_cos_sim(embeddingsq1, embeddingsq2),
        "a":util.pytorch_cos_sim(embeddingsa1, embeddingsa2)})
        #Output the pairs with their score

    qa_scores = {}

    for i in range(len(d1['content'])):
        qa_scores[i] = qcosine_scores[i]
        # print("{} \t\t {} \t\t Score: {}".format(d1['content'][i], qa, qcosine_scores[i][0][0]))

    print(qa_scores)

    product = []
    for j in qa_scores:
        product.append(qa_scores[j]["q"]*qa_scores[j]["a"])

    print(product)

    index = product.index(max(product))

    recommended = []

    for i in range(index + 1, len(d1['content'])):
        recommended.append(d1['content'][i]['q'])

    resp = Response(json.dumps(recommended))
    resp.status = 200
    resp.headers["Access-Control-Expose-Headers"] = "*"
    return resp       


if __name__ == "__main__":
  app.run(host='127.0.0.1', port=5000, debug=True)