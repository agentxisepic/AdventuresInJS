var app = require('express')();
var express = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const PublicDir = "S:/Programming/JavaScript/AdventuresInJS/Small_Projects/QuestionGuess/QuestionGuessV4/Public";
var router = express.Router();

//File Requesting Stuffs
app.get('/', (req, res) => {
  res.sendFile(PublicDir + '/index.html');
});

app.get('/libraries/:id', function(req, res, next) {
  //console.log("Happenend");
  res.sendFile(PublicDir + '/libraries/' + req.params.id);
  console.log(req.params.id);
});

app.get('/:id', function(req, res, next){
  res.sendFile(PublicDir + '/' + req.params.id);
  console.log(req.params.id);
});

//Socket handling
var sessionID = 0;
var userIDS = [];
var userSessions = [];
var workersSessionID = [];
var HEADERSMAIN = [];
var HEADERSWORKER = [];
loadListOfSets();
loadHEADERS();


function checkForAlreadyConnected(user)
{
  userID = user.handshake.address;
  for (var i = 0; i < userIDS.length; i++)
  {
    if (userID === userIDS[i])
    {
      return true;
    }
  }
  return false;
}


function getSessionID()
{
  sessionID += 1;
  return sessionID;
}

function userSession(userID){
  this.userID = userID;
  this.worker = {
    WORKER: null,
    sessionID: null
  };
  this.playGame = function(data){
    this.worker = {
      WORKER: startWorker(filePath, (err, result) => {
        if (err) return console.error(err);
        console.log(result.value);
      }),
      sessionID: getSessionID()
    }
  }

}

function getUserSession(userID){
  for (var i = 0; i < userSessions.length; i++)
  {
     if (userSessions[i].userID === userID)
     {
       return userSessions[i];
     }
  }
}

function getWorker(sessionID)
{
  for (var i = 0; i < userSessions.length; i++)
  {
    if (userSessions[i].sessionID === sessionID)
    {
      console.log(userSessions[i]);
      return userSessions[i].worker;
    }
  }
}

io.on('connection', (socket, res) => {
  var worker;
  var UserSession;
  if (!checkForAlreadyConnected(socket))
  {
    userIDS.push(socket.handshake.address);
    UserSession = new userSession(userIDS[userIDS.length - 1]);
    userSessions.push(UserSession);
  }
  else {
    UserSession = getUserSession(socket.handshake.address);
    //UserSession.worker.WORKER.postMessage('Hi');
    if (!UserSession)
    {
      console.log('WTF');
    }
  }
  socket.emit('connected', UserSession.userID);

  socket.on('SaveSet', (set) =>{
    console.log("Called");
    saveQuestionSet(set);
  });
  socket.on('RetrieveListOfSets', (data) => {
    loadListOfSets();
    socket.emit('RecieveListOfSets', listOfSets);
  });
  socket.on('DeleteSet', (data) =>{
    console.log(data);
    var fileName = data + '.json';
    fs.unlink(questionLocations + fileName, (err) => {
      if (err) {console.log('Could not find file'); console.log(err); return;}
    });
    removeSetFromSetList(data);
  });
  socket.on('PlayGame', (data, res) =>{
    setName = data.setName;
    var questionSet = loadQuestionSet(setName);

    UserSession.playGame();

    workersSessionID.push(UserSession.worker);

    dataForWorker = {
      QUESTIONS: questionSet,
      SESSIONID: UserSession.worker.sessionID,
      USERID: UserSession.userID
    }

    res(dataForWorker.SESSIONID);

    var QuestionSet = assembleDataForWorker(HEADERSWORKER[3], dataForWorker);
    UserSession.worker.WORKER.postMessage(QuestionSet);
  });
  socket.on('JoinGame', (data) => {
    //console.log(data);
    var dataForWorker = {
      gameID: data,
      playerID: UserSession.userID
    }
      var UserDetails = assembleDataForWorker(HEADERSWORKER[4], dataForWorker);
      UserSession.worker.sessionID = data;
      UserSession.worker = getWorker(UserSession.sessionID);
      UserSession.worker.WORKER.postMessage(UserDetails);

  });
  socket.on('SubmitAnswer', (ans) =>{
    var dataForWorker = {
      answer: ans,
      playerID: UserSession.userID
    }
    data = assembleDataForWorker(HEADERSWORKER[5], dataForWorker);
    UserSession.worker.WORKER.postMessage(data);
  });
  socket.on('EndGame', (data) =>{
    UserSession.worker.WORKER.terminate();
  });
});

