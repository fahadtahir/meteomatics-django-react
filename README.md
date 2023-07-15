**Integrating Meteomatics APIs with Django and React**

This webapp combines Python Django with React FE and Meteomatics Weather APIs to provide a simple interface where users can add custom coordinates and view related weather information. 

Weather information is also shown for all Saudi cities (populated from cities.json) which can be searched using autocomplete. 

**SETUP**
1.    Download MySQL Installer (https://dev.mysql.com/downloads/installer/) and select MYSQL Server 8.0 and install. Setup a root password 'testpassword' and run the server.
   
2. Open any DBMS (https://www.heidisql.com/download.php?download=installer), connect to locahost using 'testpassword' and run 'export.sql' from the repo. DB is now setup
   
3. populate.py is for populating tb_cities with cities.json. (Already populated)

4. Clone repo from github, create a virtual environment and activate it (https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/):
Now run:
	pip install -r requirements.txt
	python manage.py runserver

5. Replace METEOMARICS_USERNAME and METEOMATICS_PASSWORD in settings.py with your own credentials ( create test account at https://www.meteomatics.com/en/weather-api/)

6. Checkout postman collection, https://api.postman.com/collections/19813531-5e237a31-4e08-4901-b467-58872e08d2d6?access_key=PMAT-01GVBCC7ZVZH60EDTCDB6Q3ZFY

To use Signup and Login APIs, save the 'csrf' token from the response header and use it in all CRUD requests in the header as: X-CSRFToken: csrftoken
   
9. Pages: http://127.0.0.1:8000/coordinates
http://127.0.0.1:8000/cities


TODO:
- Due to a version conflict, unable to use UseState in React which caused some issues in CRUD actions. For eg deleting an entry forces page reload.
