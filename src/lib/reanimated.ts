export const lerp = (x: number, y: number, a: number) => {
  "worklet";
  return x * (1 - a) + y * a;
};

export const clamp = (a: number, min = 0, max = 1) => {
  "worklet";
  return Math.min(max, Math.max(min, a));
};
export const invlerp = (x: number, y: number, a: number) => {
  "worklet";
  return clamp((a - x) / (y - x));
};
export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number
) => {
  "worklet";
  return lerp(x2, y2, invlerp(x1, y1, a));
};

export const radToDeg = (rad: number) => {
  "worklet";
  return (rad * 180) / Math.PI;
};

export const hitSlop = {
  left: 25,
  bottom: 25,
  right: 25,
  top: 25,
};
