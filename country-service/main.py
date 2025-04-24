from fastapi import FastAPI
import mysql.connector

app = FastAPI()

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="sakila"
    )

@app.get("/countries")
def get_countries():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM country")
    countries = cursor.fetchall()
    conn.close()
    return countries

@app.get("/countries/{id}")
def get_country_by_id(id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM country WHERE country_id = %s", (id,))
    country = cursor.fetchone()
    conn.close()
    return country
