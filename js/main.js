let texts = new Array();
let gameStarted = false;
var casingOff = false;
let chosenText = null;
let timeStarted = null;
let globalTextPosition = 0;
let errors = 0;
let input = "";

function onInit() {
  //get all texts from xml
  getTexts();

  //graph setup
  graphSetUp();

  //populate our dropdown with all texts
  populateDropdown(texts);

  //setup for all eventlisteners
  eventListenersSetUp();

  document.getElementById('input').disabled = true;
}

//setup for all event listeners
function eventListenersSetUp() {

  //gets and sends the text to set to setText
  document.getElementById("text-select").addEventListener('change', (event) => {
    setText(texts.find(text => text.id == event.target.value));
  });

  //eventlistener to start or stop game
  document.getElementById("start-stop").addEventListener('click', (event) => {
    StartStopGame();
  });

  //input eventlistener calls two methods
  document.getElementById("input").addEventListener('input', (event) => {
    if (event.data === null) {
      //sets the correct text to ignore backspaces
      document.getElementById('input').value = input;
    } else {
      newInput();
      stats();
    }
  });

  //check if we should ignore casing with a global bool
  document.getElementById('casing').addEventListener('change', (event) => {
    casingOff = event.target.checked;
  });

  //call method to filter texts by language and send them into the populate dropdown
  //and set the other checkbox as unchecked
  document.getElementById('swe').addEventListener('change', (event) => {
    if (event.target.checked) {
      populateDropdown(filterLanguageText('swedish'));
      document.getElementById('eng').checked = false;
    }
  });

  //call method to filter texts by language and send them into the populate dropdown
  //and set the other checkbox as unchecked
  document.getElementById('eng').addEventListener('change', (event) => {
    if (event.target.checked) {
      populateDropdown(filterLanguageText('english'));
      document.getElementById('swe').checked = false;
    }
  });
}

//Method to start or stop a game
function StartStopGame() {
  if (!gameStarted) {
    gameStarted = true;
    timeStarted = new Date();

    document.getElementById("start-stop-img").src = 'img/stop.png';
    document.getElementById("input").disabled = false;
    document.getElementById("input").placeholder = '';

    reset();
    setText(chosenText);
    graphSetUp();
  } else {
    document.getElementById("start-stop-img").src = 'img/start.png';
    document.getElementById("input").disabled = true;
    document.getElementById("input").placeholder = 'Press start to play  -->';
    gameStarted = false;
  }
}

//method to get all texts
function getTexts() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'xml/texts.xml', false);
  xhr.send(null);
  xml = xhr.responseXML;

  //Get all text tiles to loop through
  let titles = xml.getElementsByTagName("title");

  //loop through all text titles from xml
  for (let i = 0; i < titles.length; i++) {
    //Save the text values in an object
    let textValue = {
      id: i,
      title: xml.getElementsByTagName("title")[i].childNodes[0].nodeValue,
      author: xml.getElementsByTagName("author")[i].childNodes[0].nodeValue,
      language: xml.getElementsByTagName("language")[i].childNodes[0].nodeValue,
      text: xml.getElementsByTagName("text")[i].childNodes[0].nodeValue
    };

    //Save all objects into the text array
    texts.push(textValue)
  }
}

//filter the texts depending on the selected language
function filterLanguageText(language) {
  return texts.filter(text => text.language == language);
}

//method to set text
function setText(object) {
  reset();

  let charcount = 0;
  let wordcount = 0;

  let texttotype = document.getElementById('texttotype');
  texttotype.innerHTML = '';

  //loops through all chars in text and creates a span element for each that is appended 
  //each span gets an attribute id with their position in the text
  //it is easy to change the color of the span by adding an attribute later on
  for (let i = 0; i < object.text.length; i++) {
    let span = document.createElement('span');
    span.setAttribute('id', i.toString());
    span.appendChild(document.createTextNode(object.text.charAt(i)));
    texttotype.appendChild(span);

    //count the amount of chars
    charcount++;

    //count the amount of words
    if (inputBlankSpace(object.text.charAt(i))) {
      wordcount++;
    } else if (i === (object.text.length - 1)) {
      wordcount++;
    }
  }

  document.getElementById('title').innerHTML = object.title;
  document.getElementById('author').innerHTML = object.author + " (" + wordcount + "words, " + charcount + " chars)";

  chosenText = object;

  //sets the first char with yellow background to start
  let firstspan = document.getElementById(0);
  firstspan.style.backgroundColor = 'yellow';
  firstspan.style.color = 'black';
}

