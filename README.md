# ncm-task
NCM Task



1. MySQL DB is already setup on Google Cloud SQL. To view from any DBMS:
   
   IP: 34.122.18.195
   username: root
   password: testpassword
   
2. populate.py is for populating tb_cities with cities.json. (Already populated)

3. Clone repo from github, create a virtual environment and activate it (https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/):
	Now run:
	
	pip install -r requirements.txt
	python manage.py runserver

4. Goto postman collection, https://api.postman.com/collections/19813531-5e237a31-4e08-4901-b467-58872e08d2d6?access_key=PMAT-01GVBCC7ZVZH60EDTCDB6Q3ZFY

   use Signup and Login APIs and save the 'csrf' token from the response header and use it in all CRUD requests in the header as:
   X-CSRFToken: csrftoken
   
   use CRUD APIs

5. Goto http://127.0.0.1:8000/coordinates

6. Goto http://127.0.0.1:8000/cities

(Application might be a bit slow due to DB connection)




TODO (time constraint):

- Due to a version conflict, unable to use UseState in React which caused some issues in CRUD actions. For eg deleting an entry forces page reload. Need more time to fix.

- Weather Charts. Didn't receive Test Credentials from MetX yet.

- More stylish css

. (Optional) create an authentication module. (React)

   

