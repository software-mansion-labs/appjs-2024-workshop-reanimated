import { Container } from "@components/Container";
import { colorShades } from "@lib/theme";
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";

function calculateArc(startPt, endPt) {
  const path = Skia.Path.Make();
  path.moveTo(startPt.x, startPt.y);

  const B = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 };

  const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 };
  const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 };

  path.cubicTo(q1.x, q1.y, q2.x, q2.y, endPt.x, endPt.y);

  return path;
}

export function ArcLesson() {
  const start = { x: 100, y: 100 };
  const end = { x: 180, y: 400 };

  return (
    <Container>
      <Canvas style={styles.canvas}>
        <Circle c={start} r={5} color={colorShades.purple.base} />
        <Circle c={end} r={5} color={colorShades.purple.base} />
        <Path
          color={colorShades.purple.base}
          style='stroke'
          strokeWidth={5}
          path={calculateArc(start, end)}
        />
      </Canvas>
    </Container>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
  },
});
