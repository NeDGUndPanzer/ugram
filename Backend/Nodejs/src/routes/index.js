const { Router } = require('express');
const router = Router();

const cors = require('cors');
var bodyParser = require('body-parser');
const uuidv4 = require('uuid-random');
var md5 = require('md5');

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
router.use(cors(corsOptions));
router.use(bodyParser.json({ limit: '100mb', extended: true }));
router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))


//instanciamos el sdk
var AWS = require('aws-sdk');
const aws_keys = require('./creds');

const s3 = new AWS.S3(aws_keys.s3);
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
const rek = new AWS.Rekognition(aws_keys.rekognition);

router.get('/hola', 
    (req,res) => res.json
    (
        {msg: 'Holis'}
    )
);

/**
 * STORAGE IN S3
 */

//********************************************************************** */
// METODO: upload_singup
// DESCRIPCION: metodo para subir las fotos de perfil del singup, devuelve el id de la foto
router.post('/upload_singup', function (req, res) {

  var id = uuidv4();

  /** Codigo para S3 ---> */
  var foto = req.body.foto;
  var nombrei = "Fotos_Perfil/" + id + ".jpg";
  let buff = new Buffer.from(foto, 'base64');

  const params = {
    Bucket: "practica1-g21-imagenes",
    Key: nombrei,
    Body: buff,
    ContentType: "image",
    ACL: 'public-read'
  };
  const putResult = s3.putObject(params).promise();
  //res.json({ mensaje: putResult })

  res.json({ idfoto: id })

});

//********************************************************************** */
// METODO: upload_editprofile
// DESCRIPCION: cambia la foto de perfil, usa el mismo id y en el S3 solo sobreescribe
router.post('/upload_editprofile', function (req, res) {

  var id = req.body.id;
  var foto = req.body.foto;
  var nombrei = "Fotos_Perfil/" + id + ".jpg";
  let buff = new Buffer.from(foto, 'base64');

  const params = {
    Bucket: "practica1-g21-imagenes",
    Key: nombrei,
    Body: buff,
    ContentType: "image",
    ACL: 'public-read'
  };
  const putResult = s3.putObject(params).promise();
  res.json({ idfoto: id })

});

//********************************************************************** */
// METODO: upload_pic
// DESCRIPCION: metodo para subir una foto a la carrpeta general de fotos, devuelve el id de la foto
router.post('/upload_pic', function (req, res) {

  var id = uuidv4();

  /** Codigo para S3 ---> */
  var foto = req.body.foto;
  var nombrei = "Fotos_Publicadas/" + id + ".jpg";
  let buff = new Buffer.from(foto, 'base64');

  const params = {
    Bucket: "practica1-g21-imagenes",
    Key: nombrei,
    Body: buff,
    ContentType: "image",
    ACL: 'public-read'
  };
  const putResult = s3.putObject(params).promise();

  res.json({ idfoto: id })  
});

//********************************************************************** */
// METODO: download_profilephoto
// DESCRIPCION: obtiene la foto de perfil. 
// PARAMETROS: 
// 01. id: id de la foto, guardado en dyanamo
router.post('/download_profilephoto', function (req, res) {
  var id = req.body.id;
  var nombrei = "Fotos_Perfil/" + id + ".jpg";
  var getParams = {
    Bucket: 'practica1-g21-imagenes',
    Key: nombrei
  }
  s3.getObject(getParams, function (err, data) {
    if (err)
      res.json({ mensaje: "error" })
    //de bytes a base64
    var dataBase64 = Buffer.from(data.Body).toString('base64');
    res.json({ mensaje: dataBase64 })
  });
});


/**
 * DYANAMO 
 */

const config = require('./db_creds.js');


//********************************************************************** */
// METODO: iniciarSesion
// DESCRIPCION: aun no se
router.post('/iniciarSesion', async (req, res) => {
  
  var params = {
    Key: { "username": { S: req.body.username }
    }, 
    TableName: "User"
  };
  ddb.getItem(params, async(err, data) =>{
    if (err){
      console.log(err, err.stack); 
    }
    else{
      const dataaux = data;
      if(JSON.stringify(dataaux) == "{}"){
        console.log('user no existe')
        res.send({ 'login': 'false' });
      }
      else{
        console.log('user existe');
        const aux = await data;
        console.log(md5(req.body.password))
        console.log(aux.Item.password.S)
        if(aux.Item.password.S == md5(req.body.password))
        {
          res.send({ 'login': 'true' });
        }
        else
        {
          res.send({ 'login': 'Contrasena incorrecta' });
        }
      }
    }             
  });

});

//********************************************************************** */
// METODO: getuserdata
// DESCRIPCION: aun no se
router.post('/getuserdata', async (req, res) => {
  //console.log(req.body)

  var params = {
    Key: { "username": { S: req.body.username }
    }, 
    TableName: "User"
  };
  ddb.getItem(params, async(err, data) => {
    if (err){
      console.log(err, err.stack); 
    }
    else{
      const aux = await data; 
      res.send({'username': aux.Item.username.S, 'name': aux.Item.fullname.S, 'foto': aux.Item.photo.S});
    }             
  });

});


