const { Router } = require('express');
const router = Router();

const cors = require('cors');
var bodyParser = require('body-parser');
const uuidv4 = require('uuid-random');

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
router.use(cors(corsOptions));
router.use(bodyParser.json({ limit: '100mb', extended: true }));
router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))


//instanciamos el sdk
var AWS = require('aws-sdk');
const aws_keys = require('./creds');

const s3 = new AWS.S3(aws_keys.s3);
//const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
//const rek = new AWS.Rekognition(aws_keys.rekognition);


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
  res.json({ mensaje: putResult })

});

//********************************************************************** */
// METODO: upload_pic
// DESCRIPCION: metodo para subir una foto a la carrpeta general de fotos, devuelve el id de la foto
router.post('/upload_pic', function (req, res) {

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

//--------------------------------------------------ALMACENAMIENTO---------------------------------------

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
  
  

module.exports = router;