var express = require('express');
var router = express.Router();
/*Vamos utilizar Formidable module
Modulo para carregar arquivos de formulários e upload
*/
var formidable = require("formidable");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', (req, res) => {

  /*vamos usar o IncomindForm para chamar o formulário
  dentro do método temos que passar o diretório que será salvo os dados e também pedir para keep Extension (para preservar a extensão e conseguirmos abrir)
  */
  let form = new formidable.IncomingForm({
      uploadDir: "./upload",
      keepExtensions: true,

  });

  /*Com os dados do formulário carregados, 
  precisamos interpreta-los (parse) para que o formidable saiba o que é campo (field) e o que é arquivo (files) */
  form.parse(req, (err, fields, files) => {
    
     res.json({
       files: files //passando os arquivos para um objeto

     }); //pegando os dados
  
  });
 
});


module.exports = router;
