
onmessage = function(evt) {

  if (evt.data.isStartMessage) {
    postMessage({ started: true });
    return;
  }

  const { y, x, zoom, middleX, middleY, maxIterations } = evt.data;

  postMessage({
    px: x,
    py: y,
    escValue: calculateEscapeValue({
      x: x/zoom + middleX,
      y: y/zoom + middleY,
      maxIterations
    })
  });

};

function calculateEscapeValue(options) {

  const { x, y, maxIterations } = options;

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
