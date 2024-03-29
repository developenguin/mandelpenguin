
// Canvas and inputs

const canvasHalfWidth = 640;
const canvasHalfHeight = 400;
const canvas = document.getElementById('mandelbrot');

canvas.width = canvasHalfWidth * 2;
canvas.height = canvasHalfHeight * 2;

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

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

  startDrawingCanvas();

});

zoomInButton.addEventListener('click', () => {
  zoom *= 2;
  inputZoom.value = zoom;
  startDrawingCanvas();
});

zoomOutButton.addEventListener('click', () => {
  zoom /= 2;
  inputZoom.value = zoom;
  startDrawingCanvas();
});

drawButton.addEventListener('click', () => {
  startDrawingCanvas();
});

resetButton.addEventListener('click', () => {
  resetScreen();
  startDrawingCanvas();
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
  ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]}`;
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
      return i;
    }

  }

  // Number is not within the set if it has not escaped
  return 0;

}

// Maximum parallel workers
const poolSize = 5;

function drawCanvasUsingWorkers() {

  let y = -canvasHalfHeight;

  const workers = [];

  let i = 0;

  // build worker pool
  while (i < poolSize) {

    const worker = new Worker('worker.js');

    worker.onmessage = function(evt) {

      if (evt.data.isStarted) {

      } else {

        const row = evt.data.row;
        const array = new Uint8ClampedArray(row);

        const imageData = new ImageData(array, canvasHalfWidth * 2, 1);

        ctx.putImageData(imageData,0, y + canvasHalfHeight);

      }

      if (y === canvasHalfHeight) {
        worker.terminate();
        return;
      }

      if (y < canvasHalfHeight) {
        y++;
      }

      worker.postMessage({
        zoom,
        middleX,
        middleY,
        maxIterations,
        y,
        canvasHalfWidth
      });

    };

    workers.push(worker);

    i++;

  }

  // Start the workers with an empty message so they can pick up coordinates on their own
  workers.forEach(worker => {
    worker.postMessage({ isStartMessage: true });
  });

}

function drawCanvas() {

  // We start at -canvasHalfWidth and height to have the middle of the canvas be the
  // middle of the complex space.
  for (let i = -canvasHalfWidth; i < canvasHalfWidth; i++) {
    for (let j = -canvasHalfHeight; j < canvasHalfHeight; j++) {

      const escapeValue = calculateEscapeValue(i/zoom + middleX, j/zoom + middleY);

      const color = getColorForEscapeValue({
        escapeValue,
        maxIterations
      });

      drawPixel(i + canvasHalfWidth, j + canvasHalfHeight, color);

    }
  }

}

function startDrawingCanvas() {

  const isUseWorkers = document.getElementById('workers').checked;

  if (isUseWorkers) {
    drawCanvasUsingWorkers();
  } else {
    drawCanvas();
  }

}

resetScreen();
startDrawingCanvas();
