const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});


/*
function getData() {
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      var keyArray = data.map(function (item) {
        return ({
          //codigo_region: item["codigo_region"],
          region_residencia: item["region_residencia"],
          //codigo_comuna: item["codigo_comuna"],
          comuna_residencia: item["comuna_residencia"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          '2021/03/24': item['2021-03-24']

        });
      });

      console.log(keyArray)

    })
}

getData();
*/

app.get("/bombones", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data

      var objectArray = data.map(function (item) {
        return ({
          //codigo_region: item["codigo_region"],
          region_residencia: item["region_residencia"],
          //codigo_comuna: item["codigo_comuna"],
          comuna_residencia: item["comuna_residencia"],
          //Aqui hay que hacer una lógica, que tenemos que definir
          '2021/03/24': item['2021-03-24']

        });
      });

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