http.listen(8080, '10.1.10.20', ()=> {
  console.log('listening on *:8080');
});


//File management
var listOfSets = [];

var questionLocations = 'S:/Programming/JavaScript/AdventuresInJS/Small_Projects/QuestionGuess/QuestionGuessV4/Private/serverFiles/JSON/';

function saveQuestionSet(set){
  var setName = set.name;
  var fileName = setName + '.json';
  var json = JSON.stringify(set);
  fs.writeFile(questionLocations + fileName, json, 'utf8', function(err){
    if (err){
      console.log("God damnit");
    }
  });
  listOfSets.push(setName);
  saveListOfSets();
}

function saveListOfSets(){
  var fileName = 'list_of_sets.json';
  var directory = 'S:/Programming/JavaScript/AdventuresInJS/Small_Projects/QuestionGuess/QuestionGuessV4/Private/serverFiles/';
  var list = listOfSets;
  var json = JSON.stringify(list);
  fs.writeFile(directory + fileName, json, 'utf8', function(err){
    if (err) { console.log(error);}
  });
}

function loadHEADERS(){
  var directory = 'S:/Programming/JavaScript/AdventuresInJS/Small_Projects/QuestionGuess/QuestionGuessV4/Private/serverFiles/';
  var MAINFILE = directory + 'HEADERMAIN.json';
  var WORKERFILE = directory + 'HEADERWORKER.json';
  MAINFILE = fs.readFileSync(MAINFILE);
  HEADERSMAIN = JSON.parse(MAINFILE);
  WORKERFILE = fs.readFileSync(WORKERFILE);
  HEADERSWORKER = JSON.parse(WORKERFILE);
}

function loadQuestionSet(setName){
  var fileName = setName + '.json';
  file = fs.readFileSync(questionLocations + fileName);
  var obj = JSON.parse(file);
  return obj;
}

function loadListOfSets(){
  var fileLocation = 'S:/Programming/JavaScript/AdventuresInJS/Small_Projects/QuestionGuess/QuestionGuessV4/Private/serverFiles/list_of_sets.json';
  fs.readFile(fileLocation, function(err, data){
    if (err) { saveListOfSets(); loadListOfSets();}
    var sets = JSON.parse(data);
    listOfSets = sets;
  });
}

function removeSetFromSetList(setName){
  for (var i = 0; i < listOfSets.length; i++)
  {
    if (listOfSets[i] === setName)
    {
      listOfSets.splice(i, i);
      saveListOfSets();
      return;
    }
  }
  console.log("Couldn't find the specified item!");
}

//Thread Management
function startWorker(path, cb) {
  let worker = new Worker(path, {workerData: null});
  worker.on('message', (msg) =>{
    HEADER = msg.HEAD;
    if (HEADER === HEADERSMAIN[3])
    {
      //Send question to display to User
      io.emit('DisplayQuestion', msg.DATA);

    }
    else if (HEADER === HEADERSMAIN[2])
    {
      //Send User Stats
      console.log("Happenend");
      io.emit('UpdatePlayerStats', msg.DATA);
    }
    else if (HEADER === HEADERSMAIN[4])
    {
      io.emit('GameOver', msg.DATA);
    }
  });
  worker.on('error', function(err){
    console.log(err);
  });
  worker.on('exit', (code) =>{
    if (code != 0 && code != 1){
      console.error(new Error('Worker stopped with exit code ' + code))
    }
  });
  return worker;
}



var filePath = 'S:/Programming/JavaScript/AdventuresInJS/Small_Projects/QuestionGuess/QuestionGuessV4/Private/workerCode/GameRound.js';

/*
let newWorker = startWorker(filePath, (err, result) => {
  if (err) return console.error(err);
  //console.log("Did Stuffs");
  console.log(result.value);
});
*/
//Game Management
function assembleDataForWorker(HEADER, data)
{
  var DataForWorker = {
    HEAD: HEADER,
    DATA: data
  }
  return DataForWorker;
}