router.get('/allusers', function (req, res) {
  
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
      TableName: config.aws_table_name
  };

  docClient.scan(params, function (err, data) {

      if (err) {
          console.log(err)
          res.send({
              success: false,
              message: err
          });
      } else {
          const { Items } = data;
          res.send({
              success: true,
              movies: Items
          });
      }
  });
  
});


//********************************************************************** */
// METODO: registarse
// DESCRIPCION: aun no se
router.post('/registrar', function (req, res) {
  
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  ddb.putItem({
    TableName: "Albums",
    Item: {
      "username": { S: req.body.username },
      "albumName": { S: "Perfil" }
    }
  }, function (err, data) {
    if (err) {
  
    } else {
      
    }
  });

  ddb.putItem({
    TableName: "Fotos",
    Item: {
      "username": { S: req.body.username },
      "albumName": { S: "Perfil" },
      "imgurl": { S: req.body.foto },
      "picname": { S: "foto de perfil" }
    }
  }, function (err, data) {
    if (err) {
      
    } else {
      
    }
  });

  // Ver si existe o que pedo
  let userExist = false;
  var params = {
    Key: { "username": { S: req.body.username }
    }, 
    TableName: "User"
  };
  ddb.getItem(params, function(err, data) {
    if (err){
      console.log(err, err.stack); 
    }
    else{
      const dataaux = data;
      if(JSON.stringify(dataaux) == "{}"){
        
        console.log('user no existe')
        ddb.putItem({
          TableName: "User",
          Item: {
            "username": { S: req.body.username },
            "password": { S: md5(req.body.password) },
            "fullname": { S: req.body.nombre },
            "photo": { S: req.body.foto }
          }
        }, function (err, data) {
          if (err) {
            res.send({ 'message': 'ddb failed' });
          } else {
            res.send({ 'message': 'ddb success' });
          }
        });
        
      }
      else{
        console.log('user existe')
        res.send({ 'message': 'usuario existe' });
      }
    }             
  });

});

