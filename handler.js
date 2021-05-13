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
    casosConfirmados: "0",
    casosActivos: "0",
    fallecidos: "0",
    etapa: "0",
    fecha: fechaISO,
    fechaDatosComunal: "20210501",
    nombreComuna: nombreComuna,
    fallecidosAnt: "0",
    casosActivosAnt: "0",
    fechaAnt: "20210501"
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

  mensaje.fechaDatosComunal = fechaArchivoISO;

  resta = resta - 1;
  respuesta = null;

  while(respuesta == null){
    fechaArchivo.setDate(currentDate.getDate() + resta);
    fechaArchivoISO = fechaArchivo.toISOString().slice(0, 10);
    resta = resta - 1;
    var respuesta = await asyncCall(path.replace(fechaISO,fechaArchivoISO));
  };

  mensaje.fechaAnt = fechaArchivoISO;

  path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto38/CasosFallecidosPorComuna.csv'
  respuesta = await asyncCall(path);
  var fallecidos = respuesta.map(function (item) {
    return ({
      fallecidos: item[mensaje.fechaDatosComunal],
      fallecidosAnt: item[mensaje.fechaAnt],
      comuna: limpiarComuna(item["Comuna"])
    });
  }).filter(element => element.comuna == comuna)[0];

  mensaje.fallecidos = fallecidos.fallecidos;
  mensaje.fallecidosAnt = fallecidos.fallecidosAnt;

  path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto25/CasosActualesPorComuna.csv'
  respuesta = await asyncCall(path);
  var casosActivos = respuesta.map(function (item) {
    return ({
      casosActivos: item[mensaje.fechaDatosComunal],
      casosActivosAnt: item[mensaje.fechaAnt],
      comuna: limpiarComuna(item["Comuna"])
    });
  }).filter(element => element.comuna == comuna)[0];

  mensaje.casosActivos = casosActivos.casosActivos;
  mensaje.casosActivosAnt = casosActivos.casosActivosAnt;
  
  var fechaEtapa = new Date();
  fechaEtapa.setDate(currentDate.getDate() -1);
  var fechaEtapaISO = fechaEtapa.toISOString().slice(0, 10);

  path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv'
  respuesta = await asyncCall(path);
  mensaje.etapa = //fechaEtapaISO;
    respuesta.map(function (item) {
      return ({
        etapa: item[fechaEtapaISO],
        comuna: limpiarComuna(item["comuna_residencia"])
      });
    }).filter(element => element.comuna == comuna)[0].etapa;

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
