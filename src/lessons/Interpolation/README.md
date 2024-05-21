# Interpolations

_Placeholder_

## Step 1 – all the things but scroll

In this lesson we are going to change listen to `onScroll` events on a FlatList.

_Placeholder video_

<details>
<summary>
  <b>[1]</b> Convert `FlatList` to an `Animated.FlatList`.
</summary>

```jsx
import Animated from 'react-native-reanimated';

<Animated.FlatList
  data={item}
  ...
/>
```

</details>

<details>
<summary>
  <b>[2]</b> create `scrollX` as a SharedValue that will start from `0`
</summary>

```jsx
import { useSharedValue } from "react-native-reanimated";

export function Interpolation() {
  const scrollX = useSharedValue(0);
  // ...
}
```

</details>

<details>
<summary>
  <b>[3]</b> Listen to `onScroll` event on `Animated.FlatList` and modify the `scrollX` SharedValue with the `contentOffset.x`.
</summary>

```jsx
import { useAnimatedScrollHandler } from "react-native-reanimated";

// shorthand notation
const onScroll = useAnimatedScrollHandler((e) => {
  scrollX.value = e.contentOffset.x;
});

// targeting specifically onScroll
const onScroll = useAnimatedScrollHandler({
  onScroll: (e) => {
    scrollX.value = e.contentOffset.x;
  },
});
```

</details>

<details>
<summary>
  <b>[4]</b> Pass `onScroll` as prop to the `Animated.FlatList`.
</summary>

```jsx
import Animated from "react-native-reanimated";

<Animated.FlatList
  data={items}
  onScroll={onScroll} //<-
/>;
```

</details>

<details>
<summary>
  <b>[5]</b> Pass `onScroll` to the `renderItem` component.
</summary>

```jsx
import Animated from "react-native-reanimated";

<Animated.FlatList
  data={items}
  onScroll={onScroll} //<
/>;
```

  <details>
  <summary>
    Don't forget to extend the `ItemProps` type to receive `scrollX` as well so you have everything typed.
  </summary>

```tsx
import { SharedValue } from "react-native-reanimated";

type ItemProps = ListRenderItemInfo<ItemType> & {
  scrollX: SharedValue<number>;
};
```

  </details>

⚠️ TIP: Render `AnimatedText` inside the `Item` component to easily visualize the scrollX value that will change while scrolling.

</details>

## Step 2 – Reanimated component

<details>

<summary>
  <b>[1]</b> Let's modify the scrollX to move by index, instead of the actual scroll offset.
  In this way we are going to get the current active index from the slide / carousel.
  <br/>
  This is helpful because you can visualize the interpolation by index. Each slide from `renderItem` will receive it's index from the entire list, based on which we're going to use the `interpolate` method to style it.
  <br/>
</summary>

```tsx
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

const scrollX = useSharedValue(0);
const onScroll = useAnimatedScrollHandler((e) => {
  scrollX.value = e.contentOffset.x / (layout.itemSize + layout.spacing);
});
```

⚠️ TIP: You already have the item size (width, in our case because we're using a horizontal list) and it's used for snapToInterval.

</details>
<br/>
<details>
<summary>
  <b>[2]</b> Fix the scroll throttling of the scroll and receive the events at 60fps.
</summary>

```tsx
import { Animated } from "react-native-reanimated";

<Animated.FlatList
  scrollEventThrottle={16.67}
  // or
  // scrollEventThrottle={1000 / 60}
/>;
```

<br/>

⚠️ TIP: `16.67` means `60 times per second`, and the equation is `1000 / 60` -> how many frames per second do you want to receive from the scroll event.

</details>

## Step 3 – Animate each `renderItem`

Now that we have access to the scrollX value inside the `renderItem` (for each slide item), we can start applying animations using the `interpolate`.

You might recognize this pattern `[index - 1, index, index + 1]`.

**Current item is moving to the left** -> increasing the index (`index + 1`)

**Current item is moving to the right** -> decreasing the index (`index - 1`)

This is the position of the current slide relative to the entire list of items and the
interval when the item might be visible on the screen. That's why we target it for styling.

If, for example, that there are 5 possible items on the screen and you want to apply a different style to the current item, you would target the `index+-2` as well and, in case you don't target `index+-2`, the interpolation will estimate the value for this range (we call this `Extrapolation.EXTEND`).

`v0 + t * (v1 - v0)` where:

- `v0` - prev value (value at `index -+ 1`)
- `v1` - next value (value at `index -+ 2`)
- `t` - scrollX value

If you are interested in just the current domain, even if the scrollX value or `t` moves
outside of it, you can `Extrapolation.CLAMP` the interpolation and this will stick with the last v0 value
making v1 = v0 so, in other words,

`v0 + t * (v1 - v0) = v0 + t * (v0 - v0) = v0 + 0 = v0`

<details>

<summary>
  <b>[1]</b> Replace the `View` with `Animated.View` as the first
</summary>

```jsx
import Animated from "react-native-reanimated";

export function Item({ item, index, scrollX }: ItemProps) {
  return <Animated.View style={[styles.item]}></Animated.View>;
}
```

</details>
<br/>
<details>

<summary>
  <b>[2]</b> create an animated style that is using `useAnimatedStyle` that will return an empty object for now, and apply this style to the `Animated.View`.
</summary>

```jsx
import Animated from "react-native-reanimated";

export function Item({ item, index, scrollX }: ItemProps) {
  const stylez = useAnimatedStyle(() => {
    return {};
  });
  return <Animated.View style={[styles.item, stylez]}></Animated.View>;
}
```

</details>

<details>

<summary>
  <b>[3]</b> use `interpolate` from `react-native-reanimated` to interpolate the `scrollX` value with the inputRange as `[index-1, index, index+1]`. and apply it to the opacity, for, when current item index is scrollX value it should have `opacity: 1`, otherwise `0.75`.
</summary>

```jsx
import Animated, { interpolate } from "react-native-reanimated";

export function Item({ item, index, scrollX }: ItemProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0.75, 1, 0.75]
      ),
    };
  });
  return <Animated.View style={[styles.item, stylez]}></Animated.View>;
}
```

</details>

<br/>
<details>

<summary>
  <b>[4]</b> apply the same effect, but this time, use `interpolateColor` from `react-native-reanimated` and between `colors.purple`, `colors.overlay`, `colors.green`.
</summary>

```jsx
import Animated, { interpolateColor } from "react-native-reanimated";

export function Item({ item, index, scrollX }: ItemProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        [colors.purple, colors.overlay, colors.green]
      ),
    };
  });

  return <Animated.View style={[styles.item, stylez]}></Animated.View>;
}
```

</details>

<br/>

## Step 4 – More items

To make this step more interactive, you can open `lib/theme` and change the `maxVisibleItems` to any number above 3, let's say 5.

<details>

<summary>
  <b>[1]</b> Add a `transform.scale` to the stylez, having the same inputRange, [index-1, index, index+1] and try to apply the following effect, elements with higher scrollX index should be scaled down, items are greater or equal than the scrollX should remain at scale 1.
</summary>

```jsx
import Animated, {
  interpolate,
  interpolateColor,
} from "react-native-reanimated";

export function Item({ item, index, scrollX }: ItemProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        [colors.purple, colors.overlay, colors.green]
      ),
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [0.9, 1, 1]
          ),
        },
      ],
    };
  });

  return <Animated.View style={[styles.item, stylez]}></Animated.View>;
}
```

</details>
<br/>

## Bonus

This step will extend the `Animated.FlatList` component and it will allow to scroll to an index
