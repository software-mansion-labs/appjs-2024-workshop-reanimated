# Skia Theme Curtain

In this lesson we'll use the power of Skia Shaders with help of Reanimated to create an incredibly fancy theme switcher effect. This animation is often called a "magic curtain" effect.


https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/a6d2a441-1e70-4983-8f8f-cb151e709b7e

## Step 1 – Overlay the UI with a snapshot 

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/fcc68cb4-1e46-43a6-a67d-359798733ee7



<details>
<summary>
  <b>[1]</b> Make a snapshot of the UI and overlay the app with it
</summary>

<br/>

<details>
<summary>
Define a ref and attach it to the <code>ScrollView</code>
</summary>

```jsx
import { useRef } from 'react-native-reanimated';

function App() {
  const ref = useRef<ScrollView>(null);
  // ...

  return (
    {/* */}
    <ScrollView ref={ref}>
    {/* */}
    </ScrollView>
  )
}
```
</details>

<details>
<summary>
Make a snapshot using <code>makeImageFromView</code> function and store it in state
</summary>

```jsx
import { useState } from 'react';
import { makeImageFromView, type SkImage } from "@shopify/react-native-skia";

function App() {
  // ...
  const [firstSnapshot, setFirstSnapshot] = useState<SkImage | null>(null);

  const changeTheme = async () => {
    const snapshot = await makeImageFromView(ref);
    setFirstSnapshot(snapshot);
    // ...
  };
}
```
</details>

</details>

<br/>

<details>
<summary>
<b>[2]</b> Overlay the UI with an absolutely positioned <code>Image</code> inside a <code>Canvas</code>
</summary>


```jsx
import { Canvas, Image } from "@shopify/react-native-skia";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");
function App() {
  // ...
  return (
    <View style={styles.fill}>
      {firstSnapshot && (
        <Canvas style={styles.overlay}>
          <Image
            image={firstSnapshot}
            fit="cover"
            width={width}
            height={height}
          />
        </Canvas>
      )}
      <ScrollView>
        {/* */}
  )
}
      
```
</details>

<br/>




## Step 2 – Swap snapshots when theme changes



https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/3790da31-f172-4953-a44b-3453d3c47ad4

<details>
<summary>
  <b>[1]</b> Make a second snapshot when Appearance changes. Note: you'll need to use a <code>setTimeout</code>!
</summary>

```jsx
import { useState } from 'react';
import { makeImageFromView, type SkImage } from "@shopify/react-native-skia";

function App() {
  const [secondSnapshot, setSecondSnapshot] = useState<SkImage | null>(null);

  useEffect(() => {
    const listener = Appearance.addChangeListener(() => {
      setTimeout(async () => {
        const snapshot = await makeImageFromView(ref);
        setSecondSnapshot(snapshot);
      }, 30);
    });
    // cleanup ...
  }, []);

  // ...
}

```

</details>
<br/>

<details>
<summary>
<b>[2]</b> Show second snapshot when both snapshots are ready (not null)
</summary>

```jsx
import { Canvas, Image } from "@shopify/react-native-skia";
const { width, height } = Dimensions.get("window");

function App() {
  // ...
  const isTransitioning = firstSnapshot !== null && secondSnapshot !== null;
  if (isTransitioning) {
    return (
      <View style={styles.fill}>
        <Canvas style={{ height: height }}>
          <Image
            image={secondSnapshot}
            fit="cover"
            width={width}
            height={height}
          />
        </Canvas>
        <StatusBar translucent />
      </View>
    );
  }

  return (
    // ...
  )
}
```

</details>


## Step 3 – Animate the snapshots using GLSL/Skia Shaders

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/79ad34f6-806f-44a9-b978-2269b4f3a852

<details>
<summary>
  <b>[1]</b> Keep track of the transition progress using a shared value
</summary>

<br/>
<details>
<summary>
Define a <code>progress</code> shared value initialized with <code>0</code>
</summary>

```jsx
import { useSharedValue } from 'react-native-reanimated';

function App() {
  const progress = useSharedValue(0)
  // ...
}
```
</details>

<details>
<summary>Update the progress shared value after the second snapshot. Use <code>withTiming</code> animation. Set timing duration to <code>TRANSITION_DURATION</code> </summary>

```jsx
  const listener = Appearance.addChangeListener(() => {
    setTimeout(async () => {
      // ...
      progress.value = withTiming(
        1,
        { duration: TRANSITION_DURATION }
      );
      // ...
```

</details>


<details>
<summary>
Clean up the stored snapshots on animation finish. Hint: use 3rd argument of <code>withTiming</code> and calls to <code>runOnJS</code>.
</summary>


```jsx
  progress.value = withTiming(
    1,
    { duration: TRANSITION_DURATION },
    () => {
      runOnJS(setFirstSnapshot)(null);
      runOnJS(setSecondSnapshot)(null);
    },
  );
```

</details>

<details>
<summary>
(Optional) Debug the progress shared value using the <code>useDerivedValue</code> hook
</summary>
Using <code>useDerivedValue</code> reacts to the changes of a shared value allowing printing the current value to the console.

```jsx
useDerivedValue(() => {
  console.log(progress.value);
})
```

</details>

</details>

<details>
<summary>
<b>[2]</b> Use Skia Shaders to animate the transition
</summary>

<br/>

<details>
<summary>
Use <code>ImageShader</code> components wrapped a <code>Shader</code> when transitioning
</summary>

```jsx
import { Canvas, Fill, ImageShader, Shader } from "@shopify/react-native-skia";

function App () {
  // ...
  if (isTransitioning) {
    return (
      <View style={styles.fill}>
        <Canvas style={{ height: height }}>
          <Fill>
            <Shader>
              <ImageShader
                image={firstSnapshot}
                fit="cover"
                width={width}
                height={height}
              />
              <ImageShader
                image={secondSnapshot}
                fit="cover"
                width={width}
                height={height}
              />
            </Shader>
          </Fill>
        </Canvas>
        <StatusBar translucent />
      </View>
    );
  }

  return (
    // ...
  )
}

```

</details>

<details>
<summary>Define <code>progress</code> and <code>resolution</code> shader uniforms based on the <code>progress</code> shared value using <code>useDerivedValue</code> and pass it to the <code>Shader</code>.</summary>

<br/>

Uniforms control the shader behavior.

```jsx
import { useDerivedValue } from 'react-native-reanimated';

function App() {
  // ...
  const uniforms = useDerivedValue(() => {
    return {
      progress: progress.value,
      resolution: [width, height], // from Dimensions.get("window")
    };
  });
  // ...

  <Shader uniforms={uniforms}>
}
```

</details>


<details>
<summary>
Based on the <code>colorScheme</code> pass conditionally the <code>warpUp</code> and <code>warpDown</code> glsl transtions as the <code>source</code> prop to the <code>Shader</code> component. You'll need to wrap the transitions with the <code>transition</code> function imported from <code>"@/lib/shader"</code>.
</summary>

```jsx
<Shader
  source={transition(colorScheme === "light" ? warpUp : warpDown)}
  uniforms={uniforms}
>
```
</details>

</details>

<br/>

You can source GLSL transtions from a great resource called [Gl-Transitons](https://gl-transitions.com/gallery). 

## Next step

**Go to: [Interpolation](../Interpolation/)**
