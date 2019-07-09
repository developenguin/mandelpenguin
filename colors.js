
function getColorForEscapeValue(options) {

  const { maxIterations, escapeValue } = options;

  if (escapeValue === maxIterations) {
    return [0,0,0];  /* In the set. Assign black. */
  } else if (escapeValue < maxIterations/64) {
    return [escapeValue * 2, 0, 0, 255];    /* 0x0000 to 0x007E */
  } else if (escapeValue < maxIterations/32) {
    return [(((escapeValue - 64) * 128) / 126) + 128, 0, 0, 255];    /* 0x0080 to 0x00C0 */
  } else if (escapeValue < maxIterations/16) {
    return [(((escapeValue - 128) * 62) / 127) + 193, 0, 0, 255];    /* 0x00C1 to 0x00FF */
  } else if (escapeValue < maxIterations/8) {
    return [255, (((escapeValue - 256) * 62) / 255) + 1, 0, 255];    /* 0x01FF to 0x3FFF */
  } else if (escapeValue < maxIterations/4) {
    return [255, (((escapeValue - 512) * 63) / 511) + 64, 0, 255];   /* 0x40FF to 0x7FFF */
  } else if (escapeValue < maxIterations/2) {
    return [255, (((escapeValue - 1024) * 63) / 1023) + 128, 0, 255];   /* 0x80FF to 0xBFFF */
  } else if (escapeValue < maxIterations) {
    return [255, (((escapeValue - 2048) * 63) / 2047) + 192, 0, 255];   /* 0xC0FF to 0xFFFF */
  } else {
    return [255, 255, 0, 255];
  }

}