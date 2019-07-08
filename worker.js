
onmessage = function(evt) {

  if (evt.data.isStartMessage) {
    postMessage({ isStarted: true });
    return;
  }

  const { y, zoom, middleY, middleX, maxIterations, canvasHalfHeight } = evt.data;

  postMessage({
    row: calculateColorsForRow({
      y: y/zoom + middleY,
      middleY,
      zoom,
      maxIterations,
      canvasHalfHeight,
      middleX
    })
  });

};

function calculateColorsForRow(options) {

  let row = [];

  for (let i = -options.canvasHalfHeight; i < options.canvasHalfHeight; i++) {

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

function getColorForEscapeValue(options) {

  const { maxIterations, escapeValue } = options;

  if (escapeValue === maxIterations) {
    return [0,0,0];  /* In the set. Assign black. */
  } else if (escapeValue < 64) {
    return [escapeValue * 2, 0, 0, 255];    /* 0x0000 to 0x007E */
  } else if (escapeValue < 128) {
    return [(((escapeValue - 64) * 128) / 126) + 128, 0, 0, 255];    /* 0x0080 to 0x00C0 */
  } else if (escapeValue < 256) {
    return [(((escapeValue - 128) * 62) / 127) + 193, 0, 0, 255];    /* 0x00C1 to 0x00FF */
  } else if (escapeValue < 512) {
    return [255, (((escapeValue - 256) * 62) / 255) + 1, 0, 255];    /* 0x01FF to 0x3FFF */
  } else if (escapeValue < 1024) {
    return [255, (((escapeValue - 512) * 63) / 511) + 64, 0, 255];   /* 0x40FF to 0x7FFF */
  } else if (escapeValue < 2048) {
    return [255, (((escapeValue - 1024) * 63) / 1023) + 128, 0, 255];   /* 0x80FF to 0xBFFF */
  } else if (escapeValue < 4096) {
    return [255, (((escapeValue - 2048) * 63) / 2047) + 192, 0, 255];   /* 0xC0FF to 0xFFFF */
  } else {
    return [255, 255, 0, 255];
  }

}
