const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

/*
var currentDate = new Date().toJSON().slice(0, 10);
//console.log(currentDate);

getData(currentDate)

function getData(date) {
  //console.log(date);
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var keyArray = data.map(function (item) {
        return ({
          comuna: item["comuna_residencia"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          etapa: item[date]

        });
      });

      console.log(keyArray)

    })
}*/


app.get("/bombones/comunas", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var currentDate = new Date().toJSON().slice(0, 10);

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
      var currentDate = new Date().toJSON().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          fallecidos: item["Fallecidos"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          fecha: item["Fecha"]
        });
      }).find(element => element.fecha = "2021-04-02");

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
      var currentDate = new Date().toJSON().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          casosTotales: item["Casos nuevos totales"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          fecha: item["fecha"]

        });
      }).find(element => element.fecha = "2021-04-02");

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
      var currentDate = new Date().toJSON().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          item

        });
      }).find(element => element.fecha = "2021-04-02");

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
      var currentDate = new Date().toJSON().slice(0, 10);

      var objectArray = data.map(function (item) {
        return ({
          item
        });
      }).find(element => element.fecha = "2021-04-02");

      return res.status(200).json({
        message: objectArray,
      });

    })


});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
