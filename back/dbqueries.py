import psycopg2
from psycopg2 import sql
from datetime import date, timedelta
import random
from psycopg2.extras import RealDictCursor
# Connection parameters - adjust as needed
conn_params = {
    "dbname": "auditionDB",
    "user": "postgres",
    "password": "abcdabcd",
    "host": "localhost"
}

def connect_db():
    return psycopg2.connect(**conn_params)

def insert_dummy_data():
    with connect_db() as conn:
        with conn.cursor() as cur:
            # Insert Person data
            cur.execute("""
                INSERT INTO Person (personID, fullname, birthday, number)
                VALUES 
                (1,'بلماضي شعيب', '1970-01-01', 123456),
                (2, 'زرقاوي خيثر', '1970-10-15', 789012)
            """)

            # Insert Affaire data
            cur.execute("""
                INSERT INTO Affaire (affaireID, caseType, description, creationDate)
                VALUES 
                (1, 'قتل', 'Murder case', '2023-02-15')
                (2, 'جريمة الكترونية', 'Cybercrime case', '2023-01-01'),
            """)

            # Insert Audition data
            cur.execute("""
                INSERT INTO Audition (auditionID, personType, creationDate, affaireID, personID)
                VALUES 
                (1, 'مشتبه به', '2023-01-05', 1, 1),
                (2, 'شاهد', '2023-02-20', 2, 2)
            """)

            # Insert PairQA data
            cur.execute("""
                INSERT INTO PairQA (pairID, question, answer, auditionID, qembedding, aembedding)
                VALUES 
                (1, 'Where were you on the night of the incident?', 'I was at home', 1, ARRAY[0.1, 0.2, 0.3]::vector(384), ARRAY[0.4, 0.5, 0.6]::vector(384)),
                (2, 'Did you see anything suspicious?', 'No, I didn\'t', 2, ARRAY[0.7, 0.8, 0.9]::vector(384), ARRAY[1.0, 1.1, 1.2]::vector(384))
            """)

            # Insert Lieu data
            cur.execute("""
                INSERT INTO Lieu (lieuID, wilaya, daira, commune)
                VALUES 
                (1, 'Algiers', 'Bab El Oued', 'Casbah'),
                (2, 'Oran', 'Bir El Djir', 'Hassi Bounif')
            """)

            # Insert Agent data
            cur.execute("""
                INSERT INTO Agent (agentID, username, pass, fullname)
                VALUES 
                (1, 'agent1', 'pass1', 'Agent One'),
                (2, 'agent2', 'pass2', 'Agent Two')
            """)

            # Insert AgentAffaire data
            cur.execute("""
                INSERT INTO AgentAffaire (agentAffaireID, agentID, affaireID)
                VALUES 
                (1, 1, 1),
                (2, 2, 2)
            """)

            # Insert relationPP data
            cur.execute("""
                INSERT INTO relationPP (relationPPID, statementMakerID, relatedPersonID, auditionID, relation, qaID)
                VALUES 
                (1, 1, 2, 1, 'Acquaintance', 1)
            """)

            # Insert relationPL data
            cur.execute("""
                INSERT INTO relationPL (relationPLID, existanceDate, heur, duration, statementMakerID, lieuID, qaID)
                VALUES 
                (1, '2023-01-01', 14, 120, 1, 1, 1)
            """)

def get_affaires_of_agent(agent_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT a.* FROM Affaire a
                JOIN AgentAffaire aa ON a.affaireID = aa.affaireID
                WHERE aa.agentID = %s
            """, (agent_id,))
            return cur.fetchall()

def get_auditions_of_affaire(affaire_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Audition
                WHERE affaireID = %s
            """, (affaire_id,))
            return cur.fetchall()

def get_audition_with_pairqas_and_person(audition_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT a.*, p.*, pq.*
                FROM Audition a
                JOIN Person p ON a.personID = p.personID
                LEFT JOIN PairQA pq ON a.auditionID = pq.auditionID
                WHERE a.auditionID = %s
            """, (audition_id,))
            return cur.fetchall()

def insert_audition_and_pairqa(person_id, affaire_id, person_type, question, answer):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO Audition (personID, affaireID, personType, creationDate)
                VALUES (%s, %s, %s, %s)
                RETURNING auditionID
            """, (person_id, affaire_id, person_type, date.today()))
            audition_id = cur.fetchone()[0]

            cur.execute("""
                INSERT INTO PairQA (question, answer, auditionID)
                VALUES (%s, %s, %s)
            """, (question, answer, audition_id))


def insert_relationpl(existence_date, hour, duration, statement_maker_id, lieu_id, qa_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO relationPL (existanceDate, heur, duration, statementMakerID, lieuID, qaID)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (existence_date, hour, duration, statement_maker_id, lieu_id, qa_id))

def insert_relationpp(statement_maker_id, related_person_id, audition_id, relation, qa_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO relationPP (statementMakerID, relatedPersonID, auditionID, relation, qaID)
                VALUES (%s, %s, %s, %s, %s)
            """, (statement_maker_id, related_person_id, audition_id, relation, qa_id))

def get_agent_by_credentials(username, password):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM Agent
                WHERE username = %s AND pass = %s
            """, (username, password))
            return cur.fetchone()
            
