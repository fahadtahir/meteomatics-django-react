import mysql.connector
import json
py --
mydb = mysql.connector.connect(
  host="34.122.18.195",
  user="root",
  password="nmcpass",
  database="db-nmc"
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
