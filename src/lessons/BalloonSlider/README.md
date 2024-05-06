# Balloon Slider

In this lesson we will build a nice gesture and sensor based progress bar interaction.
Along the way we will explore Reanimated's measure, derived value, reactions, sensors, and custom animation APIs.


https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/39658211/fd78c816-fe22-4ac3-b822-89be077ecdea


## Step 1 – Create a progress bar

In this step we will turn the code from the previous lesson into a slider with a progress bar:



https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/39658211/758c305d-fe6e-4529-aa54-e51b17f6ffae



### Tasks

<details>
<summary>
  <b>[1]</b> Copy the code displaying a knob from the previous lesson and modify it such that it no longer snaps to the center upon release.
</summary>

Remove `onFinalize` callback from the previous lesson which should result in the knob staying at the place where it was released.

</details><br/>

<details>
<summary>
  <b>[2]</b> Render a horizontal progress bar that guides the knob. Make the part to the left from the knob a different color than the right part.
</summary>

We will need two separate views to implement that.
One of the view representing the whole progress bar will wrap the knob view and the "completed progress" view while being put inside of the `GestureDetector` component.
This way, it'll be possible to start panning at any place on the bar.
The second "completed progress" view will be added inside along the knob.
We will use the shared value representing the knob position to control the width of this view:

```js
return (
  <Container>
    <GestureDetector gesture={gestures}>
      <View style={styles.slider} hitSlop={hitSlop}>
        <Animated.View style={[styles.progress, { width: x }]} />
        <Animated.View style={[styles.knob, animatedStyle]} />
      </View>
    </GestureDetector>
  </Container>
)
```

We need some additional style to position everything correctly:

```js
const styles = StyleSheet.create({
  slider: {
    width: '80%',
    backgroundColor: colorShades.purple.light,
    height: 5,
    justifyContent: 'center',
  },
  progress: {
    height: 5,
    backgroundColor: colorShades.purple.dark,
    position: 'absolute',
  },
})
```

</details>
<br/>

## Step 2 – Synchronous measure

