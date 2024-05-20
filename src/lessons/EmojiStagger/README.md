# Emoji Stagger

In this lesson we'll build an emoji popup animation. This pattern is commonly used in chat-like applications to add a reaction to a message. We're going to use Gesture Handler to implement a long press gesture, shared values, timings, useAnimatedStyle and Reanimated's [Layout Animations](https://docs.swmansion.com/react-native-reanimated/docs/category/layout-animations) for the stagger animation. 

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/f98f1dd7-6ffc-40e7-b0a0-b7b8a51e00ea


## Step 1 – Shrinking a message on long press


https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/7d0ae5e0-0b2d-4d9b-9184-15604953ffa9



<details>
<summary>
  <b>[1]</b> Replace a <code>Pressable</code> logic with a mix of <code>Gesture.LongPress()</code> and <code>Animated.View</code>
</summary>

<br/>

<details>
<summary>
  Change the <code>Pressable</code> to an <code>Animated.View</code> wrapped with a <code>GestureDetector</code>
</summary>

```jsx
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

<GestureDetector>
  <Animated.View
    style={[
      styles.message,
      // ...
    ]}>
    {/*  */}
  </Animated.View>
</GestureDetector>
```
</details>

<details>
<summary>
  Reimplement <code>onPress</code> logic as an <code>Gesture.LongPress()</code>. Pass the defined gesture to the <code>GestureDetector</code>.
</summary>

Don't forget to use `runOnJS` when changing React state inside a gesture callback.

```jsx
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const longPress = Gesture.LongPress()
  .onStart(() => {
    runOnJS(setCurrentPopupId)(message.id);
  })

<GestureDetector gesture={longPress}>
  {/*  */}
</GestureDetector>
```

</details>

</details>
<br/>
<details>
<summary>
  <b>[2]</b> Implement shrinking animation using <code>useAnimatedStyle</code> hook and <code>Gesture.LongPress</code>
</summary>

<br/>

<details>
<summary>Define a <code>pressed</code> shared value initialized with <code>false</code></summary>

Shared value is a current state of an animation.

```jsx
import { useSharedValue } from 'react-native-reanimated';

const pressed = useSharedValue(false);
```
</details>

<details>
<summary>
Set the <code>pressed</code> shared value to <code>true</code> when gesture begins and <code>false</code> when it finalizes
</summary>

```jsx
const longPress = Gesture.LongPress()
  .onBegin(() => {
    pressed.value = true;
  })
  .onStart(() => {...})
  .onFinalize(() => {
    pressed.value = false;
  });
```
</details>

<details>
<summary>
Animate the element's scale using <code>useAnimatedStyle</code> and <code>withTiming</code> modifier. Don't forget to pass the defined styles to an <code>Animated.View</code>
</summary>

```jsx
const animatedStyles = useAnimatedStyle(() => ({
  transform: [
    { scale: withTiming(pressed.value ? 0.96 : 1) },
  ],
}));

<Animated.View
  style={[
    styles.message,
    animatedStyles            // <------------ right here
  ]}>{/*  */}</Animated.View>
```

</details>
<br/>
</details>

## Step 2 – Using Layout Animations


https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/e0e081fb-15c1-4d6d-9e72-80edff36ed9f

<details>
<summary>
  <b>[1]</b> Replace <code>emojiPopupWrapper</code>, <code>emojiPopup</code> and <code>emoji</code> elements with Animated components
</summary>

```jsx
<Animated.View style={[styles.emojiPopupWrapper, styles.shadow]}>
  <Animated.View style={styles.emojiPopup}>
    {emojis.map((emoji) => (
      <Animated.Text style={styles.emoji} key={emoji}>
        {emoji}
      </Animated.Text>
    ))}
  </Animated.View>
</Animated.View>
```

</details>

<details>
<summary>
  <b>[2]</b> Add <code>FadeInDown</code>, <code>FadeInRight</code>, <code>ZoomIn</code> entering animations
</summary>

```jsx
<Animated.View
  entering={FadeInDown} // <----- here
  style={[styles.emojiPopupWrapper, styles.shadow]}>
  <Animated.View 
    entering={FadeInRight} // <----- here
    style={styles.emojiPopup}>
    {emojis.map((emoji) => (
      <Animated.Text
        style={styles.emoji}
        key={emoji}
        entering={ZoomIn}>  // <----- and here
        {emoji}
      </Animated.Text>
    ))}
  </Animated.View>
</Animated.View>
```
</details>

<details>
<summary>
<b>[3]</b> Add <code>FadeOutDown</code> exiting animation to the <code>emojiPopupWrapper</code>


</summary>

```jsx
<Animated.View
  entering={FadeInDown}
  exiting={FadeOutDown} // <----- right here
  style={[styles.emojiPopupWrapper, styles.shadow]}>
```

</details>



## Step 3 – Customize the Layout Animations



https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/39658211/cdf5e6b4-79cc-4659-b27c-59692af90f95


<details>
<summary>
<b>[1]</b> Customize the length of entering animation using <code>.duration()</code> modifier
</summary>

```jsx
<Animated.View
  entering={FadeInDown.duration(200)}  // <----- here
  exiting={FadeOutDown}
  style={[styles.emojiPopupWrapper, styles.shadow]}>
```

</details>


<details>
<summary>
<b>[2]</b> Implement stagger animation
</summary>

<br/>

<details>
<summary>
Multiply the array <code>index</code> times the delay inside <code>.delay()</code> modifier on the <code>ZoomIn</code> animation
</summary>

```jsx
<Animated.Text
  entering={ZoomIn.delay(33 * i + 100)}>
```
</details>

<details>
<summary>
Use <code>.springify()</code> modifier to emphasize the effect 
</summary>

```jsx
<Animated.Text
  style={styles.emoji}
  entering={ZoomIn.delay(33 * i + 100)
    .springify()
    .stiffness(200)
    .damping(10)}>
```
</details>

</details>



## Next step

**Go to: [Skia Theme Curtain](../SkiaThemeCurtain/)**
