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
    maxSize = 60, // px, this is the size newest graffiti starts as
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
  this.size = maxSize;
  this.font = 'px serif';
}

Graffiti.prototype.update = function() {
  ctx.font = this.size + this.font;
  var alpha = rangeMap(0, ageLimit, 1, 0, this.getAge()); // age == distance
  this.color.setAlpha(alpha); // "fog" obscures objects in distance
  this.color.desaturate(.08); // rate of desaturation


  // draw
  ctx.fillStyle = this.color;
  var txt = ctx.measureText(this.body);
  ctx.fillText(this.body, this.center-(txt.width/2), this.y);
  //this.color.spin(1);

  this.size = rangeMap(0, ageLimit, maxSize, 0, this.getAge());
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
    allGraffiti[i].update(); // call individual update for each Graffiti

    // remove dead graffiti
    if (allGraffiti[i].getAge() > ageLimit) {
      allGraffiti.splice(i, 1);
      i--;
    }
  } // end of update loop over allGraffiti
}


function loop(g) { // pass graffitiData in
  // unpack data and instantiate objets for canvas
  for (var i=0; i<g.length; i++) {

    // instantiate new Graffiti
    var obj = new Graffiti;
    obj.createdAt = new Date(g[i].createdAt);

    // set graffiti text
    obj.body = g[i].body;
    // measure its size for use in rendering
    var txt = ctx.measureText(g[i].body);

    // random start location
    obj.x = rangeMap(0, 100, 0, w-txt.width, g[i].x);
    obj.y = rangeMap(0, 100, 0, h, g[i].y);
    obj.center = obj.x + txt.width/2;

    // "root" color in db. maybe make a random one here instead,
    // as storing front end details in the back end is bad.
    obj.color = tinycolor(g[i].color);

    // color initialization
    obj.color.setAlpha(.8);
    obj.color.saturate(80);

    allGraffiti.push(obj);
  }

  // animation loop
  function animate(timestep) {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
    update(timestep);
    console.log(allGraffiti.length);
  }

  window.requestAnimationFrame(animate);
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
