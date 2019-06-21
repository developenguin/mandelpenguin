
// Canvas and visual properties
const canvas = document.getElementById('mandelbrot');
const ctx = canvas.getContext('2d');

let zoom = 200;
let panX = 1.5;
let panY = 1;

// Computational constants
const maxIterations = 100;

const drawPixel = (x, y, color) => {
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.g},1`;
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

  }

  if ((cX * cY) < 5) {
    // Number is within the set if it has escaped
    return true;
  }

  // Number is not within the set if it has not escaped
  return false;

}

for (let i = 0; i < canvas.width; i++) {
  for (let j = 0; j < canvas.height; j++) {

    const escValue = calculateEscapeValue(i/zoom - panX, j/zoom - panY);

    if (escValue) {
      drawPixel(i, j, {
        r: 0, g: 0, b: 0
      })
    }

  }
}