def get_relationpl(statementMakerName):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT rpl.*, li.* 
                FROM relationPL rpl
                JOIN Lieu li ON rpl.lieuid = li.lieuid
                WHERE statementMakerName = %s
            """, (statementMakerName,))
            return cur.fetchall()

def get_relationpp(statementMakerName, relatedPersonName):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM relationPP 
                WHERE statementMakerName = %s AND relatedPersonName = %s
            """, (statementMakerName, relatedPersonName))
            return cur.fetchall()

def insert_affaire_and_agent(case_type, description, agent_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO Affaire (caseType, description, creationDate)
                VALUES (%s, %s, %s)
                RETURNING affaireID
            """, (case_type, description, date.today()))
            affaire = cur.fetchone()
            affaire_id = affaire[0]

            cur.execute("""
                INSERT INTO AgentAffaire (agentID, affaireID)
                VALUES (%s, %s)
            """, (agent_id, affaire_id))

            return affaire

def add_agent_to_affaire_by_username(username, affaire_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO AgentAffaire (agentID, affaireID)
                SELECT agentID, %s
                FROM Agent
                WHERE username = %s
            """, (affaire_id, username))

def add_agent(username, password, fullname):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO Agent (username, pass, fullname)
                VALUES (%s, %s, %s)
            """, (username, password, fullname))

def modify_agent(agent_id, new_username, new_password, new_fullname):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE Agent
                SET username = %s, pass = %s, fullname = %s
                WHERE agentID = %s
            """, (new_username, new_password, new_fullname, agent_id))

def delete_agent(agent_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM Agent
                WHERE agentID = %s
            """, (agent_id,))

def get_similar_pairqa(case_type, person_type, q_embedding, a_embedding):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT pq.* FROM PairQA pq
                JOIN Audition a ON pq.auditionID = a.auditionID
                JOIN Affaire af ON a.affaireID = af.affaireID
                WHERE af.caseType = %s AND a.personType = %s
                ORDER BY 
                    (pq.qembedding <=> %s::vector) *
                    (pq.aembedding <=> %s::vector)
                LIMIT 5
            """, (case_type, person_type, q_embedding, a_embedding))
            return cur.fetchall()

def get_similar_pairqa_with_following_context(case_type, person_type, q_embedding, a_embedding):
    with connect_db() as conn:
        with conn.cursor() as cur:
            # First, get the most similar pair
            cur.execute("""
                SELECT pq.* FROM PairQA pq
                JOIN Audition a ON pq.auditionID = a.auditionID
                JOIN Affaire af ON a.affaireID = af.affaireID
                WHERE af.caseType = %s AND a.personType = %s
                ORDER BY 
                    (pq.qembedding <=> %s::vector) *
                    (pq.aembedding <=> %s::vector)
                LIMIT 1
            """, (case_type, person_type, q_embedding, a_embedding))
            
            top_pair = cur.fetchone()
            
            if top_pair is None:
                return None, []
            
            # Now, get all pairs from the same audition that come after the top pair
            cur.execute("""
                SELECT pq.* FROM PairQA pq
                WHERE pq.auditionID = %s AND pq.pairID > %s
                ORDER BY pq.pairID
            """, (top_pair[3], top_pair[0]))  # Assuming auditionID is the 4th column and pairID is the 1st column in PairQA
            
            following_pairs = cur.fetchall()
            
            return top_pair, following_pairs


