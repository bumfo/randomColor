/**
 * USAGE: 
 *   init(); 
 *   rndColor(-1); // random hue
 *   rndColor(red); // red
 */

#include <math.h>
#include <stdlib.h>

typedef struct {
  double H, S, B;
} HSB;

enum ColorName {
  monochrome,
  red,
  orange,
  yellow,
  green,
  blue,
  purple,
  pink
};


void init();

HSB rndColor(int i);

static double pickHue(int);

static double pickSaturation(int);

static double pickBrightness(int, double);

static double getMinimumBrightness(int, double);

static int getColorIndex(double);

static double randomWithin(double, double);



static const double colorHues[][2] = {
  {NAN, NAN},
  {-26, 18},
  {19, 46},
  {47, 62},
  {63, 178},
  {179, 257},
  {258, 282},
  {283, 334},
};

#define COLOR_NAMES_NUM (sizeof(colorHues) / sizeof(colorHues[0]))

static const int colorLBoundsLengths[] = {
  2,
  9,
  7,
  8,
  8,
  9,
  9,
  7,
};

static const double colorLBounds0[][9] = {
  {0, 100},
  {20, 30, 40, 50, 60, 70, 80, 90, 100},
  {20, 30, 40, 50, 60, 70, 100},
  {25, 40, 50, 60, 70, 80, 90, 100},
  {30, 40, 50, 60, 70, 80, 90, 100},
  {20, 30, 40, 50, 60, 70, 80, 90, 100},
  {20, 30, 40, 50, 60, 70, 80, 90, 100},
  {20, 30, 40, 60, 80, 90, 100},
};

static const double colorLBounds1[][9] = {
  {0, 0},
  {100, 92, 89, 85, 78, 70, 60, 55, 50},
  {100, 93, 88, 86, 85, 70, 70},
  {100, 94, 89, 86, 84, 82, 80, 75},
  {100, 90, 85, 81, 74, 64, 50, 40},
  {100, 86, 80, 74, 60, 52, 44, 39, 35},
  {100, 87, 79, 70, 65, 59, 52, 45, 42},
  {100, 90, 86, 84, 80, 75, 73},
};

static double colorSRanges[COLOR_NAMES_NUM][2];


void init() {
  for (int i = 0; i < COLOR_NAMES_NUM; ++i) {
    const double * lbounds = &colorLBounds0[i][0];
    int length = colorLBoundsLengths[i];
    colorSRanges[i][0] = lbounds[0];
    colorSRanges[i][1] = lbounds[length - 1];
  }
}

HSB rndColor(int i) {
  double H = pickHue(i);
  if (i == -1) i = getColorIndex(i);
  double S = pickSaturation(i);
  double B = pickBrightness(i, S);
  HSB ret = {H, S, B};
  return ret;
}

static double pickHue(int i) {
  double hue = i == -1 ? randomWithin(0, 360) : randomWithin(colorHues[i][0], colorHues[i][1]);
  if (hue < 0) {
    hue = 360 + hue;
  }

  return hue;
}

static double pickSaturation(int i) {
  double * saturationRange = &colorSRanges[i][0];

  double sMin = saturationRange[0];
  double sMax = saturationRange[1];

  return randomWithin(sMin, sMax);
}

static double pickBrightness(int i, double S) {
  double bMin = getMinimumBrightness(i, S);
  double bMax = 100;

  return randomWithin(bMin, bMax);
}

static double getMinimumBrightness(int i, double S) {
  const double * lowerBounds0 = &colorLBounds0[i][0];
  const double * lowerBounds1 = &colorLBounds1[i][0];
  int length = colorLBoundsLengths[i];

  for (int j = 0; j < length - 1; j++) {
    double s1 = lowerBounds0[j];
    double s2 = lowerBounds0[j + 1];

    if (S >= s1 && S <= s2) {
      double v1 = lowerBounds1[j];
      double v2 = lowerBounds1[j + 1];

      double m = (v2 - v1) / (s2 - s1);
      double b = v1 - m * s1;

      return m * S + b;
    }
  }

  return 0;
}

static int getColorIndex(double hue) {
  if (hue >= 334 && hue <= 360) {
    hue -= 360;
  }

  for (int i = 1; i < COLOR_NAMES_NUM; ++i) {
    const double * range = &colorHues[i][0];
    if (range[0] <= hue && hue <= range[1]) {
      return i;
    }
  }

  return -1;
}

static double randomWithin(double l, double r) { // inclusive
  double x = (double) rand() / RAND_MAX;

  return floor(l + x * (r + 1 - l));
}
