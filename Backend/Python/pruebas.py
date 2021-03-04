from flask import Flask, request, jsonify
import json
import hashlib
import boto3
import base64
import uuid

app = Flask(__name__)

s3 = boto3.resource('s3',region_name='us-east-2',aws_access_key_id='AKIAQGEZTINBG6FXCMHG',aws_secret_access_key='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')
db = boto3.resource('dynamodb',region_name='us-east-2',aws_access_key_id='AKIAVEMKH4ZBHWPR4M7A',aws_secret_access_key='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')
userstable = db.Table('User')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/upload_singup', methods = ['POST'])
def iniciarSesion():
    if request.method == 'POST':
        imagen = base64.b64decode(request.json['foto'])
        nombre = 'Fotos_Perfil/' + str(uuid.uuid4()) + '.jpg'
        res = s3.Bucket('practica1-g21-imagenes').put_object(Key=nombre,Body=imagen, ContentType="image", ACL='public-read')
        return "Ok"
    else:
        return "No post"
       
if __name__ == '__main__':
    app.run(port = 3000)
