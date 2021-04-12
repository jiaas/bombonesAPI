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

app.get("/bombones/resumenComuna", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  var currentDate = new Date();

  var fechaISO = currentDate.toISOString().slice(0, 10);

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto2/' + fechaISO + '-CasosConfirmados.csv';

  var comuna = req.query.comuna;

  var objectArray = ({
        casosActivos: "abcd",
        //Aqui hay que hacer una lógica, que tenemos que definir
        fecha: "2021-04-02",
        comuna: "penalolen"})
  var resta = 0;
  do{
    var fechaArchivoISO = (currentDate + resta).toISOString().slice(0, 10);
    gitrows.get(path.replace(fechaISO,fechaArchivoISO))
      .then((data) => {
        //handle (Array/Object)data

        objectArray = data.map(function (item) {
          return ({
            casosActivos: item["Casos Confirmados"],
            //Aqui hay que hacer una lógica, que tenemos que definir
            fecha: fechaArchivoISO,
            comuna: item["Comuna"]
          });
        }).filter(element => element.comuna == comuna);

        resta = resta -3
      }).catch( (error) => {
        resta = resta - 1;
      });
  }while(resta < -2)
  
  return res.status(200).json({
    message: objectArray,
  });
});

app.get("/bombones/resumenPrueba", (req, res, next) => {
  return res.status(200).json({
    message: req.query.comuna
  });
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