In this step we will update the code such that it only allows for a movement within the boundaries of the progress bar.
We will use [Reanimated's synchronous `measure`](https://docs.swmansion.com/react-native-reanimated/docs/api/nativeMethods/measure) in order to get the dimension of the progress bar, such that we can use it as the upper bound for the position when processing pan gesture event.

In order to measure views synchronoulsy in Reanimated you need an [animated ref object](https://docs.swmansion.com/react-native-reanimated/docs/api/hooks/useAnimatedRef) that is assigned to a component that you want to measure:

```js
const aref = useAnimatedRef()

return <View ref={aref} />
```

Now you can pass the animated ref object to the `measure` method from Reanimated in order to get the view's position and dimensions.



https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/39658211/bf1a8958-1fe7-422f-bcf8-ad40cd932d0a



### Tasks

<details>
<summary>
  <b>[1]</b> Create animated ref object and assign it to the progress bar component.
</summary>

Add the following hook to your component:

```tsx
const aRef = useAnimatedRef<View>()
```

</details><br/>

<details>
<summary>
  <b>[2]</b> Update <code>onChange</code> implementation to retrieve width of the progress bar and to clamp the knob position such that it never exceeds the width or goes below 0.
</summary>

We can use `clamp` method from `@lib/reanimated` helper file to implement `onChange` handler as follows:

```tsx
const panGesture = Gesture.Pan().onChange((ev) => {
  const size = measure(aRef)
  x.value = clamp((x.value += ev.changeX), 0, size.width)
})
```

</details><br/>

## Step 3 – Showing the balloon

In this step we will render a balloon over the knob that follows the knob movement.
We will use similar technique to knob scaling in order to animate the balloon in and out when the user is interacting with the knob:



https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/39658211/f346fb9b-587e-44a3-b1b0-9e495cb154c7



### Tasks

<details>
<summary>
  <b>[1]</b> Add a balloon with static text.
</summary>

We start by adding a necessary component representing the balloon to the view hierarchy:

```ts
return (
  <Container>
    <GestureDetector gesture={gestures}>
      <View ref={aRef} style={styles.slider} hitSlop={hitSlop}>
        <Animated.View style={styles.balloon}>
          <View style={styles.textContainer}>
            <Text style={{ color: 'white', fontWeight: '600' }}>10</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.progress, { width: x }]} />
        <Animated.View style={[styles.knob, animatedStyle]} />
      </View>
    </GestureDetector>
  </Container>
)
```

And the necessary styles:

```ts
const styles = StyleSheet.create({
  textContainer: {
    width: 40,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorShades.purple.base,
    position: 'absolute',
    top: -layout.knobSize,
  },
  balloon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 4,
    height: layout.indicatorSize,
    bottom: -layout.knobSize / 2,
    borderRadius: 2,
    backgroundColor: colorShades.purple.base,
    position: 'absolute',
  },
})
```

</details><br/>

<details>
<summary>
  <b>[2]</b> Create animated styles for the balloon such that it follows the knob.
</summary>

We create a new animated style object in our component and use shared value representing knob position to control the x-translation of the balloon:

```ts
const balloonStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: x.value }],
  }
})
```

We then use the defined animated style in the view that represents the balloon:

```ts
<Animated.View style={[styles.balloon, balloonStyle]}>
```

</details><br/>

<details>
<summary>
  <b>[3]</b> Add appear/disappear effect: animated y-position to slide up/down, scale, and opacity.
</summary>

We create a secondary shared value to control the balloon scale that's initially set to 0.
Then we update it along the scale shared value used for the knob:

```ts
const balloonScale = useSharedValue(0)

const tapGesture = Gesture.Tap()
  .maxDuration(100000)
  .onBegin(() => {
    scale.value = withSpring(2)
    balloonScale.value = withSpring(1)
  })
  .onEnd(() => {
    scale.value = withSpring(1)
    balloonScale.value = withSpring(0)
  })
```

We update balloon's animated styles and use the scale value to interpolate y-transition, opacity and the scale:

```ts
const balloonStyle = useAnimatedStyle(() => {
  return {
    opacity: balloonScale.value,
    transform: [
      { translateX: x.value },
      { scale: balloonScale.value },
      {
        translateY: interpolate(
          balloonScale.value,
          [0, 1],
          [0, -layout.indicatorSize],
        ),
      },
    ],
  }
})
```

</details><br/>

## Step 4 – Animating text

In this step we will learn how



https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/39658211/5adb1e1b-cb5f-4d5e-8ea4-3b987d3cddc9



### Tasks

<details>
<summary>
  <b>[1]</b> Use <code>AnimatedText</code> component from <code>@components/AnimatedText</code> to display the progress percentage on the balloon.
</summary>

Here is the updated part of the render method:

```js
return (
  <Container>
    <GestureDetector gesture={panGesture}>
      <View ref={aRef} style={styles.slider} hitSlop={hitSlop}>
        <Animated.View style={[styles.balloon, balloonStyle]}>
          <View style={styles.textContainer}>
            <AnimatedText
              text={progress}
              style={{ color: 'white', fontWeight: '600' }}
            />
          </View>
        </Animated.View>
        <Animated.View style={[styles.progress, { width: x }]} />
        <Animated.View style={[styles.knob, animatedStyle]} />
      </View>
    </GestureDetector>
  </Container>
)
```

</details><br/>

<details>
<summary>
  <b>[2]</b> Check the implementation from <code>@components/AnimatedText</code> to learn how non-style properties can be manipulated with Reanimated's <code>useAnimatedProps</code> hook.
</summary>

👀

</details><br/>

## Step 5 – Balloon physics

In this step we will add some physics to the balloon movement.
We will simulate the balloon inertia such that it appears to be attached to the knob from the bottom and leans to the side while following the knob movement.



https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/39658211/9c9f7743-d276-46df-92cb-fccc455fb27d



The technique we are going to use is to create a shared value that will follow the top of the balloon.
Then use the top and bottom positions to calculate the angle to rotate the balloon view.
Since we want the top part to have inertia, we will use [spring animation](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withSpring) along with [`useDerivedValue`](https://docs.swmansion.com/react-native-reanimated/docs/api/hooks/useDerivedValue) hook to follow the updates of the knob position using spring.

### Tasks

<details>
<summary>
  <b>[1]</b> Figure out the formula for the balloon angle
</summary>

To calculate the angle you can use the following code:

```js
Math.atan2(TOP_X - BOTTOM_X, BALLON_HEIGHT)
```

</details><br/>

<details>
<summary>
  <b>[2]</b> Create a derived value that represents the top of the balloon and follows the knob position using spring animation.
</summary>

```js
const balloonSpringyX = useDerivedValue(() => {
  return withSpring(x.value)
})
```

</details><br/>

<details>
<summary>
  <b>[3]</b> Update balloon's animated style to include the rotation calculated based on the formula from pt 1.
</summary>

We need to add `rotate` attribute at the end of the transforms in balloon's animated style:

```ts
const balloonStyle = useAnimatedStyle(() => {
  return {
    opacity: knobScale.value,
    transform: [
      { translateX: balloonSpringyX.value },
      { scale: knobScale.value },
      {
        translateY: interpolate(
          knobScale.value,
          [0, 1],
          [0, -layout.indicatorSize],
        ),
      },
      {
        rotate: `${Math.atan2(
          balloonSpringyX.value - x.value,
          layout.indicatorSize * 2,
        )}rad`,
      },
    ],
  }
})
```

</details><br/>

## Step 6 – Custom animations (gravity with sensors)

In the final step we will explore Reanimated's sensors and custom animations API.

In order to integrate Reanimated code with device sensors, the library provides [`useAnimatedSensor`](https://docs.swmansion.com/react-native-reanimated/docs/api/hooks/useAnimatedSensor/) hook, which takes a single argument – the sensor type (we will use `SensorType.GRAVITY` for gyroscope), and returns an object that consists of `sensor` shared value that gets updated with the sensor data (different data shape depending on the sensor type used).

We will use information from the sensor to simulate a gravity movement of the know along the progress bar.
That is, when leaning the device to left, we'd expect the knob to start moving towords the left side.
This effect can be implemented in various different ways, but for the sake of this excercise we will build a custom animation called `withGravity` (much like there exists `withSpring` and similar).

In order to define a custom animation, we will use `defineAnimation` API from Reanimated.
This API takes an animation factory worklet that instantiates an animation object for a given animation configuration.
The animation object consists of two main methods: `oStart` and `onFrame`.
Below we present a template for defining the custom gravity animation:

```ts
function withGravity(userConfig) {
  'worklet'
  return defineAnimation(0 /* initial position if none is specified */, () => {
    'worklet'
    return {
      onStart: (
        animation /* animation object reference */,
        value /* position at the moment when animation is started */,
        now /* timestamp */,
        previousAnimation /* previous animation object if we override a new animation over a running one */,
      ) => {},
      onFrame: (
        animation /* animation object reference */,
        now /* timestamp */,
      ) => {
        // This method is expected to write the updated position for this animation into `animation.current`
        // Should return true if animation has finished or false otherwise
      },
    }
  })
}
```

When an animation is ongoing, `onFrame` callback will execute on every frame.
It is expected for the `onFrame` callback to update `animated.current` field with the current position of the animated value, and to return `true` when the animation completes.

Finally to get all the things hooked together, we will use [`useAnimatedReaction`](https://docs.swmansion.com/react-native-reanimated/docs/api/hooks/useAnimatedReaction/) hook, which helps in executing side-effect upon shared value updates.
We will use this hook to process updates to the sensor and start gravity animation for the knob position.
This hook takes two arguments: one is the "prepare" worklet and the other is "reaction" worklet.
In our case we will use "prepare" phase to calculate the acceleration based on the device rotation, then use that gravity in the "reaction" phase to run the animation.

```js
seAnimatedReaction(
  () => {
    return calculateAccelerationBasedOnRotation(sensor.value.x)
  },
  (acceleration) => {
    // start gravity animation
    x.value = withGravity({ acceleration })
  },
)
```
  

https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/39658211/6ad59da2-f156-4d13-87c5-320213e0b97b




### Tasks

<details>
<summary>
  <b>[1]</b> Define <code>withGravity</code> method using the provided schema, use <code>animation</code> object to keep velocity and last timestamp, then use these two along with configured acceleration to calculate new velocty and position.
</summary>

Below we show an initial implementation of `withGravity` that

```js
function withGravity(userConfig) {
  'worklet'
  return defineAnimation(0, () => {
    'worklet'
    const config = {
      acceleration: 9.81,
      velocity: 0,
    }
    Object.assign(config, userConfig)
    return {
      onStart: (animation, value, now, previousAnimation) => {
        animation.current = value
      },
      onFrame: (animation, now) => {
        const { lastTimestamp, current, velocity } = animation
        const { acceleration } = config
        const delta = (now - lastTimestamp) / 1000
        animation.current = current + velocity * delta
        animation.velocity =
          velocity +
          (acceleration - Math.sign(velocity) * (kineticFriction ?? 0)) * delta
        animation.lastTimestamp = now

        return false
      },
    }
  })
}
```

</details><br/>

<details>
<summary>
  <b>[2]</b> Add "continuity" by using <code>previousAnimation</code> in <code>onStart</code> object to copy last timestamp and velocity from the previous gravity animation. This way we can continue the previous animation while changing the configuration (i.e. update acceleration)
</summary>

Below we present the updated `onStart` callback

```js
return {
  onStart: (animation, value, now, previousAnimation) => {
    animation.current = value
    animation.lastTimestamp = previousAnimation?.lastTimestamp ?? now
    animation.velocity = previousAnimation?.velocity ?? config.velocity
  },
}
```

</details><br/>

<details>
<summary>
  <b>[3]</b> Use animated reaction as presented above to hook sensor with the gravity animation. Note that since the animation never ends, the knob will animate away the progress bar bounds.
</summary>

Here is how animated reaction can be used to spawn gravity animation on shared value representing the knob position.

```js
const GRAVITY = 9.81 * 100

useAnimatedReaction(
  () => {
    return GRAVITY * Math.sin(sensor.value.x)
  },
  (gravity) => {
    const size = measure(aRef)
    x.value = withGravity({
      clamp: [0, size.width],
      acceleration: gravity,
      staticFriction: 800,
      kineticFriction: 500,
    })
  },
)
```

</details><br/>

<details>
<summary>
  <b>[4]</b> Prevent gravity animation from running when user is interacting with the knob. This can be done by defining <code>isTouching</code> shared value and updating it accordingly in gesture callbacks.
</summary>

We first define the new shared value:

```ts
const isTouching = useSharedValue(false)
```

Next, we add `onBegin` and `onFinalize` callbacks to pan when we update its value:

```ts
const panGesture = Gesture.Pan()
  .onBegin(() => {
    isTouching.value = true
  })
  .onFinalize(() => {
    isTouching.value = false
  })
```

Finally, we take the new variable into account in the sensor reaction – we don't want the animation to start when sensor is active:

```ts
useAnimatedReaction(
  () => {
    return isTouching.value ? undefined : GRAVITY * Math.sin(sensor.value.x)
  },
  (gravity) => {
    if (gravity !== undefined) {
      x.value = withGravity({
        acceleration: gravity,
      })
    }
  },
)
```

</details><br/>

<details>
<summary>
  <b>[5]</b> Add bounds as a config parameter for <code>withGravity</code> and use it to prevent the knob from falling off the cliff.
</summary>

We update gravity animation such that it extract bounds from config object and uses it later on when updating velocty and position.
Note that when we reach bound the bound we want to finish the animation, however if there is a velcoty towards the opposite direction we want for it to continue.

```ts
return {
  onFrame: (animation, now) => {
    const { lastTimestamp, current, velocity } = animation
    const { acceleration, bounds } = config
    const delta = (now - lastTimestamp) / 1000
    animation.current = current + velocity * delta
    animation.velocity =
      velocity +
      (acceleration - Math.sign(velocity) * (kineticFriction ?? 0)) * delta
    animation.lastTimestamp = now

    if (bounds) {
      if (animation.current <= bounds[0]) {
        animation.current = bounds[0]
        if (animation.velocity <= 0) {
          animation.velocity = 0
          return true
        }
      } else if (animation.current >= bounds[1]) {
        animation.current = bounds[1]
        if (animation.velocity >= 0) {
          animation.velocity = 0
          return true
        }
      }
    }
    return false
  },
}
```

</details><br/>

<details>
<summary>
  <b>[BONUS 1]</b> Add static friction to the gravity animation such that the know does not start moving immediately and with low device angles.
</summary>

Just check [steps/final.tsx](./steps/final.tsx) – this is the final step 🤷

</details><br/>

## Next step

**Go to: [Dynamic Tabs](../DynamicTabs/)**
