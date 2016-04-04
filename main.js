'use strict'

let app = require('app');
let BrowserWindow = require('browser-window');
let http = require('http');
let express = require('express')();
let MongoClient = require('mongodb').MongoClient;
let mainWindow = null;
let aboutWindow = null;
let ipc = require('electron').ipcMain;
let bodyParser = require('body-parser');


express.use(bodyParser.urlencoded({extended:false}));


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });
    mainWindow.loadURL('file:///' + __dirname + '/index.html');
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.maximize();
});

ipc.on('open-about-window', function () {
    console.log('about called');
    mainWindow.loadURL('file:///' + __dirname + '/about.html');
});


let mongo = require('./mongo.js')(express);

process.on('error', (err) => {
    console.log(err);
});

// for the mongodb connectivity
express.set('port',process.env.PORT || 1356);
express.listen(express.get('port'), () => { console.log('listening on ' + express.get('port')) });