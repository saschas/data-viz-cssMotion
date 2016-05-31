//__________________________ Variables


var button = document.getElementById('record');
var dataHolder = document.getElementById('data');
var t = 0;

var dataAcc = [];
var dataMotion = [];
var recordArray = [];

var record = false;

//__________________________ EXTRA FUNCTIONS
(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)
//__________________________ Record

button.addEventListener('click',function() {
  this.classList.toggle('record-active')
  if(!record){

    record = true;
  }else{
    console.save(recordArray);

    socket.emit('save', recordArray);
    record = false;
  }

});


//__________________________ Socket

  var socket = io();

//__________________________ Motion Detection

if (window.DeviceOrientationEvent) {
  
  window.addEventListener('deviceorientation', function(eventData) {
        var LR = eventData.gamma;
        var FB = eventData.beta;
        var DIR = eventData.alpha;
        deviceOrientationHandler(LR, FB, DIR);
        }, false);

  window.addEventListener('devicemotion', function () {

      motionHandler(event.acceleration.x * 2, event.acceleration.y * 2)
      
    }, true);


} else {
        alert("Not supported on your device or browser.  Sorry.");
}





function deviceOrientationHandler(LR, FB, DIR) {
   //for webkit browser
   dataHolder.innerHTML = "rotate("+ LR +"deg) rotate3d(1,0,0, "+ (FB*-1)+"deg)"  + "rotate("+ LR +"deg) rotate3d(1,0,0, "+ (FB*-1)+"deg)";


     dataAcc = {
      time : new Date(),
      rot : LR,
      fb : FB*-1
     }
}


function motionHandler(x,y) {
   //for webkit browser
   dataHolder.innerHTML = "x: "+ x + ", y: "+ y;
     dataMotion = {
        time : new Date(),
        x : x,
        y : y
     };
  
  socket.emit('motion', "x" + x + "y" + y );
}

function render(time){
  requestAnimationFrame(render);


    if(record){     
      recordArray.push({
        acc : dataAcc,
        motion : dataMotion
      });
    }
}


render(t);
