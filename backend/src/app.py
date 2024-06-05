import os
from flask import Flask, jsonify, request, session, redirect, url_for, send_from_directory
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS 
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from functools import wraps
import time

app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://localhost/catcafe'
mongo = PyMongo(app)

CORS(app, supports_credentials=True)    
app.config['SECRET_KEY'] = "1414zZ"  # Clave secreta para la sesión
app.config['SESSION_COOKIE_SECURE'] = True
app.config['UPLOAD_FOLDER'] = '/home/jeremy/Documents/TFG/frontend/tfg/src/images'
app.static_folder = '/home/jeremy/Documents/TFG/frontend/tfg/src/components'
db = mongo.db.users
cat_db = mongo.db.cats
cafe_db = mongo.db.cafe
adoptions_db = mongo.db.adoptions

@app.route('/static/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd(), 'frontend')
    return send_from_directory(os.path.join(root_dir, 'components'), filename)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'email' not in session:
            return jsonify({'error': 'Acceso no autorizado. Por favor inicia sesión.'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

@app.route('/register', methods=['POST'])
def register():
    data = request.json

    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Todos los campos son requeridos'}), 400
    
    if not data['name'] or not data['email'] or not data['password']:
        return jsonify({'error': 'Todos los campos deben ser rellenados.'}), 400
    
    if len(data['password']) < 8:
        return jsonify({'error': 'La contraseña debe ser de almenos 8 caractéres de largo.'}), 400
    
    existing_user = db.find_one({'email': data['email']})
    if existing_user:
        return jsonify({'error': 'El correo ya existe.'}), 400

    hashed_password = generate_password_hash(data['password'])
    new_user = {
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password,
        'admin': False,
    }
    db.insert_one(new_user)
    
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    user = db.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        session['user_id'] = str(user['_id'])
        session['name'] = str(user['name'])
        session['email'] = str(user['email'])
        session['admin'] = str(user['admin'])
        return jsonify({
            'id': session['user_id'],
            'email': session['email'],
            'name': session['name'],
            'admin': session['admin'],
            'message': 'Login successful',
        }), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401


@app.route('/my-profile', methods=['GET'])
def my_profile():
    if 'email' in session:
        user = db.find_one({'email': session['email']})

        if user:
            return jsonify({
                    'email': user['email'],
                    'name': user['name'],
                    'message': 'Profile succesful',
            }), 200
        else:
            return jsonify({
            'message': 'User not found'
        })

# Ruta para cerrar sesión
@app.route('/logout', methods=['GET'])
def logout():
    print(session)
    session.pop('user_id', None)
    session.pop('name', None)
    session.pop('email', None)
    session.pop('password', None)
    print(session)

    return jsonify({'message': 'Logged out successfully'})

@app.route('/change-password', methods=['PUT'])
def change_password():
    if 'email' not in session:
        return jsonify({'error': 'No hay sesión iniciada'}), 401

    email = session['email']
    new_password = request.json.get('newPassword')

    if not new_password:
        return jsonify({'error': 'Se requiere una nueva contraseña'}), 400

    hashed_password = generate_password_hash(new_password)
    db.update_one({'email': email}, {'$set': {'password': hashed_password}})

    return jsonify({'message': 'Contraseña cambiada exitosamente'}), 200

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Verificar si el usuario está autenticado
        if 'email' not in session:
            return jsonify({'error': 'Acceso no autorizado. Por favor inicia sesión.'}), 401
        
        # Verificar si el usuario tiene permisos de administrador
        user = db.find_one({'email': session['email']})
        if not user or not user.get('admin'):
            return jsonify({'error': 'Acceso denegado. Se requieren permisos de administrador.'}), 403
        
        # Si pasa las verificaciones, permitir el acceso a la ruta protegida
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin/users', methods=['GET'])
@admin_required
def get_users():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password'],
            'admin': doc['admin']
        })

    return jsonify(users)

@app.route('/admin/user/<id>', methods=['GET'])
@admin_required
def getUser(id):
    user = db.find_one({'_id': ObjectId(id)})

    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password'],
        'admin': user['admin']
    })

@app.route('/admin/users/<id>', methods=['DELETE'])
@admin_required
def deleteUser(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'User deleted'})

