/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var baseURL = 'http://domoticz.kessosan.info/json.htm?';
var Vibe = require('ui/vibe');

var main = new UI.Card({
  title: 'Domopebble',
  icon: 'images/logo_domoticz_p.png',
  //subtitle: 'Bienvenue sur Domopebble',
  body: 'appuyez sur select'
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
      }, {
        title: 'conso élec.',
        icon: 'images/eclair_p.png'
      }]
    }]
  });
  
  menu.show();
  
  menu.on('select', function(e) {
    var URL ='';
    var device = '';
    var action = '';
    
    //screen while waiting for request to be done
    var waitingWindow = new UI.Window();
    
    // Text element to inform user
    var text = new UI.Text({
      position: new Vector2(0, 0),
      size: new Vector2(144, 168),
      text:'envoi de la requête ...',
      font:'GOTHIC_28_BOLD',
      color:'black',
      textOverflow:'wrap',
      textAlign:'center',
      backgroundColor:'white'
    });
    
    if(e.itemIndex===0) {
      URL  = baseURL + 'type=command&param=switchlight&idx=16&switchcmd=On&level=0&passcode=';
      device = "halogène";
      action = device+' ON';
    }
    
    if(e.itemIndex===1) {
      URL  = baseURL + 'type=command&param=switchlight&idx=16&switchcmd=Off&level=0&passcode=';      
      device = "halogène";
      action = device+' OFF';
    }
  
    if(e.itemIndex===2) {
      URL  = baseURL + 'type=command&param=switchlight&idx=21&switchcmd=On&level=0&passcode=';
      device = "prise 2"; 
      action = device+' ON';
    }
    
    if(e.itemIndex===3) {
      URL  = baseURL + 'type=command&param=switchlight&idx=21&switchcmd=Off&level=0&passcode=';
      device = "prise 2"; 
      action = device+' OFF';
    }
    
    if(e.itemIndex===4) {
      URL  = baseURL + 'type=command&param=switchlight&idx=23&switchcmd=On&level=0&passcode=';
      device = "portail"; 
      action = 'ouv./ferm. '+device;
    }
    
    if(e.itemIndex===5) {
      URL  = baseURL + 'type=devices&filter=utility&used=true&order=Name&plan=0';
      device = "électricité"; 
      action = 'consommation '+device;
    }
    
    waitingWindow.add(text);
    waitingWindow.show();
    
    // Make the request
    ajax(
      {
        url: URL,
        type: 'json'
      },
      function(data) {
        // Success!
        var result = data.status;
        
        if(data.result[0].Type=='Energy') {
          result = data.result[0].Usage;
        } else {
          result = data.status;
        }
        
        console.log(action + ' ' +data.status +" !");
        console.log(JSON.stringify(data));
        
        // Add to splashWindow and show        
        main.subtitle(action);
        main.body(result);
        main.show();
        
        Vibe.vibrate('short');        
        
      },
      function(error,data) {
        // Failure!
        //console.log('Failed to lightning '+ error);
        console.log(JSON.stringify(data));
        
        main.subtitle(action);
        //main.body(data.status +'('+error+')');
        main.body("erreur"); 
        main.show();
        
        Vibe.vibrate('long');  
      }
    );
    
    //console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    //console.log('The item is titled "' + e.item.title + '"');
    
  });

});

/*function parseJSONResponse(data){
  var result = null;
  var parsedJSON = JSON.parse(data.result);
  
  for (var i=0;i<parsedJSON.length;i++) {
    alert(parsedJSON[0].Id);
  }

  return result;
}*/

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
