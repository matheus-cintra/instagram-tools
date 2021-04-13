const express = require('express');

const app = express();
const port = 4000;

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));

require('./api')(app)

app.listen(port, () => console.warn("Servidor Rodando..."))

module.exports = app;