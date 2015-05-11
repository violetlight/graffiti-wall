var canvas = document.getElementById('c'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth/1.5,
    h = canvas.height = window.innerHeight/1.5,
    start = null,
    second = 1000, // milliseconds
    frame = 0,

    // FPS-related
    fps = 30,
    now,
    delta,
    then = Date.now(),
    interval = 1000/fps,

    allGraffiti = [],
    ageLimit = 1*(second*60), // three minutes
    background = tinycolor('#232323');


function rangeMap(inMin, inMax, outMin, outMax, inVal) {
  // this function maps a value in the range
  //    inMin < inVal < inMax
  //  in proportion to a value in the range
  //    outMin < outVal < outMax
  // and returns outVal
  var outVal = ((inVal - inMin) * (outMax - outMin) / (inMax - inMin)) + outMin;
  return outVal;
}

function Graffiti() {
  this.font = '48px serif';
}

Graffiti.prototype.update = function() {
  ctx.font = this.font;
  var alpha = rangeMap(0, ageLimit, 1, 0, this.getAge());
  this.color.setAlpha(alpha);
  this.color.desaturate(.001);

  // draw
  ctx.fillStyle = this.color;
  ctx.fillText(this.body, this.x, this.y);
  //this.color.spin(1);
}

Graffiti.prototype.getAge = function() {
  var now = new Date();
  return (now - this.createdAt);
}

function update(timestep) {
  // housekeeping (timer, frame advancement)
  if (!start) start = timestep;
  var progress = timestep - start;
  frame += .5;

  for (var i=0; i<allGraffiti.length; i++) {
    allGraffiti[i].update();

    // remove dead graffiti
    if (allGraffiti[i].getAge() > ageLimit) {
      allGraffiti.splice(i, 1);
      i--;
    }
  }// end of update loop over allGraffiti
}


function loop(g) { // pass graffitiData in

  // unpack data and instantiate objets for canvas
  for (var i=0; i<g.length; i++) {
    var obj = new Graffiti;
    obj.createdAt = new Date(g[i].createdAt);
    obj.body = g[i].body;
    var txt = ctx.measureText(g[i].body);
    obj.x = rangeMap(0, 100, 0, w-txt.width*2, g[i].x);
    obj.y = rangeMap(0, 100, 0, w, g[i].y);
    obj.color = tinycolor(g[i].color);
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
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame   ||
    window.webkitRequestAnimationFrame    ||
    window.mozRequestAnimationFrame       ||
    window.oRequestAnimationFrame         ||
    window.msRequestAnimationFrame        ||
    function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();


  $.get('/g', function(graffitiData) {
    loop(graffitiData);
  });
});
