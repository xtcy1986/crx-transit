/*
 * TransIt Event
 * 
 * jshint strict: true
 */

var translators = require('./translators');
var app = require('./config/application');

// Key name to store current text in local storage
const CURRENT_TEXT_KEY = 'transit_current_text';

// Setter / Getter for current text
// 
// If text if passed, update `current_text` in local storage,
// otherwise, read from local storage.
function currentText(text) {
  if (text) {
    localStorage.setItem(CURRENT_TEXT_KEY, text);
    return text;
  } else {
    return localStorage.getItem(CURRENT_TEXT_KEY);
  }
}

// Translate text and send result back
// 
// TODO: Cache translated result to speed up querying.
function translateHanlder(message, sender, sendResponse) {
  const translator = translators[app.options.translator];
  translator.translate(message.text, sendResponse);
}

// Inspect translation works only on word
function canTranslate(text) {
  return /^[a-z]+(\'|\'s)?$/i.test(text);
}

// Save current selection to localStorage
function selectionHandler(message, sender, sendResponse) {
  currentText(message.text);
}

function currentTextHandler(message, sender, sendResponse) {
  sendResponse(currentText());
}

app.registerMessageDispatcher({
  translate: translateHanlder,
  selection: selectionHandler,
  currentText: currentTextHandler
});

app.initOptions();

// Listen to extension update and show update notes
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == 'update') {
    app.showUpdateNotes();
  }
});