def insert_pairqa_with_embeddings(question, answer, audition_id, q_embedding, a_embedding):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO PairQA (question, answer, auditionID, qembedding, aembedding)
                VALUES (%s, %s, %s, %s::vector, %s::vector)
            """, (question, answer, audition_id, q_embedding, a_embedding))

def add_person_and_create_audition(fullname, birthday, number, case_id, person_type):
    with connect_db() as conn:
        with conn.cursor() as cur:
            # Check if person exists
            cur.execute("SELECT personID FROM Person WHERE fullname = %s", (fullname,))
            person = cur.fetchone()
            
            if person is None:
                # Person doesn't exist, so add them
                cur.execute("""
                    INSERT INTO Person (fullname, birthday, number)
                    VALUES (%s, %s, %s)
                    RETURNING personID
                """, (fullname, birthday, number))
                person_id = cur.fetchone()[0]
            else:
                person_id = person[0]
            
            # Create audition
            cur.execute("""
                INSERT INTO Audition (personType, creationDate, affaireID, personID)
                VALUES (%s, %s, %s, %s)
                RETURNING auditionID
            """, (person_type, date.today(), case_id, person_id))
            
            audition_id = cur.fetchone()[0]
            
            conn.commit()
            return audition_id
        
def insert_pairqa_and_relationpp(audition_id, question, answerص, q_embedding, a_embedding, statement_maker_name, related_person_name, relation):
    with connect_db() as conn:
        with conn.cursor() as cur:
            # Insert PairQA
            cur.execute("""
                INSERT INTO PairQA (question, answer, auditionID, qembedding, aembedding)
                VALUES (%s, %s, %s, %s::vector, %s::vector)
                RETURNING pairID
            """, (question, answer,audition_id, q_embedding, a_embedding))
            pair_id = cur.fetchone()[0]
            
            # Insert relationPP
            cur.execute("""
                INSERT INTO relationPP (relation, qaID, statementMakerName, relatedPersonName)
                VALUES (%s, %s, %s, %s)
            """, (relation, pair_id, statement_maker_name, related_person_name))
            
            conn.commit()
            return pair_id

def insert_pairqa_lieu_and_relationpl(audition_id, question, answer, q_embedding, a_embedding, 
                                      wilaya, daira, commune, statement_maker_name, 
                                      year, month, day, heur, duration):
    with connect_db() as conn:
        with conn.cursor() as cur:
            # Insert PairQA
            cur.execute("""
                INSERT INTO PairQA (question, answer, auditionID, qembedding, aembedding)
                VALUES (%s, %s, %s, %s::vector, %s::vector)
                RETURNING pairID
            """, (question, answer,audition_id, q_embedding, a_embedding))
            pair_id = cur.fetchone()[0]
            
            # Insert Lieu
            cur.execute("""
                INSERT INTO Lieu (wilaya, daira, commune)
                VALUES (%s, %s, %s)
                RETURNING lieuID
            """, (wilaya, daira, commune))
            lieu_id = cur.fetchone()[0]
            
            # Construct the date from year, month, day
            existence_date = date(int(year), int(month), int(day))
            
            # Insert relationPL
            cur.execute("""
                INSERT INTO relationPL (existanceDate,heur, duration, statementMakerName, lieuID, qaID)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (existence_date,heur, duration, statement_maker_name, lieu_id, pair_id))
            
            conn.commit()
            return pair_id, lieu_id
        
def get_auditions_with_pairqas(current_affaire_id):
    with connect_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # First, get all auditions for the given affaire
            cur.execute("""
                SELECT * FROM Audition
                WHERE affaireID = %s
                ORDER BY auditionID
            """, (current_affaire_id,))
            auditions = cur.fetchall()

            # For each audition, get its PairQAs
            for audition in auditions:
                cur.execute("""
                    SELECT pairid, question, answer, auditionid FROM PairQA
                    WHERE auditionID = %s
                    ORDER BY pairID
                """, (audition['auditionid'],))
                audition['pairqas'] = cur.fetchall()

            return auditions
"""
from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
"""

content = [
    {
      "q": "ما اسمك الكامل",
      "a": "بلماضي شعيب"
    },
    {
        "q": "ما يكون لك بلماضي سمير",
        "a": "اخي"
      },
      {
        "q": "ملك من هذا السكين",
        "a": "ملكي"
      },
      {
        "q": "هل يمكنك تفسير لماذا وجد في مسرح الجريمة",
        "a": "لا ادري"
      },
      {
        "q": "من الذي أحضره",
        "a": "لا اعرف"
      }
  ]

auditionId = 1
"""
for pair in content:
        qembeddings = model.encode(pair["q"])
        aembeddings = model.encode(pair["a"])
        insert_pairqa_with_embeddings(pair['q'],pair['a'], auditionId, qembeddings.tolist(), aembeddings.tolist())
"""
qa =      {
        "q": "ملك من هذا السكين",
        "a": "ملكي"
      }

caseType = "قتل"

personType = "مشتبه به"
# Example usage
if __name__ == "__main__":
    """
    qembedding = model.encode(qa["q"])
    aembedding = model.encode(qa["a"])
    # Get similar PairQA with context
    top_pair, following_pairs  = get_similar_pairqa_with_following_context(caseType,personType, qembedding.tolist(), aembedding.tolist())
    
    if top_pair:
        print("Top Pair:", top_pair)
        print("Context Pairs:")
        for pair in following_pairs:
            print(pair)
    else:
        print("No matching pairs found.")
    
    """
    """
    insert_dummy_data()
    print(get_affaires_of_agent(1))
    print(get_auditions_of_affaire(1))
    print(get_audition_with_pairqas_and_person(1))
    insert_audition_and_pairqa(1, 1, 'مشتبه به', 'New question?', 'New answer')
    insert_relationpl(date.today(), 15, 60, 1, 1, 1)
    insert_relationpp(1, 2, 1, 'Colleague', 1)
    print(get_agent_by_credentials('agent1', 'pass1'))
    print(get_relationpl(1, 1))
    print(get_relationpp(1, 1))
    insert_affaire_and_agent('سرقة', 'Theft case', 1)
    add_agent_to_affaire_by_username('agent2', 1)
    add_agent('newagent', 'newpass', 'New Agent')
    modify_agent(1, 'agent1_modified', 'newpass1', 'Agent One Modified')
    delete_agent(2)
    print(get_similar_pairqa('جريمة الكترونية', 'مشتبه به', [0.1, 0.2, 0.3], [0.4, 0.5, 0.6]))
    """