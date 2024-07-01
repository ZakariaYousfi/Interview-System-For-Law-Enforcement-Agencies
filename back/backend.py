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


from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
"""
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
    print("hi")

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

@app.route("/audition", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def contradiction():
    content = request.get_json(silent=True)
    print(content)
    qData = content['qData']
    pData = content['pData']
    pair_ids = []
    # create person now if doesn't exist and get his id  
    # then create a new audition with person id case id person type and get it's id 
    audition_id = add_person_and_create_audition(pData['name'], pData['birthDate'], pData['number'], pData['caseId'], pData['type'])
    for pair in qData:
        # translate to embeddings then insert into pairqa table 
        qembedding = model.encode(pair['q'])
        aembedding = model.encode(pair['a'])
        # based on relation type insert adequate relation 
        if(pair['type'] == 'no'):
            insert_pairqa_with_embeddings(pair['q'], pair['a'], audition_id, qembedding.tolist(), aembedding.tolist())
        elif(pair['type'] == 'pp'):
            # here the word2vec model for relation classification
            insert_pairqa_and_relationpp(audition_id, pair['q'], pair['a'], qembedding.tolist(), aembedding.tolist(), pData['name'], pair['relatedPerson'], pair['a'])
        else:
            pair_id, lieu_id = insert_pairqa_lieu_and_relationpl(audition_id, pair['q'], pair['a'], qembedding.tolist(), aembedding.tolist(), 
                                      pair['wilaya'], pair['daira'], pair['commune'], pData['name'], 
                                      pair['year'], pair['month'], pair['day'], pair['hour'], pair['duration'])
            pair_ids.append([pair_id, lieu_id])
    contradictions = []
    everything = get_relationpl(pData['name'])
    for pairlieuids in pair_ids:
        qapairid = pairlieuids[0]
        lieuid = pairlieuids[1]
    relevant_data = []
    for something in everything:
        (relationplid, dateofextensive, heur, duration, lieuid, qaid, statementmaker, lieuid2, wilaya, daira, commune) = something
        relevant_data.append({ "statementmaker": statementmaker, "year": dateofextensive.year, "month": dateofextensive.month, "day": dateofextensive.day, "heur": heur, "duration": duration, "wilaya": wilaya, "daira": daira, "commune": commune})
    print(relevant_data)
    for releventi in relevant_data:
        if(releventi['duration']>24):
            durationdays = int(releventi['duration']/24)
            durationhours = releventi['duration'] % 24
            releventi['days'] += durationdays
            releventi['duration'] = durationhours
        for releventj in relevant_data:
            if(releventj['duration']>24):
                durationdays = int(releventj['duration']/24)
                durationhours = releventj['duration'] % 24
                releventj['days'] += durationdays
                releventj['duration'] = durationhours
            if(releventi['year'] == releventj['year'] and releventi['month'] == releventj['month'] and releventi['day'] == releventj['day']):
                print('this stuff is tyring')
    contrafound = False
    for pair in qData:
        if(pair['type'] == 'pp'):
            statements = get_relationpp(pData['name'], pair['relatedPerson'])
            data = []
            for statement in statements:
                (relationppid,relation,qaid,statementmakername,relatedpersonname) = statement
                data.append({"name": statementmakername, "related": relatedpersonname, "relation": relation})   
            print(data)
        # based on qtype
        if(pair['type'] == 'pp'):
            for i in range(0,len(data)-1):
                for j in range(1,len(data)):
                    print("pair['a']:",pair['a'])
                    print("data[i]['relation']",data[i]['relation'])
                    print("data[j]['relation']",data[j]['relation'])
                    print("data[i]['name']",data[i]['name'])
                    print("pData['name']",pData['name'])
                    print("data[j]['name']",data[j]['name'])
                    print("data[i]['related']",data[i]['related'])
                    print("pair['relatedPerson']",pair['relatedPerson'])
                    print("data[j]['related']",data[j]['related'])
                    if(data[i]['name'] == pData['name'] and data[j]['name'] == pData['name'] and data[i]['related'] == pair['relatedPerson'] and data[j]['related'] == pair['relatedPerson'] and pair['a'] == data[j]['relation'] and data[i]['relation'] != data[j]['relation']):
                        contrafound = True
                        contradiction = ("يوجد تناقض بين علاقة  " + pData['name'] + " مع " + data[i]['related'] + " : " + data[i]['relation'] + " ضد " + data[j]["relation"] )
                        contradictions.append({"contradiction":contradiction, "name": pData["name"], "related": pair["relatedPerson"], "firstRelation": data[i]['relation'], "secondRelation": data[j]['relation']})
                        break
                    if(contrafound):
                        break
                if(contrafound):
                    break

    print({'contradiction':contradictions,'qData':qData})

    #print(content)
    resp = Response(json.dumps({'contradiction':contradictions,'qData':qData}))
    resp.headers["Access-Control-Expose-Headers"] = "*"
    resp.status = 200
    return resp

@app.route("/auditions", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def get_auditions():
    content = request.get_json(silent=True)
    results = get_auditions_with_pairqas(content)
    print(results)
    resp = Response(json.dumps(results ,indent=4, sort_keys=True, default=str))
    resp.status = 200
    resp.headers["Access-Control-Expose-Headers"] = "*"
    return resp  

if __name__ == "__main__":
  app.run(host='127.0.0.1', port=5000, debug=True)