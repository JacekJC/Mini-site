import fastapi
import fastapi.middleware.cors
import sqlite3
import json
import fastapi.responses as api_response


app = fastapi.FastAPI()

origins = ['*']

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

model_database = 'model_db.db'

db = sqlite3.connect(model_database)

class model_class:
    model_id: str
    model_name: str
    model_size: str
    model_price: str
    model_tags: str
    model_thumbnail_img_url: str
    model_highres_img_url: str
    model_creator: str
    model_file_url: str

def create_database_table(new_table):
    cur = db.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS ' + new_table)

def init_database():
    create_database_table('model(model_id INTEGER PRIMARY KEY, model_name, model_size, model_price, model_tags, model_thumbnail_img_url, model_highres_img_url, model_creator, model_file_url, PRIMARYKEYT)')

init_database()

def insert_database_data(table, data):
    db_con = sqlite3.connect(model_database)
    cur = db_con.cursor()
    str_values = '('
    str_data = '(' 
    counter = 0
    print("DATA PRINT: ", data)
    for i in data:
        print(i)
        str_values += "'"+i[1]+ "'"
        str_data += "'" + i[0] + "'"
        if(counter < len(data) - 1):
            str_values += ', '
            str_data += ', '
        else:
            str_values += ')'
            str_data += ')'
        counter += 1
    full_com = 'INSERT INTO model ' + str_data + ' VALUES ' + str_values
    print(full_com)
    cur.execute(full_com)
    #db_con.commit()
    return(full_com)

def test_model_insert():
    val = insert_database_data('model', [['model_id', '1'], ['model_name', 'test_model_3'], ['model_price', '10.99'], ['model_size', '28mm']])
    db_con = sqlite3.connect(model_database)
    print('returning data')
    tcur = db_con.cursor()
    tcur.execute(val)
    db_con.commit()
    print('cursor got')
    res = tcur.execute('SELECT model_name FROM model')
    return json.dumps(res.fetchall())

def update_database_data(table, model_id, data):
    cur = db.cursor()
    str_data = ''
    counter = 0
    for i in data:
        str_data += i[0] + ' = ' + i[1]
        if(counter < len(data)):
            str_data += ', '
        counter += 1
    return str_data
    #cur.execute('INSERT INTO ' + table + '(' + ')')

@app.get('/get_model/{model_id}/thumbnail')
async def get_model_thumbnail(model_id: str):
    actual_url = 'files/' + model_id + "/" + model_id + "_thumbnail.jpg"
    return api_response.FileResponse(actual_url)

@app.get('/get_model/{model_id}')
async def get_model(model_id: str):
    db_con = sqlite3.connect(model_database)
    cur = db_con.cursor()
    res = cur.execute('SELECT model_id, model_name, model_price, model_size FROM model WHERE model_id = ' + model_id).fetchall()
    return res

@app.post('/post_model/')
async def post_model(request: fastapi.Request):
    req_data = request.json()
    insert_database_data('model', req_data)
    return "new model created"

@app.get('/models/{filter}/{count}/{index}')
async def get_x_models_with_tags(filter: str, count: str, index: str):
    i_count = int(count)
    i_index = int(index)
    db_con = sqlite3.connect(model_database)
    cur = db_con.cursor()
    print('SELECT model_id, model_name, model_price FROM model OFFSET ' + index + ' LIMIT ' + count)
    res = cur.execute('SELECT model_id, model_name, model_price FROM model').fetchall()
    new_index = res[len(res)-1]
    #OFFSET ' + index + ' LIMIT ' + count
    return [res]
