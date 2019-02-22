var colorNames = [
  'monochrome',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

var colorHues = [
  null,
  [-26, 18],
  [19, 46],
  [47, 62],
  [63, 178],
  [179, 257],
  [258, 282],
  [283, 334],
];

var colorLBounds = [
  [
    [0, 0],
    [100, 0],
  ], [
    [20, 100],
    [30, 92],
    [40, 89],
    [50, 85],
    [60, 78],
    [70, 70],
    [80, 60],
    [90, 55],
    [100, 50],
  ], [
    [20, 100],
    [30, 93],
    [40, 88],
    [50, 86],
    [60, 85],
    [70, 70],
    [100, 70],
  ], [
    [25, 100],
    [40, 94],
    [50, 89],
    [60, 86],
    [70, 84],
    [80, 82],
    [90, 80],
    [100, 75],
  ], [
    [30, 100],
    [40, 90],
    [50, 85],
    [60, 81],
    [70, 74],
    [80, 64],
    [90, 50],
    [100, 40],
  ], [
    [20, 100],
    [30, 86],
    [40, 80],
    [50, 74],
    [60, 60],
    [70, 52],
    [80, 44],
    [90, 39],
    [100, 35],
  ], [
    [20, 100],
    [30, 87],
    [40, 79],
    [50, 70],
    [60, 65],
    [70, 59],
    [80, 52],
    [90, 45],
    [100, 42],
  ], [
    [20, 100],
    [30, 90],
    [40, 86],
    [60, 84],
    [80, 80],
    [90, 75],
    [100, 73],
  ],
];

var colorSRanges = colorLBounds.map(lbounds => [lbounds[0][0], lbounds[lbounds.length - 1][0]]);

function randomColor(colorName) {
  var i = colorNames.indexOf(colorName);

  var H = pickHue(i); if (i == -1) i = getColorInfo(i);
  var S = pickSaturation(i);
  var B = pickBrightness(i, S);
  return [H, S, B];
};

function pickHue(i) {
  var hueRange = i == -1 ? [0, 360] : colorHues[i];

  hue = randomWithin(hueRange);
  // Instead of storing red as two seperate ranges,
  // we group them, using negative numbers
  if (hue < 0) {
    hue = 360 + hue;
  }

  return hue;
}

function pickSaturation(i) {
  var saturationRange = colorSRanges[i];

  var sMin = saturationRange[0];
  var sMax = saturationRange[1];

  return randomWithin([sMin, sMax]);
}

function pickBrightness(i, S) {
  var bMin = getMinimumBrightness(i, S);
  var bMax = 100;

  return randomWithin([bMin, bMax]);
}

function getMinimumBrightness(i, S) {
  var lowerBounds = colorLBounds[i];

  for (var i = 0; i < lowerBounds.length - 1; i++) {
    var s1 = lowerBounds[i][0];
    var v1 = lowerBounds[i][1];

    var s2 = lowerBounds[i + 1][0];
    var v2 = lowerBounds[i + 1][1];

    if (S >= s1 && S <= s2) {
      var m = (v2 - v1) / (s2 - s1);
      var b = v1 - m * s1;

      return m * S + b;
    }
  }

  return 0;
}

function getColorInfo(hue) {
  // Maps red colors to make picking hue easier
  if (hue >= 334 && hue <= 360) {
    hue -= 360;
  }

  for (var i = 1; i < colorHues.length; ++i) {
    var r = colorHues[i];
    if (r[0] <= hue && hue <= r[1]) {
      return i;
    }
  }

  return -1;
}

function randomWithin(range) { // inclusive
  return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
}