//********************************************************************** */
// METODO: update perfil
// DESCRIPCION: ya tu sabe lady
router.post('/update', function (req, res) {

  var params = {
    Key: { "username": { S: req.body.username }
    }, 
    TableName: "User"
  };

  ddb.putItem({
    TableName: "Fotos",
    Item: {
      "username": { S: req.body.newuser },
      "albumName": { S: "Perfil" },
      "imgurl": { S: req.body.foto },
      "picname": { S: "foto de perfil" }
    }
  }, function (err, data) {
    if (err) {
      
    } else {
      
    }
  });

  // elimnar registro existente del usuario
  ddb.deleteItem( params, function(err,data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  // crear registro
  ddb.putItem({
    TableName: "User",
    Item: {
      "username": { S: req.body.newuser },
      "password": { S: md5(req.body.password) },
      "fullname": { S: req.body.nombre },
      "photo": { S: req.body.foto }
    }
  }, function (err, data) {
    if (err) {
      res.send({ 'message': 'ddb failed' });
    } else {
      res.send({ 'message': 'ddb success' });
    }
  });

});

//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
// AREA DE ALBUMS
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */


//********************************************************************** */
// METODO: getuseralbums
// DESCRIPCION: no se
// ESTADO: DONE
router.post('/getuseralbums', async (req, res) => {

  var params = {
    ExpressionAttributeValues: {
      ":v1": {
        S: req.body.username
       }
     },
    KeyConditionExpression: "username = :v1",
    TableName: "Albums"
  };
  ddb.query(params, async (err, data) => {
    if (err){
      console.log(err, err.stack); 
    }
    else{
      datos = '';
      data.Items.forEach(element => {
        datos += element.albumName.S + 'bokunopico';
      });
      res.send({ 'albumnes': datos });
    }             
  });

});

//********************************************************************** */
// METODO: addAlbum
// DESCRIPCION: no se
// ESTADO: DONE
router.post('/addAlbum', function (req, res) {
  ddb.putItem({
    TableName: "Albums",
    Item: {
      "username": { S: req.body.username },
      "albumName": { S: req.body.albumname }
    }
  }, function (err, data) {
    if (err) {
      res.send({ 'agregado': 'false' });
    } else {
      res.send({ 'agregado': 'true' });
    }
  });
});

//********************************************************************** */
// METODO: addFoto
// DESCRIPCION: no se
// ESTADO: DONE
router.post('/addFoto', function (req, res) {
  console.log(req.body)
  ddb.putItem({
    TableName: "Fotos",
    Item: {
      "username": { S: req.body.username },
      "albumName": { S: req.body.albumname },
      "imgurl": { S: req.body.imgurl },
      "picname": { S: req.body.picname },
      "descripcion": { S: req.body.descripcion }
    }
  }, function (err, data) {
    if (err) {
      res.send({ 'agregado': 'false' });
    } else {
      res.send({ 'agregado': 'true' });
    }
  });
});

//********************************************************************** */
// METODO: deleteFoto
// DESCRIPCION: no se
router.post('/deleteFoto', function (req, res) {

});

//********************************************************************** */
// METODO: deleteAlbum
// DESCRIPCION: no se
router.post('/deleteAlbum', function (req, res) {

});


//********************************************************************** */
// METODO: getFotosAlbum
// DESCRIPCION: no se
router.post('/getFotosAlbum', function (req, res) {

  var params = {
    ExpressionAttributeValues: {
      ":v1": {
        S: req.body.username
       },
      ":v2": {
        S: req.body.album
       }
     },
    FilterExpression: "username = :v1 AND albumName = :v2",
    TableName: "Fotos"
  };
  ddb.scan(params, async (err, data) => {
    if (err){
      console.log(err, err.stack); 
    }
    else{
      datos = '';
      data.Items.forEach(element => {
        datos += element.imgurl.S + 'bokunopico';
      });
      res.send({ 'fotos': datos });
    }             
  });

});


//-------------------------------------------------- INCIO AREA DE PRUEBAS
//subir foto en s3
router.post('/subirfoto_solos3', function (req, res) {

    //var id = req.body.id;
    var id = uuidv4();
    var foto = req.body.foto;

    var nombrei = "Fotos_Perfil/" + id + ".jpg";
    let buff = new Buffer.from(foto, 'base64');
  
    const params = {
      Bucket: "practica1-g21-imagenes",
      Key: nombrei,
      Body: buff,
      ContentType: "image",
      ACL: 'public-read'
    };
    const putResult = s3.putObject(params).promise();
    res.json({ mensaje: putResult })
  });
  
router.post('/obtenerfoto_solos3', function (req, res) {
  var id = req.body.id;
  //direcccion donde esta el archivo a obtener
  var nombrei = "Fotos_Perfil/" + id + ".jpg";
  var getParams = {
    Bucket: 'practica1-g21-imagenes',
    Key: nombrei
  }
  s3.getObject(getParams, function (err, data) {
    if (err)
      res.json({ mensaje: "error" })
    //de bytes a base64
    var dataBase64 = Buffer.from(data.Body).toString('base64');
    res.json({ mensaje: dataBase64 })
    console.log(dataBase64)
  });

});
//-------------------------------------------------- FIN AREA DE PRUEBAS
  

//********************************************************************** */
/*
      _    _                                   _           
    | |  | |                                 | |          
    | |  | | __ _ _ __ __ _ _ __ ___    _ __ | |_   _ ___ 
   | |  | |/ _` | '__/ _` | '_ ` _ \  | '_ \| | | | / __|
  | |__| | (_| | | | (_| | | | | | | | |_) | | |_| \__ \
  \____/ \__, |_|  \__,_|_| |_| |_| | .__/|_|\__,_|___/
          __/ |                     | |                
         |___/                      |_|                
*/
//********************************************************************** */

//********************************************************************** */
// METODO: getLabels
// DESCRIPCION: no se
// ESTADO: no done
router.post('/getLabels', async (req, res) => {

  var imagen = req.body.imagen;
  var params = {
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    }, 
    MaxLabels: 123
  };
  rek.detectLabels(params, function(err, data) {
    if (err) {res.json({mensaje: "Error"})} 
    else {   
           res.json({etiquetas: data.Labels});      
    }
  });

});

//********************************************************************** */
// METODO: compararfotos
// DESCRIPCION: no se
// ESTADO: no done

const imageToBase64 = require('image-to-base64');
const imageToUri = require('image-to-uri');
router.post('/getBASE64_byURL', function (req, res) { 
  var imagen1 = String(req.body.imagen);
  var base64 = "";
  imageToBase64(imagen1) // Image URL
    .then(
        (response) => {
            //console.log(response); // "iVBORw0KGgoAAAANSwCAIA..."
            base64 = String(response)
            res.json({base64: String(response)}); 
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )
  
  
});

//********************************************************************** */
// METODO: compararfotos
// DESCRIPCION: no se
// ESTADO: no done
router.post('/compararfotos', function (req, res) { 
  var imagen1 = String(req.body.imagen1);
  var imagen2 = String(req.body.imagen2);
  /**console.log("imagen1")
  console.log(imagen1)
  console.log("imagen2")
  console.log(imagen2)**/

  var params = {
    
    SourceImage: {
        Bytes: Buffer.from(imagen1, 'base64')     
    }, 
    TargetImage: {
        Bytes: Buffer.from(imagen2, 'base64')    
    },
    SimilarityThreshold: '80'
    
   
  };
  rek.compareFaces(params, function(err, data) {
    if (err) {res.json({mensaje: err})} 
    else {   
           res.json({Comparacion: data.FaceMatches});      
    }
  });
});



module.exports = router;