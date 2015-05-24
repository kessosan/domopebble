/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
//var Vector2 = require('vector2');
var ajax = require('ajax');
var baseURL = 'http://domoticz.kessosan.info/json.htm?type=command';

var main = new UI.Card({
  title: 'Domopebble',
  icon: 'images/logo_domoticz_p.png',
  subtitle: 'Bienvenue sur Domopebble',
  body: 'appuyez sur un bouton.'
});


main.show();

main.on('click', 'select', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'halogène ON',
        icon: 'images/ampoule_on_p.png'
      }, {
        title: 'halogène OFF',
        icon: 'images/ampoule_off_p.png'
      }, {
        title: 'prise 2 ON',
        icon: 'images/ampoule_on_p.png'
      }, {
        title: 'prise 2 OFF',
        icon: 'images/ampoule_off_p.png'
      }, {
        title: 'portail ON/OFF',
        icon: 'images/portail_p.png'
      }]
    }]
  });
  menu.on('select', function(e) {
    var URL ='';
    
    if(e.itemIndex===0) {
      URL  = baseURL + '&param=switchlight&idx=16&switchcmd=On&level=0&passcode=';
    }
    
    if(e.itemIndex===1) {
      URL  = baseURL + '&param=switchlight&idx=16&switchcmd=Off&level=0&passcode=';
    }
  
    if(e.itemIndex===2) {
      URL  = baseURL + '&param=switchlight&idx=21&switchcmd=On&level=0&passcode=';
    }
    
    if(e.itemIndex===3) {
      URL  = baseURL + '&param=switchlight&idx=21&switchcmd=Off&level=0&passcode=';
    }
    
    if(e.itemIndex===4) {
      URL  = baseURL + '&param=switchlight&idx=23&switchcmd=On&level=0&passcode=';
    }
    
    // Make the request
    ajax(
      {
        url: URL,
        type: 'json'/*,
        headers: {
          Cookie : 'SID=',
          Connection: 'keep-alive'
        }*/
      },
      function(data) {
        // Success!
        //console.log('Light is ON!');
        console.log(JSON.stringify(data));
      },
      function(error) {
        // Failure!
        //console.log('Failed to lightning '+ error);
        console.log(JSON.stringify(data));
      }
    );
    
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    
  });

  menu.show();
});

//menu.items(1, [ { title: 'Prise commandee 2 ON' }, { title: 'Prise commandee 2 OFF' } ]);

/*main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});*/
