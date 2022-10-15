// ==UserScript==
// @name         Bycs-Login
// @version      1.0.0
// @description  QR-Code Login to Bycs
// @author       liongames6000(Linus Lauer)
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/liongames6000/bycstampermonkey/master/bycs_login.js
// @match        https://idp.mebis.bayern.de/idp/profile/SAML2/POST/SSO*
// @require      https://unpkg.com/@zxing/library@latest
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @require      https://raw.githubusercontent.com/csquared/fernet.js/master/fernetBrowser.js
// ==/UserScript==


(function() {
    'use strict';

    const html = '<div id="sourceSelectPanel" style="display:none"><label for="sourceSelect">Kamera auswählen:</label><select id="sourceSelect" style="max-width:400px"></select></div><div><video id="video" width="300" height="200" style="border: 1px solid gray"></video></div><label id="result">Result:</label><pre id="result"><code id="result"></code></pre>'

    console.log("test");

    $("form").hide();
    $("form").before(html);
    $("#result").hide();

    function decodeOnce(codeReader, selectedDeviceId) {
        codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
            decryptToken(result.text);
        }).catch((err) => {
          console.error(err)
          $('result').textContent = err
        })

        
      }
      
      window.addEventListener('load', function () {
        let selectedDeviceId;
        const codeReader = new ZXing.BrowserQRCodeReader()
        console.log('ZXing code reader initialized')
      
        codeReader.getVideoInputDevices()
          .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('sourceSelect')
            selectedDeviceId = videoInputDevices[0].deviceId
            decodeOnce(codeReader, selectedDeviceId);
            if (videoInputDevices.length >= 1) {
              videoInputDevices.forEach((element) => {
                const sourceOption = document.createElement('option')
                sourceOption.text = element.label
                sourceOption.value = element.deviceId
                sourceSelect.appendChild(sourceOption)
              })
      
              sourceSelect.onchange = () => {
                selectedDeviceId = sourceSelect.value;
                decodeOnce(codeReader, selectedDeviceId);
              };
      
              const sourceSelectPanel = document.getElementById('sourceSelectPanel')
              sourceSelectPanel.style.display = 'block'
            }
      
          })
          .catch((err) => {
            console.error(err)
          })
      })
    
})();

function decryptToken(token) {
    var secret = new fernet.Secret("FayzrccaiZ4yfmcUQ-Day2M_e4UUuZ1kvdckqDtOwkE=");

    var token = new fernet.Token({
        secret: secret,
        token: token,
        ttl: 0
    })
    var data = token.decode();
    var creds = data.split(";");

    //login
    $("#username").val(creds[0]);
    $("#password").val(creds[1]);
    $("#submitbutton").click();

}