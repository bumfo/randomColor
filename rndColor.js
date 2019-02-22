var colorNames = {
  'monochrome': 0,
  'red': 1,
  'orange': 2,
  'yellow': 3,
  'green': 4,
  'blue': 5,
  'purple': 6,
  'pink': 7,
};

var colorHues = [
  [NaN, NaN], 
  [-26, 18],
  [19, 46],
  [47, 62],
  [63, 178],
  [179, 257],
  [258, 282],
  [283, 334],
];

var colorLBounds0 = [
  [0, 100],
  [20, 30, 40, 50, 60, 70, 80, 90, 100],
  [20, 30, 40, 50, 60, 70, 100],
  [25, 40, 50, 60, 70, 80, 90, 100],
  [30, 40, 50, 60, 70, 80, 90, 100],
  [20, 30, 40, 50, 60, 70, 80, 90, 100],
  [20, 30, 40, 50, 60, 70, 80, 90, 100],
  [20, 30, 40, 60, 80, 90, 100]
];

var colorLBounds1 = [
  [0, 0],
  [100, 92, 89, 85, 78, 70, 60, 55, 50],
  [100, 93, 88, 86, 85, 70, 70],
  [100, 94, 89, 86, 84, 82, 80, 75],
  [100, 90, 85, 81, 74, 64, 50, 40],
  [100, 86, 80, 74, 60, 52, 44, 39, 35],
  [100, 87, 79, 70, 65, 59, 52, 45, 42],
  [100, 90, 86, 84, 80, 75, 73]
];

var colorSRanges = colorLBounds0.map(lbounds => [lbounds[0], lbounds[lbounds.length - 1]]);

function rndColor(i = -1) {
  var H = pickHue(i);
  if (i == -1) i = getColorInfo(i);
  var S = pickSaturation(i);
  var B = pickBrightness(i, S);
  return [H, S, B];
};

function pickHue(i) {
  var hueRange = i == -1 ? [0, 360] : colorHues[i];

  hue = randomWithin(hueRange);
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
  var lowerBounds0 = colorLBounds0[i];
  var lowerBounds1 = colorLBounds1[i];

  for (var i = 0; i < lowerBounds0.length - 1; i++) {
    var s1 = lowerBounds0[i];
    var s2 = lowerBounds0[i + 1];

    if (S >= s1 && S <= s2) {
      var v1 = lowerBounds1[i];
      var v2 = lowerBounds1[i + 1];

      var m = (v2 - v1) / (s2 - s1);
      var b = v1 - m * s1;

      return m * S + b;
    }
  }

  return 0;
}

function getColorInfo(hue) {
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
