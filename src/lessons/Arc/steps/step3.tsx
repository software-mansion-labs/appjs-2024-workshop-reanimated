import { Container } from '@components/Container'
import { colorShades } from '@lib/theme'
import { Skia } from '@shopify/react-native-skia'
import { useState } from 'react'
import { Button, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  defineAnimation,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

const MIN_BOUND_DIST = 30

function calculateArc(startPt, endPt) {
  'worklet'
  const path = Skia.Path.Make()
  path.moveTo(startPt.x, startPt.y)

  const dx = endPt.x - startPt.x
  const dy = endPt.y - startPt.y

  const dist2 = dx * dx + dy * dy

  if (dist2 < 0.5) {
    path.moveTo(endPt.x, endPt.y)
    return path
  }

  const B = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }

  if (Math.abs(dx) < Math.abs(dy)) {
    B.x = endPt.x
    B.y = endPt.y - dist2 / 2 / dy
  } else {
    B.x = endPt.x - dist2 / 2 / dx
    B.y = endPt.y
  }

  if (Math.abs(dx) < 0.5) {
    B.x += endPt.x < startPt.x ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  } else if (Math.abs(dy) < 0.5) {
    B.y += endPt.y < startPt.y ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  }

  const midPt = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }
  const BDist2 =
    (B.x - midPt.x) * (B.x - midPt.x) + (B.y - midPt.y) * (B.y - midPt.y)

  if (BDist2 < MIN_BOUND_DIST * MIN_BOUND_DIST) {
    // make AB vector length to be at least MIN_BOUND_DIST
    const ratio = MIN_BOUND_DIST / Math.sqrt(BDist2)
    B.x = midPt.x + (B.x - midPt.x) * ratio
    B.y = midPt.y + (B.y - midPt.y) * ratio
  }

  const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 }
  const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 }

  path.cubicTo(q1.x, q1.y, q2.x, q2.y, endPt.x, endPt.y)

  return path
}

export function withArcAnimation(pt, timing) {
  'worklet'

  const animationData = {
    start: { x: pt.x, y: pt.y },
    current: pt,
    path: undefined,
    finished: false,
    currentFrame: -1,
    startTime: 0,
  }
  function maybeStart(now) {
    if (animationData.startTime === now) {
      return
    }
    animationData.startTime = now
    animationData.finished = false
    animationData.path = undefined
    timing.onStart(timing, 0, now, undefined)
  }
  function maybeRunFrame(now) {
    'worklet'
    if (animationData.currentFrame === now) {
      return animationData.finished
    }
    animationData.currentFrame = now

    if (animationData.start.x === pt.x && animationData.start.y === pt.y) {
      animationData.finished = true
      timing.current = 0
    } else {
      animationData.finished = timing.onFrame(timing, now)
    }

    if (animationData.path === undefined) {
      animationData.path = calculateArc(animationData.start, pt)
    }

    if (timing.current === 0) {
      animationData.current = animationData.start
    } else if (timing.current < 1) {
      animationData.current = animationData.path
        .copy()
        .trim(0, timing.current, false)
        .getLastPt()
    } else {
      animationData.current = pt
    }
    return animationData.finished
  }
  return {
    x: defineAnimation(pt.x, () => {
      'worklet'
      return {
        onStart: (_, value, now) => {
          maybeStart(now)
          animationData.start.x = value
        },
        onFrame: (animation, now) => {
          const res = maybeRunFrame(now)
          animation.current = animationData.current.x
          return res
        },
      }
    }),
    y: defineAnimation(pt.y, () => {
      'worklet'
      return {
        onStart: (_, value, now) => {
          maybeStart(now)
          animationData.start.y = value
        },
        onFrame: (animation, now) => {
          const res = maybeRunFrame(now)
          animation.current = animationData.current.y
          return res
        },
      }
    }),
  }
}

export function ArcLesson() {
  const [position, setPosition] = useState({ x: 100, y: 100 })

  const animatedStyle = useAnimatedStyle(() => {
    const animatedPosition = withArcAnimation(
      position,
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezierFn(0.5, 0.01, 0, 1),
      }),
    )
    return {
      left: animatedPosition.x,
      top: animatedPosition.y,
    }
  })

  return (
    <Container>
      <Button
        title="Move"
        onPress={() => {
          setPosition({
            x: Math.random() * 300,
            y: Math.random() * 500,
          })
        }}
      />
      <Animated.View style={[styles.box, animatedStyle]} />
    </Container>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colorShades.purple.base,
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
  },
})
