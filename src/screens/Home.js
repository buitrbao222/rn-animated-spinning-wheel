import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Triangle from '../components/Triangle';
import { TRIANGLE_COUNT } from '../constants';

export default function HomeScreen() {
  const startingPosition = 100;
  const x = useSharedValue(startingPosition);
  const y = useSharedValue(startingPosition);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = event.absoluteX;
      ctx.startY = event.absoluteY;
      x.value = withSpring(event.absoluteX);
      y.value = withSpring(event.absoluteY);
    },
    onActive: (event, ctx) => {
      x.value = withSpring(ctx.startX + event.translationX);
      y.value = withSpring(ctx.startY + event.translationY);
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.safeView}>
      <PanGestureHandler onGestureEvent={eventHandler}>
        <Animated.View style={[styles.container, uas]}>
          {[...Array(TRIANGLE_COUNT)].map((_, index) => (
            <Triangle index={index} key={index} />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: '#0055FF',
  },
  container: {
    position: 'absolute',
    flex: 1,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
