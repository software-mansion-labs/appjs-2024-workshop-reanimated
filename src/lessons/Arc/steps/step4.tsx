import { Container } from '@components/Container'
import { colorShades } from '@lib/theme'
import { Skia } from '@shopify/react-native-skia'
import { useState } from 'react'
import { Button, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  defineAnimation,
  withTiming,
} from 'react-native-reanimated'

const MIN_BOUND_DIST = 30

function calculateArc(startPt, endPt) {
  'worklet'
  const path = Skia.Path.Make()
  path.moveTo(startPt.x, startPt.y)

  const midPt = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }

  const dx = endPt.x - startPt.x
  const dy = endPt.y - startPt.y

  let boundX = midPt.x,
    boundY = midPt.y

  const dist2 = dx * dx + dy * dy
  if (dist2 < 0.5) {
    path.moveTo(endPt.x, endPt.y)
    return path
  }

  if (Math.abs(dx) < Math.abs(dy)) {
    const yDist = Math.abs(dist2 / 2 / dy)
    boundX = endPt.x
    boundY = endPt.y < startPt.y ? endPt.y + yDist : endPt.y - yDist
  } else {
    const xDist = Math.abs(dist2 / 2 / dx)
    boundX = endPt.x < startPt.x ? endPt.x + xDist : endPt.x - xDist
    boundY = endPt.y
  }

  if (Math.abs(dx) < 0.5) {
    boundX += endPt.x < startPt.x ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  } else if (Math.abs(dy) < 0.5) {
    boundY += endPt.y < startPt.y ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  }

  const boundDist =
    (boundX - midPt.x) * (boundX - midPt.x) +
    (boundY - midPt.y) * (boundY - midPt.y)

  if (boundDist * boundDist < MIN_BOUND_DIST * MIN_BOUND_DIST) {
    const ratio = MIN_BOUND_DIST / Math.sqrt(boundDist)
    boundX = midPt.x + (boundX - midPt.x) * ratio
    boundY = midPt.y + (boundY - midPt.y) * ratio
  }

  const cp1x = (startPt.x + boundX) / 2
  const cp1y = (startPt.y + boundY) / 2
  const cp2x = (endPt.x + boundX) / 2
  const cp2y = (endPt.y + boundY) / 2
  path.cubicTo(cp1x, cp1y, cp2x, cp2y, endPt.x, endPt.y)

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

export function ArcLayoutTransition(values) {
  'worklet'
  const config = {
    duration: 1500,
    easing: Easing.bezierFn(0.5, 0.01, 0, 1),
  }
  const pathAnimation = withArcAnimation(
    { x: values.targetOriginX, y: values.targetOriginY },
    withTiming(1, config),
  )
  return {
    animations: {
      originX: pathAnimation.x,
      originY: pathAnimation.y,
    },
    initialValues: {
      originX: values.currentOriginX,
      originY: values.currentOriginY,
    },
  }
}

export function ArcLesson() {
  const [position, setPosition] = useState({ x: 100, y: 100 })

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
      <Animated.View
        layout={ArcLayoutTransition}
        style={[styles.box, { left: position.x, top: position.y }]}
      />
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
