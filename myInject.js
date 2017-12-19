'use strict';

var injectDOMElement = function injectDOMElement(tagName, targetSelector) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var element = document.createElement(tagName);
  Object.keys(options).forEach(function (key) {
    return element[key] = options[key];
  });
  document.querySelector(targetSelector).appendChild(element);
  return element;
};

var hostName = window.botpressSettings && window.botpressSettings.hostname;
var host = hostName ? 'http://' + hostName : '';

window.addEventListener('message', function (_ref) {
  var data = _ref.data;

  if (!data || !data.type || data.type !== 'setClass') return;
  document.querySelector('#bp-widget').setAttribute('class', data.value);
});

if (!document.querySelector('#bp-web-widget')) {
  var styleHref = host + '/api/botpress-platform-webchat/inject.css';
  var iframeHTML = '<iframe id=\'bp-widget\'\n                              src=\'' + host + '/lite/?m=platform-webchat&v=embedded\' />';

  injectDOMElement('link', 'head', { type: 'text/css', rel: 'stylesheet', href: styleHref });
  injectDOMElement('div', 'body', { id: 'bp-web-widget', innerHTML: iframeHTML });

  var iframeWindow = document.querySelector('#bp-web-widget > #bp-widget').contentWindow;
  var injectionScript = document.querySelector('#botpress-platform-webchat-injection');

  var _ref2 = injectionScript ? injectionScript.dataset : { optionsJson: '{}' },
      optionsJson = _ref2.optionsJson;

  iframeWindow.botpressChatOptions = Object.assign({}, JSON.parse(optionsJson));

  window.botpressChat = function (action) {
    return iframeWindow.postMessage(action, '*');
  };
}