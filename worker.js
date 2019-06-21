onmessage = function (e) {

  // Convert to coordinates in the complex space
  let realY = e.data.y/e.data.zoom - e.data.panY;
  let cX = e.data.x;
  let cY = realY;

  for (let j = 0; j < e.data.canvasHeight; j++) {

    // Calculate the escape value for the given coordinate
    for (let i = 0; i < e.data.maxIterations; i++) {

      const newCx = (cX * cX) - (cY * cY) + e.data.x;
      const newCy = 2 * (cX * cY) + e.data.y;

      cX = newCx;
      cY = newCy;

    }

    if ((cX * cY) > 5) {
      drawPixel(e.data.i, i, { h: 0, s: 100, l: cX * cY });

      // Number is outside of the set if it has not escaped
      //postMessage({
      //  x: e.data.x,
      //  y: e.data.y,
      //  escapeValue: i / e.data.maxIterations * 100
      //});
    } else {
      drawPixel(e.data.i, i, { h: 0, s: 0, l: 0 });
    }

  }

  // Number is not within the set if it has not escaped
  postMessage({
    x: e.data.x,
    y: e.data.y,
    escapeValue: 0
  });

};

onerror = function (error) {
  console.error(error);
};

