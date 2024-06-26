import psycopg2
from psycopg2 import sql
from datetime import date, timedelta
import random

# Connection parameters - adjust as needed
conn_params = {
    "dbname": "auditionDB",
    "user": "postgres",
    "password": "postgres",
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
                (1, 'John Doe', '1990-01-01', 123456),
                (2, 'Jane Smith', '1985-05-15', 789012)
            """)

            # Insert Affaire data
            cur.execute("""
                INSERT INTO Affaire (affaireID, caseType, description, creationDate)
                VALUES 
                (1, 'جريمة الكترونية', 'Cybercrime case', '2023-01-01'),
                (2, 'قتل', 'Murder case', '2023-02-15')
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

def get_relationpl(statement_maker_id, qa_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM relationPL
                WHERE statementMakerID = %s AND qaID = %s
            """, (statement_maker_id, qa_id))
            return cur.fetchone()

def get_relationpp(statement_maker_id, qa_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM relationPP
                WHERE statementMakerID = %s AND qaID = %s
            """, (statement_maker_id, qa_id))
            return cur.fetchone()

def insert_affaire_and_agent(case_type, description, agent_id):
    with connect_db() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO Affaire (caseType, description, creationDate)
                VALUES (%s, %s, %s)
                RETURNING affaireID
            """, (case_type, description, date.today()))
            affaire_id = cur.fetchone()[0]

            cur.execute("""
                INSERT INTO AgentAffaire (agentID, affaireID)
                VALUES (%s, %s)
            """, (agent_id, affaire_id))

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
                    (pq.qembedding <-> %s::vector(384)) +
                    (pq.aembedding <-> %s::vector(384))
                LIMIT 5
            """, (case_type, person_type, q_embedding, a_embedding))
            return cur.fetchall()

# Example usage
if __name__ == "__main__":
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