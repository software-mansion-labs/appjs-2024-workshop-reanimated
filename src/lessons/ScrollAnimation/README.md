# Scroll Animation

https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/2805320/064d6dff-06a0-42fd-b223-ab2adee68ffe

## Step 1 - Animate Alphabet letters

https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/2805320/cfe193d7-f212-45e4-a642-61913f1a0426

To animate the Alphabet letters we need to setup some shared values.

We first need to have an `animatedRef` for the `alphabetContainer` in order to get the layout dimensions and clamp the `knob` movement on the `y` axis (using clamp as we did for the slider on the previous exercise) but to also get the `height` of each individual `letter` from where we can estimate the `index` of the active letter. Having the height the `letter` and the `y` position of the knob, we can calculate the active letter `index` and assign it to a `sharedValue` that we can later use.

<details>
<summary>
  <b>[1]</b> create a ref using `useAnimatedRef` and add it to the `alphabetContainer`
</summary>

```jsx
const alphabetRef = useAnimatedRef<View>()
```

</details>
<br/>
<details>
<summary>
  <b>[2]</b> create two `shared values`, one to store the active index as float and another one to store the rounded value of the scroll. One shared value will be used to animate individual letters and the other one to snap to a fixed position after `pan` gesture is released. (We are using 2 different shared values because letter will move according to the float shared value and we’ll be snapping to the active letter using the rounded number)
</summary>

```jsx
// float value (used for animation)
const scrollableIndex = useSharedValue(0);
// rounded value (used to snap to position)
const activeScrollIndex = useSharedValue(0);
```

</details>
<br/>
<details>
<summary>
  <b>[3]</b> when `panGesture` change, clamp the `y.value` between the `alphabet` container dimensions  (Hint: use `measure` to get the container dimensions) (Hint2: take into account the knob size as well)
</summary>

```jsx
const alphabetLayout = measure(alphabetRef);
if (!alphabetLayout) {
  return;
}
y.value = clamp(
  (y.value += ev.changeY),
  alphabetLayout.y, // take into account the knob size
  alphabetLayout.height - layout.knobSize
);
```

</details>
<br/>
<details>
<summary>
  <b>[4]</b> now that the `knob` can only move within the `alphabet` container range, inside the same `onChange` method calculate the height of each `letter` based on `alphabetContainer` layout and assign the float shared value and rounded shared value

⚠️ Hint: If `height=200` and you have `number_of_elements=10`, diving the `height / number_of_element` will give you the `element_height=20`, assuming that all elements are evenly distributed. Now, with the `element_height` you can determine, by picking any location within `[0, height]` what the active element is, by simply diving `position / element_height` . Eg:

```jsx
height = 200
number_of_elements = 10
element_height = height / number_of_elements = 20
position = 50
scrollingIndex = height / number_of_elements = 2.5
// We can asume that
active_element = round(scrollingIndex)
scrolling_position is between [2,3]
```

</summary>

```jsx
// This is snapTo by the same interval. This will snap to the nearest
// letter based on the knob position.
const snapBy =
  (alphabetLayout.height - layout.knobSize) / (alphabet.length - 1);

scrollableIndex.value = y.value / snapBy;
const snapToIndex = Math.round(scrollableIndex.value);

// Ensure that we don't trigger scroll to the same index.
if (snapToIndex === activeScrollIndex.value) {
  return;
}

// This is to avoid triggering scrolling to the same index.
activeScrollIndex.value = snapToIndex;
```

</details>
<br/>
<details>
<summary>
  <b>[5]</b> when we end the gesture, you should snap to the closest letter index (rounded index). To do so, create a method, called `snapIndicatorTo` that will release an `index: number` and internally will `measure` alphabet layout, calculate the snap segment (using the Math from the previous step) and apply a timing function with the resulted value to both `y` position of the knob and animated value responsible for animating letters, finally, use a `timing` function to animate to final destination. (This will ensure that when pan is not active anymore, we always snap to the closest letter)

⚠️ Hint: `measure` should run in `UI`

</summary>

```jsx
const snapIndicatorTo = (index: number) => {
  runOnUI(() => {
    "worklet";

    if (scrollableIndex.value === index || isInteracting.value) {
      return;
    }

    const alphabetLayout = measure(alphabetRef);
    if (!alphabetLayout) {
      return;
    }
    const snapBy =
      (alphabetLayout.height - layout.knobSize) / (alphabet.length - 1);
    const snapTo = index * snapBy;
    y.value = withTiming(snapTo);
    scrollableIndex.value = withTiming(index);
  })();
};
```

