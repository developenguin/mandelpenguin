onmessage = function(evt) {

  importScripts('colors.js');

  if (evt.data.isStartMessage) {
    postMessage({ isStarted: true });
    return;
  }

  const { y, zoom, middleY, middleX, maxIterations, canvasHalfWidth } = evt.data;

  postMessage({
    row: calculateColorsForRow({
      y: y/zoom + middleY,
      middleY,
      zoom,
      maxIterations,
      canvasHalfWidth,
      middleX
    })
  });

};

function calculateColorsForRow(options) {

  let row = [];

  for (let i = -options.canvasHalfWidth; i < options.canvasHalfWidth; i++) {

    const escapeValue = calculateEscapeValue({
      x: i/options.zoom + options.middleX,
      y: options.y,
      maxIterations: options.maxIterations
    });

    row = row.concat(getColorForEscapeValue({
      escapeValue,
      maxIterations: options.maxIterations
    }));

  }

  return row;

}

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
      return i;
    }

  }

  // Number is not within the set if it has not escaped
  return 0;

}