@app.route('/admin/users/<id>', methods=['PUT'])
def updateUser(id):
    new_password = request.json['password']
    if len(new_password) > 0:
        if len(new_password) < 8:
            return jsonify({'error': 'La contraseña debe ser de almenos 8 caractéres de largo.'})
        else:
            hashed_password = generate_password_hash(new_password)
            db.update_one({'_id': ObjectId(id)}, {'$set': {
                'name': request.json['name'],
                'email': request.json['email'],
                'password': hashed_password,
                'admin': request.json['admin']
            }})
            return jsonify({'msg': 'User Updated'})
    else:
            hashed_password = generate_password_hash(new_password)
            db.update_one({'_id': ObjectId(id)}, {'$set': {
                'name': request.json['name'],
                'email': request.json['email'],
                'admin': request.json['admin']
            }})
            return jsonify({'msg': 'User Updated'})

@app.route('/admin/users', methods=['POST'])
def createUser():
    data = request.json

    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Todos los campos son requeridos'}), 400
    
    if not data['name'] or not data['email'] or not data['password']:
        return jsonify({'error': 'Todos los campos deben ser rellenados.'}), 400
    
    if len(data['password']) < 8:
        return jsonify({'error': 'La contraseña debe ser de almenos 8 caractéres de largo.'}), 400
    
    existing_user = db.find_one({'email': data['email']})
    if existing_user:
        return jsonify({'error': 'El correo ya existe.'}), 400
    
    new_password = request.json['password']
    hashed_password = generate_password_hash(new_password)
    id = db.insert_one({
        'name': request.json['name'],
        'email': request.json['email'],
        'password': hashed_password,
        'admin': request.json['admin']
    })
    return jsonify(str(ObjectId(id.inserted_id)))

@app.route('/admin/checkAdminStatus', methods=['GET'])
def get_admin_status():
    if 'email' in session:
        user = db.find_one({'email': session['email']})
        if user:
            return jsonify({'admin': user.get('admin', False)})
        else:
            return jsonify({'admin': False})
    else:
        return jsonify({'admin': False})
    
#CRUD CATS
    
@app.route('/images/<filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/admin/cats', methods=['POST'])
def create_cat():
    image_file = request.files['image_url']

    if image_file:
        filename = secure_filename(image_file.filename)
        image_filename = f"{ObjectId()}.{filename.split('.')[-1]}"
        image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))

        print(image_filename)
        cat_db.insert_one({
            'cat_id': str(ObjectId()),  # Generar automáticamente un nuevo ObjectId para cat_id
            'name': request.form['name'],
            'description': request.form['description'],
            'age': request.form['age'],
            'breed': request.form['breed'],
            'image_url': str(image_filename)
        })

        return jsonify({'msg': 'Cat created successfully'})

@app.route('/admin/cats', methods=['GET'])
@admin_required
def get_admin_cats():
    
    cats = []  
    for doc in cat_db.find():
        cat_id = str(ObjectId(doc['_id']))
        image_filename = doc['image_url']
        image_url = url_for('get_image', filename=image_filename)
        
        cats.append({
            '_id': cat_id,
            'name': doc['name'],
            'description': doc['description'],
            'age': doc['age'],
            'breed': doc['breed'],
            'image_url': image_url
        })
        print(image_url)

    return jsonify(cats)

@app.route('/admin/cat/<id>', methods=['GET'])
@admin_required
def get_cat(id):
    cat = cat_db.find_one({'_id': ObjectId(id)})

    return jsonify({
        '_id': str(ObjectId(cat['_id'])),
        'name': cat['name'],
        'description': cat['description'],
        'age': cat['age'],
        'breed': cat['breed']
    })

@app.route('/admin/cat/<id>', methods=['DELETE'])
@admin_required
def delete_cat(id):
    cat_db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Cat deleted'})

@app.route('/admin/cat/<id>', methods=['PUT'])
def update_cat(id):

    if 'image_url' in request.files:
        image_file = request.files['image_url']
        filename = secure_filename(image_file.filename)
        image_filename = f"{ObjectId()}.{filename.split('.')[-1]}"
        image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
        image_url = str(image_filename)
    else:
        cat = cat_db.find_one({'_id': ObjectId(id)})
        cat_image = cat['image_url']
        print(cat_image)
        image_url = str(cat_image)
        
    cat_db.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.form['name'],
        'description': request.form['description'],
        'age': request.form['age'],
        'breed': request.form['breed'],
        'image_url': image_url
    }})
    return jsonify({'msg': 'User Updated'})

@app.route('/cats', methods=['GET'])
def get_cats():
    
    cats = []  
    for doc in cat_db.find():
        cat_id = str(ObjectId(doc['_id']))
        image_filename = doc['image_url']
        image_url = url_for('get_image', filename=image_filename)
        
        cats.append({
            'cat_id': cat_id,
            'name': doc['name'],
            'description': doc['description'],
            'age': doc['age'],
            'breed': doc['breed'],
            'image_url': image_url
        })
        print(image_url)

    return jsonify(cats)

