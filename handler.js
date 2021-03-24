const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.get("/bombones", (req, res, next) => {
  // If you use GitRows as a module:
  const Gitrows = require('gitrows');

  // Init the GitRows client, you can provide options at this point, later or just run on the defaults
  const gitrows = new Gitrows();

  let path = 'https://github.com/NORA-CO/Datos-COVID19/blob/master/output/producto74/paso_a_paso.csv';

  gitrows.get(path)
    .then((data) => {
      //handle (Array/Object)data
      //console.log(data);
      //console.log(data);
      return res.status(200).json({
        message: data,
      });

    })


});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
