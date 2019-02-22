import static java.lang.Double.NaN;

public final class RndColor {
  public enum ColorName {
    monochrome,
    red,
    orange,
    yellow,
    green,
    blue,
    purple,
    pink
  }

  private static final double[][] colorHues = {
    {NaN, NaN},
    {-26, 18},
    {19, 46},
    {47, 62},
    {63, 178},
    {179, 257},
    {258, 282},
    {283, 334},
  };

  private static final double[][] colorLBounds0 = {
    {0, 100},
    {20, 30, 40, 50, 60, 70, 80, 90, 100},
    {20, 30, 40, 50, 60, 70, 100},
    {25, 40, 50, 60, 70, 80, 90, 100},
    {30, 40, 50, 60, 70, 80, 90, 100},
    {20, 30, 40, 50, 60, 70, 80, 90, 100},
    {20, 30, 40, 50, 60, 70, 80, 90, 100},
    {20, 30, 40, 60, 80, 90, 100},
  };

  private static final double[][] colorLBounds1 = {
    {0, 0},
    {100, 92, 89, 85, 78, 70, 60, 55, 50},
    {100, 93, 88, 86, 85, 70, 70},
    {100, 94, 89, 86, 84, 82, 80, 75},
    {100, 90, 85, 81, 74, 64, 50, 40},
    {100, 86, 80, 74, 60, 52, 44, 39, 35},
    {100, 87, 79, 70, 65, 59, 52, 45, 42},
    {100, 90, 86, 84, 80, 75, 73},
  };

  private static final double[][] colorSRanges = new double[colorLBounds0.length][];

  static {
    for (int i = 0; i < colorLBounds0.length; ++i) {
      double[] lbounds = colorLBounds0[i];
      colorSRanges[i] = new double[]{lbounds[0], lbounds[lbounds.length - 1]};
    }
  }

  public static double[] rndColor() {
    return rndColor(-1);
  }

  public static double[] rndColor(ColorName colorName) {
    return rndColor(colorName.ordinal());
  }

  private static double[] rndColor(int i) {
    double H = pickHue(i);
    if (i == -1) i = getColorIndex(i);
    double S = pickSaturation(i);
    double B = pickBrightness(i, S);
    return new double[]{H, S, B};
  }

  private static double pickHue(int i) {
    double hue = i == -1 ? randomWithin(0, 360) : randomWithin(colorHues[i]);
    if (hue < 0) {
      hue = 360 + hue;
    }

    return hue;
  }

  private static double pickSaturation(int i) {
    double[] saturationRange = colorSRanges[i];

    double sMin = saturationRange[0];
    double sMax = saturationRange[1];

    return randomWithin(sMin, sMax);
  }

  private static double pickBrightness(int i, double S) {
    double bMin = getMinimumBrightness(i, S);
    double bMax = 100;

    return randomWithin(bMin, bMax);
  }

  private static double getMinimumBrightness(int i, double S) {
    double[] lowerBounds0 = colorLBounds0[i];
    double[] lowerBounds1 = colorLBounds1[i];

    for (int j = 0; j < lowerBounds0.length - 1; j++) {
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

  private static int getColorIndex(double hue) {
    if (hue >= 334 && hue <= 360) {
      hue -= 360;
    }

    for (int i = 1; i < colorHues.length; ++i) {
      double[] range = colorHues[i];
      if (range[0] <= hue && hue <= range[1]) {
        return i;
      }
    }

    return -1;
  }

  private static double randomWithin(double[] range) {
    return randomWithin(range[0], range[1]);
  }

  private static double randomWithin(double l, double r) { // inclusive
    return Math.floor(l + Math.random() * (r + 1 - l));
  }
}
