var canvas = document.getElementById('c'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth/1.5,
    h = canvas.height = window.innerHeight/1.5,
    start = null,
    frame = 0,
    allGraffiti = [],
    background = tinycolor('#232323');


function Graffiti() {
  this.body = ' ';
  this.font = '48px serif';
  this.x = Math.random() * w;
  this.y = Math.random() * h;
}

Graffiti.prototype.update = function() {
  ctx.font = this.font;
  ctx.fillStyle = tinycolor('#FFF000');
  ctx.fillText(this.body, this.x, this.y);
}

function update(timestep) {
  // housekeeping (timer, frame advancement)
  if (!start) start = timestep;
  var progress = timestep - start;
  frame += .5;

  for (var i=0; i<allGraffiti.length; i++) {
    allGraffiti[i].update();
  }
}


function initLoop(g) { // pass graffitiData in

  //instantiate objects based on data
  for (var i=0; i<g.length; i++) {
    var obj = new Graffiti;
    obj.body = g[i].body;
    allGraffiti.push(obj);
  }

  function animate(timestep) {
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
