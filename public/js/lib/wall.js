var canvas = document.getElementById('c'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth/1.5,
    h = canvas.height = window.innerHeight/1.5,
    start = null,
    frame = 0,
    allGraffiti = [],
    background = tinycolor('#232323');


function Graffiti() {
  this.body = "";
}


function update(timestep) {
  // housekeeping (timer, frame advancement)
  if (!start) start = timestep;
  var progress = timestep - start;
  frame += .5;
}


function initLoop(g) { // pass graffitiData in

  //instantiate objects based on data
  for (var i=0; i<g.length; i++) {
    var obj = new Graffiti;
    obj.body = g[i].body;
    allGraffiti.push(obj);
  }

  function animate(timestep) {
    console.log(allGraffiti);
    window.requestAnimationFrame(animate);
    // options go here
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
    update(timestep);
  }

  window.requestAnimationFrame(animate); // fix this
}


$(document).ready(function() {
  $.get('/g', function(graffitiData) {
    initLoop(graffitiData);
  });
});
