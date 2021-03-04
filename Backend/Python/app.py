from flask import Flask, request, jsonify
import json
import hashlib
import boto3
import base64
import uuid


app = Flask(__name__)

s3 = boto3.resource('s3',region_name='us-east-2',aws_access_key_id='AKIAQGEZTINBG6FXCMHG',aws_secret_access_key='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')
db = boto3.resource('dynamodb',region_name='us-east-2',aws_access_key_id='AKIAVEMKH4ZBHWPR4M7A',aws_secret_access_key='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')
urlbucket = 'https://practica1-g21-imagenes.s3.us-east-2.amazonaws.com/'

userstable = db.Table('User')
albumtable = db.Table('Albums')
fotostable = db.Table('Fotos')

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
        photo = request.json['foto']

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
                imagen = base64.b64decode(photo)
                nombre = 'Fotos_Perfil/' + str(uuid.uuid4()) + '.jpg'
                s3.Bucket('practica1-g21-imagenes').put_object(Key=nombre,Body=imagen, ContentType="image", ACL='public-read')
                
                userstable.put_item(
                Item={
                    'username':username,
                    'password':encripted.hexdigest(),
                    'fullname':fullname,
                    'photo':urlbucket+nombre
                })

                albumtable.put_item(
                Item={
                    'username':username,
                    'albumName':'Perfil'
                })

                fotostable.put_item(
                Item={
                    'username':username,
                    'albumName':'Perfil',
                    'photo': urlbucket+nombre
                })
                response = {"status":'200', 'creado' : 'true'}
                return jsonify(response)
            except:
                response = {"status":'200', 'creado' : 'false', 'msg':'Ocurrio un error'+str(Exception)}
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
