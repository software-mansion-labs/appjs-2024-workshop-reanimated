import { Container } from '@components/Container'
import { colorShades } from '@lib/theme'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { StyleSheet } from 'react-native'

const MIN_BOUND_DIST = 30

function calculateArc(startPt, endPt) {
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

export function ArcLesson() {
  const start = { x: 330, y: 30 }
  const end = { x: 150, y: 400 }

  return (
    <Container>
      <Canvas style={styles.canvas}>
        <Circle c={start} r={5} color={colorShades.purple.base} />
        <Circle c={end} r={5} color={colorShades.purple.base} />
        <Path
          color={colorShades.purple.base}
          style="stroke"
          strokeWidth={5}
          path={calculateArc(start, end)}
        />
      </Canvas>
    </Container>
  )
}

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    height: '100%',
  },
})
