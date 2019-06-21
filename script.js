
const canvas = document.getElementById('mandelbrot');
const ctx = canvas.getContext('2d');

const drawPixel = (x, y, color) => {
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.g},1`;
  ctx.fillRect(x, y, 1, 1);
};

for (i = 0; i < 400; i++) {
  for (j = 0; j < 400; j++) {
    drawPixel(i, j, {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    });
  }
}
