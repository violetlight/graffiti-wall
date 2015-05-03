var canvas = document.getElementById('c'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth/1.5,
    h = canvas.height = window.innerHeight/1.5,
    start = null,
    frame = 0,
    background = tinycolor('#232323');

function update() {
  // housekeeping (timer, frame advancement)
  if (!start) start = timestep;
  var progress = timestep - start;
  frame += .5;
}

function animate(timestep) {
  window.requestAnimationFrame(animate);
  // options go here
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);
  update();
}

$(document).ready(function() {
  window.requestAnimationFrame(animate);
});
