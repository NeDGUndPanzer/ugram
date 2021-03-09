from flask import Flask, request, jsonify
import json
import hashlib
import boto3
from boto3.dynamodb.conditions import Key, Attr
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
        fullname = request.json['nombre']
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
                userstable.put_item(
                Item={
                    'username':username,
                    'password':encripted.hexdigest(),
                    'fullname':fullname,
                    'photo':photo
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
                    'imgurl': photo,
                    'picname' : 'primerafoto'
                })
                response = {"status":'200', 'creado' : 'true'}
                return jsonify(response)
            except:
                response = {"status":'200', 'creado' : 'false', 'msg':'Ocurrio un error'}
                return jsonify(response)

@app.route('/update',methods = ['POST'])
def updateUser():
    if request.method == 'POST':
        username = request.json['username']
        usernameE = request.json['newuser']
        fullname = request.json['nombre']
        photo = request.json['foto']

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

	    fotostable.put_item(
             Item={
                 'username':usernameE,
                 'albumName':"Perfil,
                 'imgurl' : photo,
                 'picname' : "foto de perfil"
             })
            
            response = {"status":'200', 'actualizado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'actualizado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/delete',methods = ['POST'])
def eliminarUser():
    if request.method == 'POST':
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

@app.route('/getuserdata', methods = ['POST'])
def getUsuario():
     if request.method == 'POST':
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

@app.route('/getuseralbums', methods = ['POST'])
def getuserAlbums():
     if request.method == 'POST':
        username = request.json['username']
        try:
            res = albumtable.query(
                KeyConditionExpression=Key('username').eq(username))
            item = res['Items']
            datos = '{ "albumnes" : "'
            for x in item:
                datos += x['albumName']+"bokunopico"
            datos = datos[0:len(datos)]+'" }'
            
            return json.loads(datos)
        except:      
            response = {"status":'200', 'get' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/addAlbum',methods = ['POST'])
def addAlbum():
    if request.method == 'POST':
        username = request.json['username']
        albumname = request.json['albumname'] 
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
        albumname = request.json['albumname'] 
        fotoname = request.json['picname']
        foto = request.json['imgurl']
        try:
            fotostable.put_item(
            Item={
                'username':username,
                'albumName':albumname,
                'imgurl' : foto,
                'picname' : fotoname
            })
            response = {"status":'200', 'agregado' : 'true'}
            return jsonify(response)
        except:
            response = {"status":'200', 'agregado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)

@app.route('/deleteFoto',methods = ['POST'])
def deleteFoto():
    if request.method == 'POST':
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

@app.route('/deleteAlbum',methods = ['POST'])
def deleteAlbum():
    if request.method == 'POST':
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

@app.route('/upload_singup',methods = ['POST'])
def subirFotoPerfil():
    return subirImagenPerfil(request.json['foto'])

@app.route('/upload_pic',methods = ['POST'])
def subirFoto():
    return subirImagen(request.json['foto'])

@app.route('/getImages', methods = ['POST'])
def getuserfotor():
    if request.method == 'POST':
        username = request.json['username']
        album = request.json['album']
        try:
            res = fotostable.scan(
            FilterExpression=Attr('username').eq(username) & Attr('albumName').eq(album))
            item = res['Items']
            if not item:
                datos = '{ niguna }'
            else:
                datos = '{\n'
                for x in item:
                    datos += 'album : ' + x['albumName']+','
                    datos += 'foto : '  + x['imgurl'] + ',\n'
                datos = datos[0:(len(datos)-1)]
                datos += '}'
            return jsonify(item)
        except:
            response = {"status":'200', 'eliminado' : 'false', 'msg':'Ocurrio un error'}
            return jsonify(response)
@app.route('/getFotosAlbum', methods = ['POST'])
def getuserfotos():
    if request.method == 'POST':
        username = request.json['username']
        album = request.json['album']
        try:
            res = fotostable.scan(
            FilterExpression=Attr('username').eq(username) & Attr('albumName').eq(album))
            item = res['Items']
            if not item:
                response = {"fotos":'bokunopico'}
                return jsonify(response)
            else:
                datos = '{ "fotos" : "'
                for x in item:
                    datos += x['imgurl']+"bokunopico"
                datos +='"}'
                return json.loads(datos)
        except:
            response = {"fotos" : 'bokunopico'}
            return jsonify(response)
def subirImagen(photo):
    imagen = base64.b64decode(photo)
    nombre =  str(uuid.uuid4())
    s3.Bucket('practica1-g21-imagenes').put_object(Key='Fotos_Publicadas/' +nombre + '.jpg',Body=imagen, ContentType="image", ACL='public-read')
    return jsonify( {"idfoto" : nombre})

def subirImagenPerfil(photo):
    imagen = base64.b64decode(photo)
    nombre = str(uuid.uuid4()) 
    s3.Bucket('practica1-g21-imagenes').put_object(Key='Fotos_Perfil/' + nombre+ '.jpg',Body=imagen, ContentType="image", ACL='public-read')
    return jsonify( {"idfoto" : nombre})

def borrarFoto(llave):
    try:
        fotostable.delete_item(
        Key={
            'imgurl': llave
        })
    except:
        return

if __name__ == '__main__':
    app.run(host='0.0.0.0')