//populate our dropdown with all texts by looping
function populateDropdown(data) {
  document.getElementById("text-select").innerHTML = '';

  data.forEach(text => {
    let option = document.createElement("option");
    option.text = text.title;
    option.value = text.id;

    document.getElementById("text-select").add(option);
  });

  //sets the first text in the array of texts
  let text = texts.find(text => text.id == data[0].id);
  setText(text);
}

//Setup for the canvas where we put its start position to the left and in the middle
function graphSetUp() {
  let c = document.querySelector('canvas').getContext('2d');
  c.beginPath();
  c.moveTo(0, 200);
}

//Method to draw on the graph
function drawGraph(netWpm) {
  let canvas = document.querySelector('canvas').getContext('2d');

  //sets the x and y axis
  let x = (400 / chosenText.text.length) * globalTextPosition;
  let y = (100 - netWpm) * 2;

  //add where the line should be drawn to
  canvas.lineTo(x, y);

  //set lines properties
  canvas.lineWidth = 1.5;
  canvas.strokeStyle = 'red';

  //Draw the line
  canvas.stroke();
}

//Method to manipulate and handle the text inputs while colors in the text
function newInput() {
  let inputChar = document.getElementById('input').value.charAt(document.getElementById('input').value.length - 1);
  let textChar = chosenText.text.charAt(globalTextPosition);

  //Checks if we are ignoring casing and if yes  we are putting it to lowercase
  if (casingOff) {
    textChar = textChar.toLowerCase();
    inputChar = inputChar.toLowerCase();
  }

  //get the current span and sets background as transparent
  //then sets its color as black if its correct and red if its wrong
  //if its a blankspace then its set as a red background instead
  let span = document.getElementById(globalTextPosition);
  span.style.backgroundColor = 'transparent';

  if (textChar != inputChar) {

    if (textChar.trim() === "") {
      span.style.backgroundColor = 'red';
    } else {
      span.style.color = 'red';
    }

    errors++;
    playSound();
  } else {
    span.style.color = 'antiquewhite';
  }

  //get the span that comes after and gives it a yellow background
  let nextspan = document.getElementById(globalTextPosition + 1);
  nextspan.style.backgroundColor = 'yellow';
  nextspan.style.color = 'black';

  // cleans up the input if its a blankspace
  if (inputBlankSpace(inputChar)) {
    document.getElementById('input').value = "";
  }

  // sets the input text to input variable to be able to ignore backspaces
  input = document.getElementById('input').value;

  //udpates the global var which is the index of our text position
  globalTextPosition++;
}

//check if the char is a white space
function inputBlankSpace(char) {
  if (char.trim() === "") {
    return true;
  } else {
    return false;
  }
}

//method which plays a sound if the input is not correct
function playSound() {
  new Audio('audio/fail.mp3').play();
}

//Method to calc the stats
function stats() {
  const elapsedminutes = ((new Date().getTime() - timeStarted.getTime()) / 1000) / 60;
  let accuracy = 0;
  if (errors != 0) {
    accuracy = 100 - ((errors / globalTextPosition) * 100);
  } else {
    accuracy = 100;
  }

  const grossWPM = (globalTextPosition / 5) / elapsedminutes;
  const netWPM = grossWPM - (errors / elapsedminutes);

  //set the values
  document.getElementById('grosswpm').innerHTML = Math.round(grossWPM).toString() + " gross WPM";
  document.getElementById('netwpm').innerHTML = Math.round(netWPM).toString() + " net WPM";

  if (errors > 1 || errors === 0) {
    document.getElementById('errors').innerHTML = errors.toString() + " errors";
  } else {
    document.getElementById('errors').innerHTML = errors.toString() + " error";
  }
  document.getElementById('accuracy').innerHTML = Math.round(accuracy).toString() + '% accuracy';

  drawGraph(netWPM);
}

//Method to reset everything
function reset() {
  globalTextPosition = 0;
  errors = 0;

  document.getElementById('grosswpm').innerHTML = 0 + " gross WPM";
  document.getElementById('netwpm').innerHTML = 0 + " net WPM";
  document.getElementById('errors').innerHTML = 0 + " errors";
  document.getElementById('accuracy').innerHTML = 0 + '% accuracy';
  document.getElementById('input').value = "";

  let canvas = document.querySelector('canvas');
  let c = canvas.getContext('2d');

  c.clearRect(0, 0, canvas.width, canvas.height);
}

//call onInit when DOM load
window.addEventListener('load', onInit, false);