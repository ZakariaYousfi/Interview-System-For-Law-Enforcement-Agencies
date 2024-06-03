import json

# Opening JSON file
f1 = open('/auditions/a1.json', encoding="utf8")
f2 = open('/auditions/a2.json', encoding="utf8")
 
# returns JSON object as 
# a dictionary
d1 = json.load(f1)
d2 = json.load(f2)
 

# Closing file
f1.close()
f2.close()

qa = d2['content'][-1]

from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

qcosine_scores = []
for i in d1['content']:
    embeddings1 = model.encode(qa['q'])
    embeddings2 = model.encode(i['a'])
    #Compute cosine-similarits
    qcosine_scores.append(util.pytorch_cos_sim(embeddings1, embeddings2))
    #Output the pairs with their score

for i in range(len(d1['content'])):
    print("{} \t\t {} \t\t Score: {}".format(d1['content'][i], qa, qcosine_scores[i][0][0]))


