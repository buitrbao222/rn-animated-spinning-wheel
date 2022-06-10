import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';
import { TRIANGLE_COUNT } from '../constants';
import useInterval from '../hooks/useInterval';
import toRadians from '../utils/toRadians';

/**        A
 *        /|\          ^
 *       / | \         |
 *      /  |  \        | SVG_HEIGHT
 *     /   |   \       |
 *    /    |    \      |
 *   /_____|_____\     v
 * B       H       C
 *
 *   <----------->
 *     SVG_WIDTH
 *
 * VERTEX_ANGLE = Â
 * BASE_ANGLE = B̂ = Ĉ = (180 - VERTEX_ANGLE) / 2
 *
 * tan(Ĉ) = AH / HC
 * => HALF_BASE = BH = HC = AH / tan(Ĉ)
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VERTEX_ANGLE = 360 / TRIANGLE_COUNT;
const BASE_ANGLE = (180 - VERTEX_ANGLE) / 2;

const SVG_HEIGHT = Math.sqrt(SCREEN_WIDTH ** 2 + SCREEN_HEIGHT ** 2);
const HALF_BASE = SVG_HEIGHT / Math.tan(toRadians(BASE_ANGLE));
const BASE = HALF_BASE * 2;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function Triangle({ index }) {
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: 0,
      left: -HALF_BASE,
      transform: [
        {
          translateY: -SVG_HEIGHT / 2,
        },
        {
          rotate: `${-VERTEX_ANGLE * index + rotation.value}deg`,
        },
        {
          translateY: SVG_HEIGHT / 2,
        },
      ],
    };
  });

  useInterval(
    () => {
      rotation.value = withTiming(rotation.value + 25, {
        duration: 1000,
        easing: Easing.linear,
      });
    },
    1000,
    {
      runImmediately: true,
    },
  );

  if (index % 2 !== 0) {
    return null;
  }

  return (
    <AnimatedSvg
      width={BASE}
      height={SVG_HEIGHT}
      style={[styles.svg, animatedStyles]}
      originX={HALF_BASE}
      originY={0}>
      <Polygon
        fill="white"
        fillOpacity={0.1}
        points={`${HALF_BASE},0 0,${SVG_HEIGHT} ${BASE},${SVG_HEIGHT}`}
      />
    </AnimatedSvg>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
});
