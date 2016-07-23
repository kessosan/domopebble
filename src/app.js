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


/*
*  fetch power details
*/
var parsePowerFeed = function(data) {
  var items = [];

  // Add to menu items array
  items.push({
    title:"actuel",
    subtitle:data.result[0].Usage
  });

  items.push({
    title:"aujourd'hui",
    subtitle:data.result[0].CounterToday
  });

  // Finally return whole array
  return items;
};

/*
*  fetch temperature details
*/
var parseTemperatureFeed = function(data) {
  var items = [];

  // Add to menu items array
  items.push({
    title:"cuisine",
    subtitle:data.result[1].Data
  });

  items.push({
    title:"mezzanine",
    subtitle:data.result[2].Data
  });
  
  items.push({
    title:"salle à manger",
    subtitle:data.result[3].Data
  });

  // Finally return whole array
  return items;
};

var main = new UI.Card({
  title: 'Domopebble',
  icon: 'images/logo_domoticz_p.png',
  //subtitle: 'Bienvenue sur Domopebble',
  body: 'appuyez sur select'
});

/*
*  fetch sensors details
*/
var parseCapteursFeed = function(data) {
  var items = [];

  // Add to menu items array
  items.push({
    title:"porte entrée",
    subtitle:data.result[4].Status
  });

  items.push({
    title:"porte garage",
    subtitle:data.result[5].Status
  });
  
  items.push({
    title:"portail",
    subtitle:data.result[3].Status
  });

  // Finally return whole array
  return items;
};

var main = new UI.Card({
  title: 'Domopebble',
  //icon: 'images/logo_domoticz_p.png',
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
        title: 'surpresseur OFF',
        icon: 'images/goutte-eau_p.png'
      },{
        title: 'portail ON/OFF',
        icon: 'images/portail_p.png'
      }, {
        title: 'conso élec.',
        icon: 'images/eclair_p.png'
      }, {
        title: 'température',
        icon: 'images/thermometre_p.png'
      },{
        title: 'capteurs',
        icon: 'images/capteur_p.png'
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
      URL  = baseURL + 'type=command&param=switchlight&idx=7&switchcmd=Off&level=0&passcode=';
      device = "surpresseur"; 
      action = device+' OFF';
    }
    
    if(e.itemIndex===5) {
      URL  = baseURL + 'type=command&param=switchlight&idx=23&switchcmd=On&level=0&passcode=';
      device = "portail"; 
      action = 'ouv./ferm. '+device;
    }
    
    if(e.itemIndex===6) {
      URL  = baseURL + 'type=devices&filter=utility&used=true&order=Name&plan=0';
      device = "électricité"; 
      action = 'consommation '+device;
    }
    
    if(e.itemIndex===7) {
      URL  = baseURL + 'type=devices&filter=temp&used=true&order=Name';
      device = "température"; 
      action = 'température '+device;
    }
    
    if(e.itemIndex===8) {
      URL  = baseURL + 'type=devices&filter=light&used=true&order=Name&plan=0';
      device = "capteurs"; 
      action = 'capteurs '+device;
    }
    
    waitingWindow.add(text);
    waitingWindow.show();
    
    // Make the request
    ajax(
      {
        url: URL,
        type: 'json',
        headers: {
          Cookie : 'SID=26601a08260b5a4f788c616e6eb027fe_MDlhOTVhM2QtNmRkMi00MGZkLWE0YjAtNzRiNDY2NDZhZWJi.1495662702',
          Connection: 'keep-alive'
        }
      },
      function(data) {
        // Success!
        var result = data.status;
        
        if(device=='électricité'/*data.result[0].Type=='Energy'*/) {
                 
          // Create an array of power menu items
          var menuPowerItems = parsePowerFeed(data, 10);
          
          // Check the items are extracted OK
          for(var i = 0; i < menuPowerItems.length; i++) {
            console.log(menuPowerItems[i].title + ' | ' + menuPowerItems[i].subtitle);
          }
          
          var powerDetail = new UI.Menu({
            sections: [{
              title: 'Consommation électrique',
              items: menuPowerItems
            }]
          });

          // Show the Menu, hide the splash
          powerDetail.show();
          waitingWindow.hide();
          
        } else if(device=='température') {
         
          // Create an array of temperature menu items
          var menuTemperatureItems = parseTemperatureFeed(data, 10);
          
          // Check the items are well extracted
          for(var j = 0; j < menuTemperatureItems.length; j++) {
            console.log(menuTemperatureItems[j].title + ' | ' + menuTemperatureItems[j].subtitle);
          }
          
          var temperatureDetail = new UI.Menu({
            sections: [{
              title: 'Température',
              items: menuTemperatureItems
            }]
          });

          // Show the Menu, hide the splash
          temperatureDetail.show();
          waitingWindow.hide();
        
        } else if(device=='capteurs') {
         
          // Create an array of temperature menu items
          var menuCapteursItems = parseCapteursFeed(data, 10);
          
          // Check the items are extracted OK
          for(var k = 0; k < menuCapteursItems.length; k++) {
            console.log(menuCapteursItems[k].title + ' | ' + menuCapteursItems[k].subtitle);
          }
          
          var capteursDetail = new UI.Menu({
            sections: [{
              title: 'Capteurs',
              items: menuCapteursItems
            }]
          });

          // Show the Menu, hide the splash
          capteursDetail.show();
          waitingWindow.hide();
        
        } else {
          result = data.status;
          
          // Add to splashWindow and show 
          //waitingWindow.hide();
          main.subtitle(action);
          main.body(result);
          main.show();
          
          Vibe.vibrate('short');
          waitingWindow.hide();
        }
        
        console.log(action + ' ' +data.status +" !");
        console.log(JSON.stringify(data));
        
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
        waitingWindow.hide();
      }
    );
    
    //console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    //console.log('The item is titled "' + e.item.title + '"');
    //waitingWindow.hide();
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
