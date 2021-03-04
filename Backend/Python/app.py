from flask import Flask, request, jsonify
import json
import hashlib
import boto3
from boto3.dynamodb.conditions import Key, Attr
import base64
import uuid


app = Flask(__name__)

s3 = boto3.resource('s3',region_name='us-east-2',aws_access_key_id='',aws_secret_access_key='')
db = boto3.resource('dynamodb',region_name='us-east-2',aws_access_key_id='',aws_secret_access_key='')
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
                nombre = subirImagen(photo)
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
                    'imgurl': urlbucket+nombre
                })
                response = {"status":'200', 'creado' : 'true'}
                return jsonify(response)
            except:
                response = {"status":'200', 'creado' : 'false', 'msg':'Ocurrio un error'}
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

@app.route('/getuserdata', methods = ['GET'])
def getUsuario():
     if request.method == 'GET':
        username = request.json['username']
        try:
            res = userstable.get_item(
            Key = {
                "username":username
            })
            item = res['Item']
            response = {'username': item['username'], 'name': item['fullname'],'foto': item['photo']}
            return jsonify(response)
        except:
            response = {"status":'200', 'get' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/getuseralbums', methods = ['GET'])
def getuserAlbums():
     if request.method == 'GET':
        username = request.json['username']
        try:
            res = albumtable.query(
                KeyConditionExpression=Key('username').eq(username))
            item = res['Items']
            datos = ""
            for x in item:
                datos += x['albumName']+";"
            
            return datos[0:len(datos)-1]
        except:      
            response = {"status":'200', 'get' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/addAlbum',methods = ['POST'])
def addAlbum():
    if request.method == 'POST':
        username = request.json['username']
        albumname = request.json['album'] 
        try:
            albumtable.put_item(
            Item={
                'username':username,
                'albumName':albumname
            })
            response = {"status":'200', 'agregado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'agregado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/addFoto',methods = ['POST'])
def addFoto():
    if request.method == 'POST':
        username = request.json['username']
        albumname = request.json['albumName'] 
        foto = request.json['foto']
        try:
            nombre = subirImagen(foto)
            fotostable.put_item(
            Item={
                'username':username,
                'albumName':albumname,
                'imgurl' : urlbucket+nombre
            })
            response = {"status":'200', 'agregado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'agregado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/deleteFoto',methods = ['DELETE'])
def deleteFoto():
    if request.method == 'DELETE':
        foto = request.json['foto']
        try:
            fotostable.delete_item(
            Key={
                'imgurl': foto
            })
            response = {"status":'200', 'eliminado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'eliminado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/deleteAlbum',methods = ['DELETE'])
def deleteAlbum():
    if request.method == 'DELETE':
        album = request.json['albumName']
        username = request.json['username']
        try:
            res = fotostable.scan(
            FilterExpression=Attr('username').eq(username) & Attr('albumName').eq(album))
            item = res['Items']
            if not item:
                datos = []
            else:
                datos =[]
                for x in item:
                    datos.append(x['imgurl'])
                for y in datos:
                    borrarFoto(y)
            albumtable.delete_item(
            Key={
                'username' : username,
                'albumName' : album
            })
            response = {"status":'200', 'eliminado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'eliminado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

def subirImagen(photo):
    imagen = base64.b64decode(photo)
    nombre = 'Fotos_Perfil/' + str(uuid.uuid4()) + '.jpg'
    s3.Bucket('practica1-g21-imagenes').put_object(Key=nombre,Body=imagen, ContentType="image", ACL='public-read')
    return nombre

def borrarFoto(llave):
    try:
        fotostable.delete_item(
        Key={
            'imgurl': llave
        })
    except:
        return

if __name__ == '__main__':
    app.run()
