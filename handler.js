const serverless = require("serverless-http");
const express = require("express");
const app = express();

const https = require('https');
const { valuesApply } = require("gitrows/lib/util");

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/bombones/resumenComuna", async (req, res, next) => {

  var currentDate = new Date();
  currentDate.setTime(currentDate.getTime() - (4*60*60*1000));

  var fechaISO = currentDate.toISOString().slice(0, 10);

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto2/' + fechaISO + '-CasosConfirmados.csv';

  var comuna = "";
  var nombreComuna = "";

  if(typeof req.query.latlng !== 'undefined'){
    var latlng = req.query.latlng;

    var key = req.query.key;

    var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=AIzaSyDPtXmzPqlYzIj9v3VDBYG3lbD4RjCMrLI`;
    
    respuesta = await asyncCallApi(url).then((value) =>{
      return value;
    });

    var respuestaComuna = respuesta["results"][0].address_components;

    nombreComuna = respuestaComuna.filter(a => a.types[0] == "locality")[0].long_name;
    comuna = limpiarComuna(nombreComuna);
  }else{
    nombreComuna = req.query.comuna;
    comuna = limpiarComuna(nombreComuna);
  }

  var mensaje = {
    "casosConfirmados": "0",
    "casosActivos": "0",
    "casosFallecidos": "0",
    "etapa": "0",
    "fechaConsulta": fechaISO,
    "fechaInforme": "2021-05-07",
    "fechaInformeEtapa": "2021-05-07",
    "nombreComuna": nombreComuna,
    "diferenciaHistoricaCasosFallecidos":{
        "desde": "2021-05-10",
        "hasta": "2021-05-13",
        "diferencia": "0"
    },
    "diferenciaHistoricaCasosActivos":{
        "desde": "2021-05-10",
        "hasta": "2021-05-13",
        "diferencia": "0"
    },
    "graficoCasosFallecidos":["0", "0", "0", "0", "0"],
    "graficoCasosActivos":["0", "0", "0", "0", "0"]
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
          comuna: limpiarComuna(item["Comuna"])
        });
      }).filter(element => element.comuna == comuna)[0].casosConfirmados;
    };
  };

  mensaje.fechaInforme = fechaArchivoISO;
  var arrayUltimasFechas = ["2021-01-01", "2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05"];
  path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto38/CasosFallecidosPorComuna.csv'
  respuesta = await asyncCall(path);
  
  var keysObjetoFallecidos = Object.keys(respuesta[0]);
  var indiceArrayUltimasFechas = 0;
  for(a = keysObjetoFallecidos.length - 5;a < keysObjetoFallecidos.length; a++){
      arrayUltimasFechas[indiceArrayUltimasFechas] = keysObjetoFallecidos[a];
      indiceArrayUltimasFechas++;
  };
  var fallecidos = respuesta.map(function (item) {
    return ({
      fallecidos: [item[arrayUltimasFechas[0]]
                  ,item[arrayUltimasFechas[1]]
                  ,item[arrayUltimasFechas[2]]
                  ,item[arrayUltimasFechas[3]]
                  ,item[arrayUltimasFechas[4]]],
      comuna: limpiarComuna(item["Comuna"])
    });
  }).filter(element => element.comuna == comuna)[0];

  mensaje.casosFallecidos = fallecidos.fallecidos[4];
  mensaje.graficoCasosFallecidos = fallecidos.fallecidos;
  mensaje.diferenciaHistoricaCasosFallecidos.desde = arrayUltimasFechas[3];
  mensaje.diferenciaHistoricaCasosFallecidos.hasta = arrayUltimasFechas[4];
  mensaje.diferenciaHistoricaCasosFallecidos.diferencia = fallecidos.fallecidos[4] - fallecidos.fallecidos[3];

  path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto25/CasosActualesPorComuna.csv'
  respuesta = await asyncCall(path);
  var casosActivos = respuesta.map(function (item) {
    return ({
      casosActivos: [item[arrayUltimasFechas[0]]
                    ,item[arrayUltimasFechas[1]]
                    ,item[arrayUltimasFechas[2]]
                    ,item[arrayUltimasFechas[3]]
                    ,item[arrayUltimasFechas[4]]],
      comuna: limpiarComuna(item["Comuna"])
    });
  }).filter(element => element.comuna == comuna)[0];

  mensaje.casosActivos = casosActivos.casosActivos[4];
  mensaje.graficoCasosActivos = casosActivos.casosActivos;
  mensaje.diferenciaHistoricaCasosActivos.desde = arrayUltimasFechas[3];
  mensaje.diferenciaHistoricaCasosActivos.hasta = arrayUltimasFechas[4];
  mensaje.diferenciaHistoricaCasosActivos.diferencia = casosActivos.casosActivos[4] - casosActivos.casosActivos[3];
  
  path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv'
  respuesta = await asyncCall(path);
  var keysObjetoEtapa = Object.keys(respuesta[0]);
  var fechaEtapa = keysObjetoEtapa[keysObjetoEtapa.length - 1];
  mensaje.etapa = 
    respuesta.map(function (item) {
      return ({
        etapa: item[fechaEtapa],
        comuna: limpiarComuna(item["comuna_residencia"])
      });
    }).filter(element => element.comuna == comuna)[0].etapa;
  mensaje.fechaInformeEtapa = fechaEtapa;
  return res.status(200).json({
    message: mensaje,
  });
});

function limpiarComuna(palabra){
  palabra = palabra.split(" ").join("");
  palabra = palabra.toUpperCase();
  palabra = palabra.split("Á").join("A");
  palabra = palabra.split("É").join("E");
  palabra = palabra.split("Í").join("I");
  palabra = palabra.split("Ó").join("O");
  palabra = palabra.split("Ú").join("U");
  palabra = palabra.split("Ñ").join("N");
  return palabra;
}

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

async function asyncCallApi(path) {
  return new Promise((resolve) => {
      https.get(path, (resp) => {
          var data = '';

          resp.on('data', (chunk) => {
              data += chunk;
          });
          resp.on('end', () => {
              resolve(JSON.parse(data));
          });
      }).on("error", (err) => {
      });
  });
}

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