</details>
<br/>
<details>
<summary>
  <b>[6]</b> Call this method when `pan` gesture ended with the `rounded` index as argument.

⚠️ Hint: This method should be called with `runOnJS`

</summary>

```jsx
.onEnd(() => {
  runOnJS(snapIndicatorTo)(activeScrollIndex.value)
})
```

</details>
<br/>
<details>
<summary>
  <b>[7]</b> We should animate the letter now right? :) Pass the shared value with the float index to each `<AlphabetLetter />` as prop, update the `TypeScript` props and create a style using `useAnimatedStyle` that will change the `opacity` and `scale` when the `shared value` is in `[index - 1, index, index + 1]` range and apply this style to the `Animated.View`. (You you’re own values for the output range or `opacity: 0.5 and 1` `scale: 1 and 1.5`

⚠️ Hint: use `interpolate` for the styles

⚠️ Hint2: You can think about the input range of the interpolation as `(previous, current, next)` index and what should happen when the position is within this range.

⚠️ Hint3: To avoid animating the letter when the position is outside the range, use `CLAMP` for extrapolation.

</summary>

```jsx
<AlphabetLetter
  // other props
  index={i}
  scrollableIndex={scrollableIndex}
/>

type AlphabetLetterProps = {
  // ...
  scrollableIndex: SharedValue<number>
}

const styles = useAnimatedStyle(() => {
  return {
    opacity: interpolate(
      scrollableIndex.value,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          scrollableIndex.value,
          [index - 2, index, index + 2],
          [1, 1.5, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }
})

<Animated.View
  style={[
    ...otherStyles
    styles
  ]}
>
```

</details>
<br/>

## Step 2 - Scroll the SectionList

https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/2805320/27d33ae5-b3f7-46dd-b48d-1a0bf93bf30f

`SectionList` expose a `scrollToLocation` on the `ref` and we are going to use it. When `knob` position has changed, we’re going to call this method with the rounded index that we’ve calculated. Let’s start implementing this:

NB: Because `SectionList` its a virtualized list, it might happen that the section index that you want to scroll to is outside the render window, which means that the scroll will fail unless you provide the layout for each item and section. We are using `react-native-section-list-get-item-layout` to calculate `getItemLayout` for this `SectionList`

⚠️ Hint: Check `scrollToLocation` [method signature here](https://reactnative.dev/docs/sectionlist#scrolltolocation)

<details>
<summary>
  <b>[1]</b> create the ref for `SectionList` and add it to the list
</summary>

```jsx
const scrollViewRef = useRef<SectionList>(null)

<SectionList
  ref={scrollViewRef}
  // other props
/>
```

</details>
<br/>
<details>
<summary>
  <b>[2]</b> Create a method that will receive an `index: number` as argument and calls `scrollToLocation` on the ref using the `index` as `sectionIndex`
</summary>

```jsx
const scrollToLocation = (index: number) => {
  scrollViewRef.current?.scrollToLocation({
    itemIndex: 0,
    sectionIndex: index,
    animated: false,
  });
};
```

</details>
<br/>
<details>
<summary>
  <b>[3]</b> call this method immediately after you set the `rounded` shared value of the index inside `pan` gesture `.onChange` method

⚠️ Hint: This method should be called with `runOnJS`

</summary>

```jsx
runOnJS(scrollToLocation)(snapToIndex);
```

</details>
<br/>

## Step 3 - Scroll the SectionList

https://github.com/software-mansion-labs/appjs-2023-workshop-reanimated/assets/2805320/064d6dff-06a0-42fd-b223-ab2adee68ffe

By now, the `knob` will change scroll inside the `SectionList` (we can call this `Alphabet -> SectionList`) but we would like to control the `knob` position or active letter while scrolling inside `SectionList` (`SectionList → Alphabet`). To do so, we’re going to hook to the `onViewableItemsChange` prop exposed by `SectionList` (Check [onViewableItemsChange](https://reactnative.dev/docs/sectionlist#onviewableitemschanged) method signature.) and get the middle element that visible on the screen, get his section index and use `snapIndicatorTo` to animate the `knob` new position.

⚠️ Hint: The section index might be missing

<details>
<summary>
  solution
</summary>

```jsx
onViewableItemsChanged={({ viewableItems }) => {
  const half = Math.floor(viewableItems.length / 2)
  const section = viewableItems[half]?.section
  if (!section) {
    return
  }
  const { index } = section as ContactSection
  snapIndicatorTo(index)
}}
```

</details>
<br/>

## Next step

**Go to: [Emoji Stagger](../EmojiStagger/)**
