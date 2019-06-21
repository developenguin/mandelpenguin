
// Canvas and visual properties
const canvas = document.getElementById('mandelbrot');
const ctx = canvas.getContext('2d');

let zoom = 3000;
let panX = 0.7;
let panY = 0.6;

// Computational constants
const maxIterations = 1000;

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

    if ((cX * cY) > 5) {
      // Number is outside of the set if it has not escaped
      return i / maxIterations * 100;
    }

  }

  // Number is not within the set if it has not escaped
  return 0;

}

for (let i = 0; i < canvas.width; i++) {
  for (let j = 0; j < canvas.height; j++) {

    const escValue = calculateEscapeValue(i/zoom - panX, j/zoom - panY);

    if (escValue === 0) {
      drawPixel(i, j, { h: 0, s: 0, l: 0 });
    } else {
      drawPixel(i, j, { h: 0, s: 100, l: escValue });
    }

  }
}
