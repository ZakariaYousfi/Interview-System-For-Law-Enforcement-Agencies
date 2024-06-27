from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask import request, Response
import json
# -*- coding: utf8 -*-
import gensim
import re
import numpy as np
from nltk import ngrams
from utilities import * # import utilities.py module
# Connection parameters - adjust as needed
from dbqueries import *
from datetime import datetime


# Opening JSON file
f1 = open('auditions/a1.json', encoding="utf8")
 
# returns JSON object as 
# a dictionary
d1 = json.load(f1)
 

# Closing file
f1.close()
"""

from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# ============================== 
# ====== Uni-Grams Models ======

t_model = gensim.models.Word2Vec.load('./models/full_uni_cbow_300_twitter.mdl')

father = clean_str(u'ابي')
son = clean_str(u'اخي')

print("الكلمة: " + token)
most_similar = t_model.wv.most_similar( token, topn=10 )
for term, score in most_similar:
    print(term, score)
# get a word vector
word_vector = t_model.wv[ token ]

father_vector = t_model.wv[ father ]
son_vector = t_model.wv[ son ]

relations = {
    "ابي": father_vector,
    "اخي": son_vector,
}
"""
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
    print('hi')
    content = request.get_json(silent=True)
    agent_data = get_agent_by_credentials(content["username"], content["password"])
    (agent_id,username,password,fullname) = agent_data
    agent_affaire = get_affaires_of_agent(agent_id)
    print(agent_affaire)
    affaires = []
    for affaire in agent_affaire:
        (affaire_id, caseType, description, creationdate) = affaire
        affaires.append({"id": affaire_id, "type": caseType, "description": description, "creationdate": creationdate.strftime("%d-%m-%Y") })
    print(affaires)
    if(agent_data):
        resp = Response(json.dumps({"id":agent_id,"name" : fullname, "affaires": affaires, "currentAffaire": 0}))
        resp.headers["Access-Control-Expose-Headers"] = "*"
        resp.status = 200
    else:
        resp = Response()
        resp.status = 401
    return resp

@app.route("/case", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def case_page(opt=None):
    print('hi')
    content = request.get_json(silent=True)
    (affaire_id,temp) = insert_affaire_and_agent(content["caseType"], content["description"], content["agentId"])
    print(affaire_id)
    if(affaire_id):
        resp = Response(json.dumps({"currentAffaire":affaire_id}))
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

    # model translate to embeddings here
    qembedding = model.encode(content["q"])
    aembedding = model.encode(content["a"])
    top_pair, following_pairs  = get_similar_pairqa_with_following_context(content["caseType"], content["auditionType"], qembedding.tolist(), aembedding.tolist())
    recommended = []
    for pair in following_pairs:
        (pair_id, question, answer, auditionId, q_embedding, a_embedding) = pair
        recommended.append(question)
        print(question)
    print(recommended)
    resp = Response(json.dumps(recommended))
    resp.status = 200
    resp.headers["Access-Control-Expose-Headers"] = "*"
    return resp       

@app.route("/contradiction", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def contradiction():
    content = request.get_json(silent=True)
    print("hi")
    print(content)
    resp = Response(json.dumps(content))
    resp.headers["Access-Control-Expose-Headers"] = "*"
    resp.status = 200
    return resp


if __name__ == "__main__":
  app.run(host='127.0.0.1', port=5000, debug=True)