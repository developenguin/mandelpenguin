
// Canvas and inputs
const canvas = document.getElementById('mandelbrot');
const ctx = canvas.getContext('2d');

const inputX = document.getElementById('xvalue');
const inputY = document.getElementById('yvalue');
const inputZoom = document.getElementById('zoom');

const drawButton = document.getElementById('draw');
const resetButton = document.getElementById('reset');

// Position and zoom
let zoom;
let panX;
let panY;

// Respond to change
inputX.addEventListener('change', (evt) => {
  panX = parseFloat(evt.target.value);
});

inputY.addEventListener('change', (evt) => {
  panY = parseFloat(evt.target.value);
});

inputZoom.addEventListener('change', (evt) => {
  zoom = parseFloat(evt.target.value);
});

canvas.addEventListener('click', e => {
  console.log(`Clicked on coordinates ${e.layerX},${e.layerY}`);
  console.log(`In the complex space these are ${e.layerX/zoom - panX},${e.layerY/zoom - panY}`);
});

drawButton.addEventListener('click', () => {
  drawCanvas();
});

resetButton.addEventListener('click', () => {
  resetScreen();
  drawCanvas();
});

// Computational constants
const maxIterations = 2000;

function resetScreen() {

  inputX.value = 2;
  inputY.value = 1.5;
  inputZoom.value = 300;

  zoom = parseFloat(inputZoom.value);
  panX = parseFloat(inputX.value);
  panY = parseFloat(inputY.value);

}

const drawPixel = (x, y, color) => {
  ctx.fillStyle = `hsl(${color.h},${color.s}%,${color.l}%`;
  ctx.fillRect(x, y, 1, 1);
};

function calculateEscapeValue(x, y) {

  // Convert to coordinates in the complex space
  let cX = x;
  let cY = y;

  // Calculate the escape value for the given coordinate
  for (let i = 0; i < maxIterations; i++) {

    const newCx = (cX * cX) - (cY * cY) + x;
    const newCy = 2 * (cX * cY) + y;

    cX = newCx;
    cY = newCy;

    if ((cX * cY) > 2) {
      // Number is outside of the set if it has not escaped
      return i / maxIterations * 100;
    }

  }

  // Number is not within the set if it has not escaped
  return 0;

}

function drawCanvas() {

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {

      const escValue = calculateEscapeValue(i/zoom - panX, j/zoom - panY);

      if (escValue === 0) {
        drawPixel(i, j, { h: 0, s: 0, l: 0 });
      } else {
        drawPixel(i, j, { h: escValue * maxIterations % 360, s: 100, l: escValue });
      }

    }
  }

}

resetScreen();
drawCanvas();
