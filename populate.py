import mysql.connector
import json
py --
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="testpassword",
  database="db_django"
)


with open('cities.json', 'r', encoding="utf-8") as f:
    data = json.load(f)


mycursor = mydb.cursor()

for record in data:
    sql = "INSERT INTO tb_cities (city_id, region_id, name_ar, name_en, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s)"
    print(record["name_ar"])
    val = (record["city_id"], record["region_id"], record["name_ar"], record["name_en"], record["center"][0], record["center"][1])
    mycursor.execute(sql, val)
    mydb.commit()
