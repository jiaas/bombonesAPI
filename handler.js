const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/bombones/comunas", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var currentDate = new Date().toISOString().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          comuna: item["comuna_residencia"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          etapa: item[currentDate]

        });
      });

      return res.status(200).json({
        message: objectArray,
      });

    })


});


app.get("/bombones/fallecidos", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto5/TotalesNacionales_T.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var currentDate = new Date().toISOString().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          fallecidos: item["Fallecidos"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          fecha: item["Fecha"]
        });
      }).filter(element => element.fecha == "2021-04-02");

      return res.status(200).json({
        message: objectArray,
      });

    })


});

app.get("/bombones/casosTotales", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto5/TotalesNacionales_T.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var currentDate = new Date().toISOString().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          casosTotales: item["Casos nuevos totales"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          fecha: item["Fecha"]

        });
      }).filter(element => element.fecha == "2021-04-02");

      return res.status(200).json({
        message: objectArray,
      });

    })


});

app.get("/bombones/recuperados", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto5/TotalesNacionales_T.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var currentDate = new Date().toISOString().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          casosRecuperados: item["Casos confirmados recuperados"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          fecha: item["Fecha"]
        });
      }).filter(element => element.fecha == "2021-04-02");

      return res.status(200).json({
        message: objectArray,
      });

    })


});

app.get("/bombones/casosActivos", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto5/TotalesNacionales_T.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var currentDate = new Date().toISOString().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          casosActivos: item["Casos activos confirmados"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          fecha: item["Fecha"]
        });
      }).filter(element => element.fecha == "2021-04-02");

      return res.status(200).json({
        message: objectArray,
      });

    })


});

app.get("/bombones/resumen", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto5/TotalesNacionales_T.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var currentDate = new Date().toISOString().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          fallecidos: item["Fallecidos"],
          casosActivos: item["Casos activos confirmados"],
          casosRecuperados: item["Casos confirmados recuperados"],
          casosDiarios: item["Casos nuevos totales"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          fecha: item["Fecha"]
        });
      }).filter(element => element.fecha == "2021-04-02");

      return res.status(200).json({
        message: objectArray,
      });

    })


});

app.get("/bombones/resumenComuna", async (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  var currentDate = new Date();
  currentDate.setTime(currentDate.getTime() - (4*60*60*1000));

  var fechaISO = currentDate.toISOString().slice(0, 10);

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto2/' + fechaISO + '-CasosConfirmados.csv';

  var comuna = req.query.comuna;

  var mensaje = {
    casosConfirmados: "0",
    casosActivos: "0",
    fallecidos: "0"
  };

  var fechaArchivo = new Date();
  var fechaArchivoISO = "";
  var resta = 0;
  var respuesta = null;

  while(respuesta == null){
    fechaArchivo.setDate(currentDate.getDate() + resta);
    fechaArchivoISO = fechaArchivo.toISOString().slice(0, 10);
    resta = resta - 1;
    var respuesta = await asyncCall(path.replace(fechaISO,fechaArchivoISO));
    if(respuesta != null){
      mensaje.casosConfirmados = 
      respuesta.map(function (item) {
        return ({
          casosConfirmados: item["Casos Confirmados"],
          comuna: item["Comuna"]
        });
      }).filter(element => element.comuna == comuna)[0].casosConfirmados;
    };
  };

  path = 'https://github.com/MinCiencia/Datos-COVID19/blob/master/output/producto38/CasosFallecidosPorComuna.csv'
  respuesta = await asyncCall(path);
  mensaje.fallecidos = 
    respuesta.map(function (item) {
      return ({
        fallecidos: item[fechaArchivoISO],
        comuna: item["Comuna"]
      });
    }).filter(element => element.comuna == comuna)[0].fallecidos;

    path = 'https://github.com/MinCiencia/Datos-COVID19/blob/master/output/producto25/CasosActualesPorComuna.csv'
    respuesta = await asyncCall(path);
    mensaje.casosActivos = 
      respuesta.map(function (item) {
        return ({
          casosActivos: item[fechaArchivoISO],
          comuna: item["Comuna"]
        });
      }).filter(element => element.comuna == comuna)[0].casosActivos;
  return res.status(200).json({
    message: mensaje,
  });
});

app.get("/bombones/resumenPrueba", async (req, res, next) => {

  var mensaje = await asyncCall(req.query.path);
  return res.status(200).json({
    message: mensaje,
  });

});

async function asyncCall(path) {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();
  
  var objectArray = null;

  await gitrows.get(path)
    .then((data) => {
      objectArray = data;
    })
    .catch((error) => {
      objectArray = null;
    });
  return objectArray
}
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3003, () => {
  console.log("El servidor está inicializado en el puerto 3003");
 });

module.exports.handler = serverless(app);