@app.route('/cat/<id>', methods=['GET'])
def set_cat(id):
    print(id)
    cat = cat_db.find_one({'_id': ObjectId(id)})
    image_filename = cat['image_url']
    image_url = url_for('get_image', filename=image_filename)

    return jsonify({
        '_id': str(ObjectId(cat['_id'])),
        'cat_id': cat['cat_id'],
        'image_url': image_url,
        'name': cat['name'],
        'description': cat['description'],
        'age': cat['age'],
        'breed': cat['breed']
    })
@app.route('/admin/cafes', methods=['POST'])
def create_cafe():
    image_file = request.files['image_url']

    if image_file:
        filename = secure_filename(image_file.filename)
        image_filename = f"{ObjectId()}.{filename.split('.')[-1]}"
        image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))

        cafe_db.insert_one({
            'cafe_id': str(ObjectId()),  # Generar automáticamente un nuevo ObjectId para cafe_id
            'name': request.form['name'],
            'description': request.form['description'],
            'price': request.form['price'],
            'image_url': str(image_filename)
        })

        return jsonify({'msg': 'Coffee created successfully'})

@app.route('/admin/cafes', methods=['GET'])
@admin_required
def get_admin_cafes():
    
    cafes = []  
    for doc in cafe_db.find():
        cafe_id = str(ObjectId(doc['_id']))
        image_filename = doc['image_url']
        image_url = url_for('get_image', filename=image_filename)
        
        cafes.append({
            '_id': cafe_id,
            'name': doc['name'],
            'description': doc['description'],
            'price': doc['price'],
            'image_url': image_url
        })

    return jsonify(cafes)

@app.route('/admin/cafe/<id>', methods=['GET'])
@admin_required
def get_cafe(id):
    cafe = cafe_db.find_one({'_id': ObjectId(id)})

    return jsonify({
        '_id': str(ObjectId(cafe['_id'])),
        'name': cafe['name'],
        'description': cafe['description'],
        'price': cafe['price'],
    })

@app.route('/admin/cafe/<id>', methods=['DELETE'])
@admin_required
def delete_cafe(id):
    cafe_db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Cafe deleted'})

@app.route('/admin/cafe/<id>', methods=['PUT'])
@admin_required
def update_cafe(id):
    if 'image_url' in request.files:
        image_file = request.files['image_url']
        filename = secure_filename(image_file.filename)
        image_filename = f"{ObjectId()}.{filename.split('.')[-1]}"
        image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
        image_url = str(image_filename)
    else:
        cafe = cafe_db.find_one({'_id': ObjectId(id)})
        cafe_image = cafe['image_url']
        image_url = str(cafe_image)

    cafe_db.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.form['name'],
        'description': request.form['description'],
        'price': request.form['price'],
        'image_url': image_url
    }})
    return jsonify({'msg': 'Cafe Updated'})

@app.route('/cafes', methods=['GET'])
def get_coffees():
    
    cafes = []  
    for doc in cafe_db.find():
        cafe_id = str(ObjectId(doc['_id']))
        image_filename = doc['image_url']
        image_url = url_for('get_image', filename=image_filename)
        
        cafes.append({
            'cafe_id': cafe_id,
            'name': doc['name'],
            'description': doc['description'],
            'image': image_url,
            'price': doc['price'],
        })
        print(image_url)

    return jsonify(cafes)

@app.route('/cats/form', methods=['POST'])
def set_cats_form():
    data = request.json

    new_adoption = {
        'user_name': data['userName'],
        'user_mail': data['userMail'],
        'user_age': data['userAge'],
        'user_phone': data['userPhone'],
        'user_reason': data['userReason'],
        'cat_id': data['catID'],
        'cat_name': data['catName'],
    }
    adoptions_db.insert_one(new_adoption)
    
    return jsonify({'message': 'Adoption registered successfully'})

@app.route('/admin/adoptions', methods=['GET'])
def get_cats_adoptions():
    adoptions = []  
    for doc in adoptions_db.find():
        adoption_id = str(ObjectId(doc['_id']))        
        adoptions.append({
            '_id': adoption_id,
            'user_name': doc['user_name'],
            'user_mail': doc['user_mail'],
            'user_age': doc['user_age'],
            'user_phone': doc['user_phone'],
            'user_reason': doc['user_reason'],
            'cat_id': doc['cat_id'],
            'cat_name': doc['cat_name'],
        })

    return jsonify(adoptions)

@app.route('/admin/adoption/<id>', methods=['DELETE'])
@admin_required
def delete_adoptions(id):
    adoptions_db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Adoption deleted'})

if __name__ == "__main__":
    app.run(debug=True)
