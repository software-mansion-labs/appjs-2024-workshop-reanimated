# Animated Reactions

In this lesson we will create a arc motion effect.
We will explore [@Shopify/react-native-skia](https://github.com/Shopify/react-native-skia) integration with Reanimated 3, custom animation API, layout animations and shared transitions.

## Step 1 – Arc geometry (drawing)

In this step we focus on implementing a logic that calculates an arc between two points.
To visualize our algorithm, we use [@Shopify/react-native-skia](https://github.com/Shopify/react-native-skia) library to draw the calculated arc.
The [Arc.tsx](./Arc.tsx) template defines a component that creates a [Skia canvas](https://shopify.github.io/react-native-skia/docs/canvas/overview), and uses [`Path`](https://shopify.github.io/react-native-skia/docs/shapes/path) component to draw a path between a predefined start and end points.
In this step we will fill the missing implementation of the `calculateArc` method.

Below we explain the math behind calculating the arc. We first consider the case when starting point (S) and final point (T) are located such that the horizontal movement is greater than vertical movement, and also that we are going downwards.

In this technique we wan't to locate the position of point B, and then draw a cubic bezier that starts and ends in S and T respecively and uses midpoints between S and B, and B and T as control points:

<img height="600" alt="image" src="https://user-images.githubusercontent.com/726445/236708795-76e84b1c-a83b-43d2-b3a1-102997d372a1.png">

We now add helper point A positioned vertically with S and horizontally with T, and helper point C which is a midpoint between S and T.

<img src="https://user-images.githubusercontent.com/726445/236708566-ef1a1eab-ff35-4681-9fc0-93a0bff6d775.png" height=600/>

We note that triangles SAT and CBT are similar because they have identical angles, this allows us to derive a formula for the distance between B and T points:

${\Large\frac{|BT|}{|CT|}} = {\Large\frac{|ST|}{|AT|}}$

We further get that:
$|BT| = {\Large\frac{|ST|^2}{2|AT|}}$

In addition, we know that the distance $|ST|^2$ is expressed as: $|ST|^2 = (x_T - x_S)^2 + (y_T - y_S)^2$ where $(x_T, y_T)$ and $(x_S, y_S)$ are coordinates of points T and S respetively. And that $|AT|$ is expressed as $|AT| = \|y_T - y_A\|$ since x-coordinates of points A and T are the same.

Finally, we find cubic bezier control points as midpoint between S and B, and B and T. This can be done averaging x and y coordinates of the points in question, e.g.:

$x_{Q_1} = (x_S + x_B) / 2$

$y_{Q_1} = (y_S + y_B) / 2$

where $Q_1 = (x_{Q_1}, y_{Q_1})$ is the control point located between $S = (x_S, y_S)$ and $B = (x_B, y_B)$.

### Tasks

<details>
<summary><b>[1]</b> In <a href="./Arc.tsx">Arc.tsx</a> template, implement <code>calculateArc</code> for the case of greater horizontal distance using the provided formula.
</summary>

First calculate vertical, horizontal and distance squared:

```js
const dx = endPt.x - startPt.x
const dy = endPt.y - startPt.y
const dist2 = dx * dx + dy * dy
```

We now implement the above formula to calculate the B point coordinates:

```js
const AT = Math.abs(dy)
const B = {
  x: endPt.x,
  y: endPt.y - dist2 / 2 / AT,
}
```

Finally, we calculate control points $Q_1$ and $Q_2$ as midpoints between S and B, and B and T:

```js
const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 }
const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 }
```

The complete implementation of `calculateArc` method may look as follows:

```js
function calculateArc(startPt, endPt) {
  const path = Skia.Path.Make()
  path.moveTo(startPt.x, startPt.y)

  const dx = endPt.x - startPt.x
  const dy = endPt.y - startPt.y

  const dist2 = dx * dx + dy * dy

  const AT = Math.abs(dy)
  const B = {
    x: endPt.x,
    y: endPt.y - dist2 / 2 / AT,
  }

  const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 }
  const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 }

  path.cubicTo(q1.x, q1.y, q2.x, q2.y, endPt.x, endPt.y)

  return path
}
```

</details><br/>

<details>
<summary><b>[2]</b> Cover the remaining cases: when vertical distance if greater, and when both points are located on vertical or horizontal line.
</summary>

We will start by initializing B to be a midpoint between S and T:

```js
const B = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }
```

Now we need to detect a few cases, let's start from the case we already covered when horizontal distance is higher. We should also consider the case of upward or downward movement. It turns out it is sufficient to not use `Math.abs` when calculating the distance, this case when subtracting from `endPt.y` we will always turn in the correct direction:

```js
if (Math.abs(dx) < Math.abs(dy)) {
  B.x = endPt.x
  B.y = endPt.y - dist2 / 2 / dy
}
```

Similarily, we cover the opposite case with more vertical than horizontal movement, we do it in the `else` clause:

```js
else {
  B.x = endPt.x - dist2 / 2 / dx;
  B.y = endPt.y;
}
```

Finally, we need to treat only vertical/horizontal movement as a special case. Otherwise, we will just get a straight line. In these two cases we take midpoint as one of the coordinates, and for the second coordinate of point B, we add some constant offset:

```js
const MIN_BOUND_DIST = 30
```

We detect vertical/horizontal lines by checking whether it falls below some threshold. Similarily, we want the curve to be convex in different direction depending on whether it goes upwards or downwards, therefore we either offset by negative or positive distance.

```js
if (Math.abs(dx) < 0.5) {
  B.x += endPt.x < startPt.x ? MIN_BOUND_DIST : -MIN_BOUND_DIST
} else if (Math.abs(dy) < 0.5) {
  B.y += endPt.y < startPt.y ? MIN_BOUND_DIST : -MIN_BOUND_DIST
}
```

Here is the current version of `calculateArc` in full:

```js
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

  const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 }
  const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 }

  path.cubicTo(q1.x, q1.y, q2.x, q2.y, endPt.x, endPt.y)

  return path
}
```

</details><br/>

<details>
<summary><b>[3]</b> Verify that the arc look ok for all possible settings (more horizontal/more vertical, downward/upward, vertical/horizontal line).
</summary>

Here are some test examples you may want to verity:

1. Greater horizontal movement going downward

```js
const start = { x: 330, y: 30 }
const end = { x: 150, y: 400 }
```

2. Same but upwards

```js
const start = { x: 150, y: 400 }
const end = { x: 330, y: 30 }
```

3. Greater vertical movement going downward

```js
const start = { x: 100, y: 140 }
const end = { x: 250, y: 170 }
```

4. Same but upwards

```js
const start = { x: 250, y: 170 }
const end = { x: 100, y: 140 }
```

5. Vertical line downwards

```js
const start = { x: 100, y: 170 }
const end = { x: 100, y: 340 }
```

6. Vertical line upwards

```js
const start = { x: 100, y: 320 }
const end = { x: 100, y: 120 }
```

6. Horizontal line (left to right)

```js
const start = { x: 30, y: 200 }
const end = { x: 230, y: 200 }
```

6. Horizontal line (right to left)

```js
const start = { x: 260, y: 180 }
const end = { x: 110, y: 180 }
```

</details><br/>

<details>
<summary><b>[BONUS 1]</b> Add minimum convexity for the curve in cases when point B is near the line between S and T (this will result in an almost flat curve)
</summary>

In this step we want the B point to be at a certain distance from the line joining points S and T.
We first need to detect if point B is too close.
If it is, we "extend" the vector joining modpoint C with B such that it starts in C but has a length of at least some specified constant.

We start by testing whether B is near the line between S and T. We can do this by measuring the distance between C and B, as point C is the nearest point to B on the ST line:

```js
const midPt = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }
const BDist2 =
  (B.x - midPt.x) * (B.x - midPt.x) + (B.y - midPt.y) * (B.y - midPt.y)

if (BDist2 < MIN_BOUND_DIST * MIN_BOUND_DIST) {
  // make AB vector length to be at least MIN_BOUND_DIST
}
```

Now, we move B coords such that CB vector points towords the same direction but its length is MIN_BOUND_DIST.
This can be done by measuring the ratio between the current length and the target legth, and then by multiplying the end
coordinates by the calculated ratio:

```js
if (BDist2 < MIN_BOUND_DIST * MIN_BOUND_DIST) {
  // make AB vector length to be at least MIN_BOUND_DIST
  const ratio = MIN_BOUND_DIST / Math.sqrt(BDist2)
  B.x = midPt.x + (B.x - midPt.x) * ratio
  B.y = midPt.y + (B.y - midPt.y) * ratio
}
```

Check [steps/step1.tsx](steps/step1.tsx) for the final implementation of the `calculateArc` method.

</details><br/>

## Step 2 – Animating Skia with Reanimated

In this step we will use Reanimated to animate a portion of the path.
This excercise will let us explore Reanimated and Skia integration that Reanimated 3 unlocked.

![arc animation](https://user-images.githubusercontent.com/726445/236938255-78d92ea5-b95c-4b69-87b0-b0173c48e0d6.gif)

### Tasks

<details>
<summary><b>[1]</b> Create shared value representing animation progress that starts animating between 0 and 1 on component mount.
</summary>

First, define a shared value initialized to 0 in your component code:

```js
const progress = useSharedValue(0)
```

Now, use `useEffect` hook to initialized an animation on component mount.
We will use `withTiming` composed with `withRepeat` to get a back and forth animation between 0 and 1:

```js
useEffect(() => {
  progress.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true)
}, [])
```

</details><br/>

<details>
<summary><b>[2]</b> Use <code>useDerivedValue</code> that returns a path cropped according to progress value. Use Path’s <a href="https://github.com/Shopify/react-native-skia/blob/main/package/src/skia/types/Path/Path.ts#L357"><code>copy</code></a> and <a href="https://github.com/Shopify/react-native-skia/blob/main/package/src/skia/types/Path/Path.ts#L538"><code>trim</code></a> methods.
</summary>

We use `useDerivedValue` hook from Reanimated in order provide a shared value that represets a arc trimmed to the progress.

Since [`trim`](https://github.com/Shopify/react-native-skia/blob/main/package/src/skia/types/Path/Path.ts#L538) method mutates the Path object, we need to clone it first. Also, watch out as `trim` does not accept value `1` as the end number:

```js
const partOfArc = useDerivedValue(() => {
  return progress.value < 1 ? arc.copy().trim(0, progress.value, false) : arc
})
```

</details><br/>

<details>
<summary><b>[3]</b> Pass derived value to Path component as a prop.
</summary>

Skia integrates with Reanimated and accepts shared values as its component properties.
When used this way, all updates that happen to the shared value (including animations) are happening on the UI thread:

```jsx
<Path
  color={colorShades.purple.base}
  style="stroke"
  strokeWidth={5}
  path={partOfArc}
/>
```

</details><br/>

## Step 3 – Custom animation along an arc

In this step we will implement a custom animation using `defineAnimation` API from Reanimated in order to achieve an effect of animating objects along an arc.

![animate view along arc](https://user-images.githubusercontent.com/726445/236950413-bf90e410-79a8-4594-a4e8-f0252220535f.gif)

We will write our own `withArcAnimation` method that takes a point and timing function and returns a point with separate animations for `x` and `y` coordinates. Each animation will be created using `defineAnimation` helper from Reanimated and will communicate with shared animation data that controlls the progress of moving along a path. For this purpose we will use the following schema:

```js
export function withArcAnimation(pt, progressAnimation) {
  'worklet'
  const arcAnimationData = {
    // here you can keep some data shared between animations of individual coordinates
  }

  return {
    x: defineAnimation(pt.x, () => {
      'worklet'
      return {
        onStart: (_, value, now) => {
          // remember starting value for X coordinate in shared arcAnimationData
        },
        onFrame: (animation, now) => {
          // use shared arcAnimationData to step path animation and read X coordinate into animation.current
        },
      }
    }),
    y: defineAnimation(pt.y, () => {
      'worklet'
      return {
        onStart: (_, value, now) => {
          // remember starting value for Y coordinate in shared arcAnimationData
        },
        onFrame: (animation, now) => {
          // use shared arcAnimationData to step path animation and read X coordinate into animation.current
        },
      }
    }),
  }
}
```

Later on, we will be able to use `withArcAnimation` in `useAnimatedStyle` as follows in order to control `left` and `top` position of a view:

```js
const style = useAnimatedStyle(() => {
  // we pass the target point coordinates and timing function to be used to navigate the view along the arc
  const animatedPt = withArcAnimation(pt, withTiming(1))
  return {
    left: animatedPt.x,
    top: animnatedPt.y,
  }
})
```

### Tasks

<details>
<summary><b>[1]</b> Create an absolutely positioned view that uses `withArcAnimation` to control <code>top</code> and <code>left</code> style attributes. Add a button that updates component state with a random target position for the view.
</summary>

Inside the screen container, we use `useState` hook to keep the current position of the view:

```js
const [position, setPosition] = useState({ x: 100, y: 100 })
```

Next, we prepare animated style that uses `withArcAnimation` following the schema mentioned above, we use basic `withTiming` animation as the progress animation, this can be customized to your liking:

```js
const animatedStyle = useAnimatedStyle(() => {
  const animatedPos = withArcAnimation(pp[position], withTiming(1))
  return {
    left: animatedPos.x,
    top: animatedPos.y,
  }
})
```

Finally, we add the button and `Animated.View` component to the screen container. We implement the `onPress` button such that it selects a new position for the view at random. For the `Animated.View` we provide the `animatedStyle` object defined above:

```jsx
return (
  <Container>
    <Animated.View
      sharedTransitionTag="box"
      style={[styles.box, animatedStyle]}
    />
    <Button
      title="Move"
      onPress={() => {
        setPosition({
          x: Math.random() * 300,
          y: Math.random() * 500,
        })
      }}
    />
  </Container>
)
```

To style the button we add a `box` entry to the stylesheet:

```js
const styles = StyleSheet.create({
  box: {
    backgroundColor: colorShades.purple.base,
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
  },
})
```

</details><br/>

<details>
<summary><b>[2]</b> Implement <code>onStart</code> – remember the starting value provided to the callbacks such that we can use them later to calculate the arc.
</summary>

For this part we will add a `start` point to the `animatedData` object:

```js
const animationData = {
  start: { x: pt.x, y: pt.y },
}
```

Next, we will define a method inside `withArcAnimation` that will run the starting logic such that it can be called from both `x` and `y` coordinates animations.
The method will defer to calling `onStart` on the `progressAnimation` with a correct set of attributes such that the timing is ready to start progressing from `0` to `1`:

```js
function start(now) {
  progressAnimation.onStart(progressAnimation, 0, now, undefined)
}
```

</details><br/>

<details>
<summary><b>[3]</b> Implement <code>onFrame</code> – make sure we only run <code>progressTiming</code> once per frame despite the fact it will be accessed for both <code>x</code> and <code>y</code> coordinates.
</summary>

The `x` and `y` axis are going to run separately.
To make sure we don't execute path interpolation code twice, we will keep the `currentFrame` value in `animationData`, when we see the frame callback being called for the same frame we will just skip executing any code.
We will also add some more fields to the `animationData`:

1.  `current` point corresponding to the current position in the arc
2.  `finished` boolean that indicates whether the animation has finished
3.  `path` object that will keep the reference to the full path between start and end points

```js
const animationData = {
  start: { x: pt.x, y: pt.y },
  current: pt,
  path: undefined,
  finished: false,
  currentFrame: -1,
}
```

Now, we define a new method `maybeRunFrame` that will be used to progress a frame from `x` and `y` `onFrame` callbacks:

```js
function maybeRunFrame(now) {
  if (animationData.currentFrame === now) {
    // we exit immediately if we already have run for this frame
    return animationData.finished
  }
  animationData.currentFrame = now

  if (animationData.start.x === pt.x && animationData.start.y === pt.y) {
    // when start and end points are the same, this is likely just the initial animation, we don't want to do anything
    animationData.finished = true
    progressAnimation.current = 0
  } else {
    // run onFrame of the progress animation
    animationData.finished = progressAnimation.onFrame(progressAnimation, now)
  }

  if (animationData.path === undefined) {
    // if path wasn't defined, we calcluate it based on start and end points
    animationData.path = calculateArc(animationData.start, pt)
  }

  if (progressAnimation.current === 0) {
    animationData.current = animationData.start
  } else if (progressAnimation.current < 1) {
    animationData.current = animationData.path
      .copy()
      .trim(0, progressAnimation.current, false)
      .getLastPt()
  } else {
    animationData.current = pt
  }
  return animationData.finished
}
```

We also need to update `start` method such that it resets `finished` and `path` objects:

```js
function start(now) {
  animationData.finished = false
  animationData.path = undefined
  progressAnimation.onStart(progressAnimation, 0, now, undefined)
}
```

Finally, we use `maybeRunFrame` to implement `onFrame` for `x` and `y` coord animations (the below code is for the `x` axis only):

```js
return {
  onFrame: (animation, now) => {
    const res = maybeRunFrame(now)
    animation.current = animationData.current.x
    return res
  },
}
```

The `withArcAnimation` method in full is presented below:

```js
export function withArcAnimation(pt, progressAnimation) {
  'worklet'

  const animationData = {
    start: { x: pt.x, y: pt.y },
    current: pt,
    path: undefined,
    finished: false,
    currentFrame: -1,
  }
  function start(now) {
    animationData.finished = false
    animationData.path = undefined
    progressAnimation.onStart(progressAnimation, 0, now, undefined)
  }
  function maybeRunFrame(now) {
    if (animationData.currentFrame === now) {
      return animationData.finished
    }
    animationData.currentFrame = now

    if (animationData.start.x === pt.x && animationData.start.y === pt.y) {
      animationData.finished = true
      progressAnimation.current = 0
    } else {
      animationData.finished = progressAnimation.onFrame(progressAnimation, now)
    }

    if (animationData.path === undefined) {
      animationData.path = calculateArc(animationData.start, pt)
    }

    if (progressAnimation.current === 0) {
      animationData.current = animationData.start
    } else if (progressAnimation.current < 1) {
      animationData.current = animationData.path
        .copy()
        .trim(0, progressAnimation.current, false)
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
          start(now)
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
          start(now)
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
```

</details><br/>

## Step 4 – Custom layout animation

In this step we will implement the exact same behavior as before, but instead of animating `top` and `left` style properties with `useAnimatedStyle` we will use Reanimated's Layout Animations.

Layout Animations makes it very easy to animate entering/exiting or updating the position.
In order to use them, you don't need to define animated style, but instead Reanimated will monitor the presence, position and dimensions of the view in question and animate any changes with respect to these attributes in a specified way.

In this exercise we will only look at updating position (and not at exiting or entering animations).
In order to make animated the position update, we need to specify `layout` attribute for an animated view of which the layout changes.
You can use one [of the built in animations](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/layoutTransitions#predefined-transitions) for layout like [`Layout`](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/layoutTransitions#layout) or [`FadingTransition`](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/layoutTransitions#fading-transition), or define a custom transition of your own:

```js
return <Animated.View layout={Layout}>
```

In this excercise we will want to use the [custom layout transition API](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/customAnimations#custom-layout-transition) which boils down to defining a function that returns an object consisting of initial values and animations defined for selected attributes.
The below example defines a custom layout transition that animates position (here denoted by `origin`) using the timing animation.

```js
function CustomLayoutTransition(values) {
  'worklet'
  return {
    initialValues: {
      originX: values.currentOriginX,
      originY: values.currentOriginX,
    },
    animations: {
      originX: withTiming(values.targetOriginX),
      originY: withTiming(values.targetOriginY),
    },
  }
}
```

![custom layout animation](https://user-images.githubusercontent.com/726445/236950413-bf90e410-79a8-4594-a4e8-f0252220535f.gif)

### Tasks

<details>
<summary><b>[1]</b> Remove animated styles code used perviously and use position state directly with the <code>Aniated.View</code>. Add `layout` property set to one of the predefined animations.
</summary>

After this change the screen component should look as follows:

```js
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
        layout={Layout}
        style={[styles.box, { left: position.x, top: position.y }]}
      />
    </Container>
  )
}
```

</details><br/>

<details>
<summary><b>[2]</b> Define custom <code>ArcLayoutTransition</code> that uses <code>withArcAnimation</code> to animate <code>originX</code> and <code>originY</code> attributes.
</summary>

We follow the custom transition API schema and use `withArcAnimation` with the provided `targetOriginX` and `Y` values as the end point.

```js
export function ArcLayoutTransition(values) {
  'worklet'
  const pathAnimation = withArcAnimation(
    { x: values.targetOriginX, y: values.targetOriginY },
    withTiming(1),
  )
  return {
    initialValues: {
      originX: values.currentOriginX,
      originY: values.currentOriginY,
    },
    animations: {
      originX: pathAnimation.x,
      originY: pathAnimation.y,
    },
  }
}
```

We replace build-in layout transition with the new one in our `Animated.View`

```jsx
<Animated.View
  layout={ArcLayoutTransition}
  style={[styles.box, { left: position.x, top: position.y }]}
/>
```

</details>
<br/>

## Step 5 – Custom shared transition

In the final step of this lesson we will explore the Shared Transition API.
Shared Transitions at its core are very similar to layout transitions (also API-wise), but allow for the transition to be performed across different navigation screens.

In this step we will use `react-navigation` to define a simple Home & Detail screens, and perform a transition along an arc between these two.

![custom shared transition](https://user-images.githubusercontent.com/726445/236952511-6d7944ef-11bc-4cee-9fe8-235f55b4864e.gif)

In order for certain views to perform a shared transition when navigating between screens, they need to be of `Animated.View` (or other type of animated component class), and specify `sharedTransitionTag` property.
The component class and the string value of that property needs to match between the two screens that should perform the transition.

Similarily to layout transitions, shared element transitions can be customized as far as the type of animation.
This can be done by providing a shared transition type via `sharedTransitionStyle` property.
Note that again, the transition style needs to be the same on the components on both ends.

Writing [custom transition types](https://docs.swmansion.com/react-native-reanimated/docs/api/sharedElementTransitions#custom-animation) is also very similar to how it was done with layout transition API.
The one difference is that we will use `SharedTransition.custom` helper to create a new shared transition class.
The worklet that we provide to that helper method needs to only need specify animations for the layout properties.
Below example illustrates a custom shared element transition that moves the element between its initial and final positions using spring animation:

```js
const CustomSharedTransition = SharedTransition.custom((values) => {
  'worklet'
  return {
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  }
})
```

### Tasks

<details>
<summary><b>[1]</b> Use <a href="https://reactnavigation.org/docs/native-stack-navigator/">react-navigation with native-stack</a> to create a stack of Home and Detail screens. Move the previous content of ArcLesson to the Home screen and add a button to open Details screen. On the details screen only render the circle.
</summary>

To use native stack we first add the followin import:

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack'
```

We can now rename ArcLesson to Home component and add button to push Details screen:

```js
function Home({ navigation }) {
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
      <Button
        title="Push"
        onPress={() => {
          navigation.push('ArcDetail')
        }}
      />
      <Animated.View
        layout={ArcLayoutTransition}
        style={[styles.box, { left: position.x, top: position.y }]}
      />
    </Container>
  )
}
```

Now, we define the details screen to just render the circle:

```js
function Detail() {
  return (
    <Container>
      <Animated.View style={[styles.box, { position: 'relative' }]} />
    </Container>
  )
}
```

Finally, we create `ArcLesson` component to render the stack consisting of the screens from above:

```js
const Stack = createNativeStackNavigator()

export function ArcLesson() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ArcHome" component={Home} />
      <Stack.Screen name="ArcDetail" component={Detail} />
    </Stack.Navigator>
  )
}
```

</details><br/>

<details>
<summary><b>[2]</b> Define a built-in shared transition for the circle component to transfer from Home to Detail screens.
</summary>

The only thing that's needed is to add the same tag as `sharedTransitionTag` prop for the circle component in both Home and Detail screens:

Here is the change in Home screen:

```js
<Animated.View
  layout={ArcLayoutTransition}
  sharedTransitionTag="circle"
  style={[styles.box, { left: position.x, top: position.y }]}
/>
```

And similar change in Detail screen:

```js
<Animated.View
  sharedTransitionTag="circle"
  style={[styles.box, { position: 'relative' }]}
/>
```

</details><br/>

<details>
<summary><b>[3]</b> Create a custom Shared Element Transition that uses <code>withArcAnimation</code> and use it to animate the circle between screens.
</summary>

We will use the [custom Shared Transition API](https://docs.swmansion.com/react-native-reanimated/docs/api/sharedElementTransitions#custom-animation) as explained in Reanimated documentation in order to create a `ArcSharedTransition` class:

```js
export const ArcSharedTransition = SharedTransition.custom((values) => {
  'worklet'
  const pathAnimation = withArcAnimation(
    { x: values.targetOriginX, y: values.targetOriginY },
    withTiming(1),
  )
  return {
    originX: pathAnimation.x,
    originY: pathAnimation.y,
    width: withTiming(values.targetWidth, config),
    height: withTiming(values.targetHeight, config),
  }
})
```

Finally, we need to set the transition type on the circle component on both ends.
For the Home screen:

```js
<Animated.View
  sharedTransitionTag="circle"
  layout={ArcLayoutTransition}
  sharedTransitionStyle={ArcSharedTransition}
  style={[styles.box, { left: position.x, top: position.y }]}
/>
```

And for the Detail screen:

```js
<Animated.View
  sharedTransitionTag="circle"
  sharedTransitionStyle={ArcSharedTransition}
  style={[styles.box, { position: 'relative' }]}
/>
```

</details><br/>

## Next step

**Congratulate yourself, you completed the final lesson 👏👏👏👏**

**If you still have time left you can head to the bonus [Marquee](../Marquee/) lesson**
