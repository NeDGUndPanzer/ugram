from flask import Flask, request, jsonify
import json
import hashlib
import boto3


app = Flask(__name__)

db = boto3.resource('dynamodb',region_name='us-east-2',aws_access_key_id='',aws_secret_access_key='')
userstable = db.Table('User')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/iniciarSesion', methods = ['POST'])
def iniciarSesion():
    if request.method == 'POST':
        username = request.json['username']
        passwd = request.json['password']
        encripted = hashlib.md5(passwd.encode())

        try:
            res = userstable.get_item(
            Key = {
                "username":username
            })
            item = res['Item']
            encriptedRecived = item['password']
            
            if encripted.hexdigest() == encriptedRecived:
                response = {"status":'200', 'login' : 'true'}
                return jsonify(response)
            else:
                response = {"status":'200', 'login' : 'false', 'msg':'Contrasena incorrecta'}
                return jsonify(response)
        except KeyError:
            response = {"status":'200', 'login' : 'false', 'msg':'No existe el usuario'}
            return jsonify(response)
    else:
        return "No post"

@app.route('/registrar',methods = ['POST'])
def registrarUsuario():
    if request.method == 'POST':
        username = request.json['username']
        passwd = request.json['password']
        encripted = hashlib.md5(passwd.encode())
        fullname = request.json['fullname']
        photo = request.json['photo']
        try:
            res = userstable.get_item(
            Key = {
                "username":username
            })
            prueba = res['Item']
            existe = prueba['username']
            response = {"status":'200', 'creado' : 'false', 'msg':'El usuario ya existe'}
            return jsonify(response)
        except KeyError:
            try:
                res = userstable.put_item(
                Item={
                    'username':username,
                    'password':encripted.hexdigest(),
                    'fullname':fullname,
                    'photo':photo
                })
                response = {"status":'200', 'creado' : 'true'}
                return jsonify(response)
            except:
                response = {"status":'200', 'creado' : 'false'}
                return jsonify(response)

@app.route('/update',methods = ['PUT'])
def updateUser():
    if request.method == 'PUT':
        username = request.json['username']
        usernameE = request.json['newuser']
        fullname = request.json['fullname']
        photo = request.json['photo']

        try:
            res = userstable.get_item(
            Key = {
                "username":username
            })
            item = res['Item']
            pwd = item['password']
            userstable.delete_item(
            Key={
                'username': username
            })
            userstable.put_item(
            Item={
                'username':usernameE,
                'password':pwd,
                'fullname':fullname,
                'photo':photo
            })
            response = {"status":'200', 'actualizado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'actualizado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/delete',methods = ['DELETE'])
def eliminarUser():
    if request.method == 'DELETE':
        username = request.json['username']
        try:
            userstable.delete_item(
            Key={
                'username': username
            })
            response = {"status":'200', 'eliminado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'eliminado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

if __name__ == '__main__':
    app.run()
