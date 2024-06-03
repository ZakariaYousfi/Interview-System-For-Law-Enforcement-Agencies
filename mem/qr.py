import json

# Opening JSON file
f1 = open('auditions/a1.json', encoding="utf8")
f2 = open('auditions/a2.json', encoding="utf8")
 
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
    embeddingsq1 = model.encode(qa['q'])
    embeddingsq2 = model.encode(i['q'])
    embeddingsa1 = model.encode(qa['a'])
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

print(product.index(max(product)))
