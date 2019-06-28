
// Canvas and inputs

const canvasHalfWidth = 400;
const canvasHalfHeight = 400;
const canvas = document.getElementById('mandelbrot');

canvas.width = canvasHalfWidth * 2;
canvas.height = canvasHalfHeight * 2;

const ctx = canvas.getContext('2d');

const inputX = document.getElementById('xvalue');
const inputY = document.getElementById('yvalue');
const inputZoom = document.getElementById('zoom');
const inputMaxIterations = document.getElementById('max');

const drawButton = document.getElementById('draw');
const resetButton = document.getElementById('reset');
const zoomInButton = document.getElementById('zoomin');
const zoomOutButton = document.getElementById('zoomout');

// Position and zoom
let zoom;
let maxIterations;

let middleX;
let middleY;

// Respond to change
inputX.addEventListener('change', (evt) => {
  middleX = parseFloat(evt.target.value);
});

inputY.addEventListener('change', (evt) => {
  middleY = parseFloat(evt.target.value);
});

inputZoom.addEventListener('change', (evt) => {
  zoom = parseInt(evt.target.value);
});

inputMaxIterations.addEventListener('change', (evt) => {
  maxIterations = parseInt(evt.target.value);
});

canvas.addEventListener('click', e => {

  const clickX = e.layerX;
  const clickY = e.layerY;

  middleX = (clickX - canvasHalfWidth) / zoom + middleX;
  middleY = (clickY - canvasHalfHeight) / zoom + middleY;

  inputX.value = middleX;
  inputY.value = middleY;

  drawCanvas();

});

zoomInButton.addEventListener('click', () => {
  zoom *= 2;
  inputZoom.value = zoom;
  drawCanvas();
});

zoomOutButton.addEventListener('click', () => {
  zoom /= 2;
  inputZoom.value = zoom;
  drawCanvas();
});

drawButton.addEventListener('click', () => {
  drawCanvas();
});

resetButton.addEventListener('click', () => {
  resetScreen();
  drawCanvas();
});

function resetScreen() {

  inputX.value = 0.0;
  inputY.value = 0.0;
  inputZoom.value = 300;
  inputMaxIterations.value = 3000;

  zoom = parseInt(inputZoom.value);
  maxIterations = parseInt(inputMaxIterations.value);
  middleX = parseFloat(inputX.value);
  middleY = parseFloat(inputY.value);

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
      // Number is inside of the set if it has not escaped
      return i / maxIterations * 100;
    }

  }

  // Number is not within the set if it has not escaped
  return 0;

}

function drawCanvas() {

  // We start at -canvasHalfWidth and height to have the middle of the canvas be the
  // middle of the complex space.
  for (let i = -canvasHalfWidth; i < canvasHalfWidth; i++) {
    for (let j = -canvasHalfHeight; j < canvasHalfHeight; j++) {

      const escValue = calculateEscapeValue(i/zoom + middleX, j/zoom + middleY);

      if (escValue === 0) {
        drawPixel(i + canvasHalfWidth, j + canvasHalfHeight, { h: 0, s: 0, l: 0 });
      } else {
        drawPixel(i + canvasHalfWidth, j + canvasHalfHeight, { h: escValue * maxIterations % 360, s: 100, l: escValue });
      }

    }
  }

}

resetScreen();
drawCanvas();
