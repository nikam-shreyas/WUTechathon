## Steps to start flask app

Setup :- 
1. python3 -m venv venv 
2. source venv/bin/activate 
3. pip install -r requirements.txt 
4. create a file .flaskenv and add following lines:- \
export FLASK_APP=app.py \
export FLASK_ENV=development 

Start server :- 
1. source venv/bin/activate (If venv is not activated)
2. flask run
