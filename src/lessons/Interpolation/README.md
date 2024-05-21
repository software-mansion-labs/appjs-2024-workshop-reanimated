# Interpolations

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/2805320/2d4ab5c7-3e0e-4657-8d23-4a1708ae11ca

## Step 1 – Scroll events

In this lesson we are going to change listen to `onScroll` events on a FlatList.

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/2805320/eb480717-8743-4229-8625-3380728e803b

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

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/2805320/d911f14f-5283-49ce-a841-92b4a988eaeb

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

## Step 3 – Animate `renderItem` with interpolate

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

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/2805320/c71cad48-4ebf-41a4-8fdb-3ba7ab8a1541

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

## Step 4 – Manual clamp of animation

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/2805320/81e02e06-b34b-4fee-b6fa-c9e775b5f09a

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

<details>

<summary>
  <b>[bonus]</b> add support for `initialScrollIndex` to the `Animated.FlatList`
</summary>

```jsx
import Animated from "react-native-reanimated";

<Animated.FlatList
  initialScrollIndex={1}
  getItemLayout={(_, index) => ({
    length: layout.itemSize + layout.spacing,
    offset: (layout.itemSize + layout.spacing) * index,
    index,
  })}
```

</details>
<br/>

## [Bonus] Sensors and parallax effect

https://github.com/software-mansion-labs/appjs-2024-workshop-reanimated/assets/2805320/f3ad201f-9115-4f4f-aaed-16a57b87d6c7

Here's the step where you'll test your creativity. In this bonus point you need to use the `useAnimatedSensor` with `SensorType.ROTATION` to apply to the active item from the list a movement based on the phone rotation `roll` and `pitch`.

We are going to extend the `FlatList` CellRendererComponent, in this way, we can change the zIndex for every item and leave the `renderItem` as clean as possible and the rotation is going to happen on the parent level.

<details>

<summary>
  <b>[1]</b> copy `/steps/bonus_boilerplate.tsx` to `Interpolation.tsx`
</summary>
</details>
<br/>
<details>

<summary>
  <b>[2]</b> get the `ROTATION` sensor from `useAnimatedSensor` from `react-native-reanimated` and assign it to the `sensor` constant.
</summary>

```jsx
import { useAnimatedSensor, SensorType } from "react-native-reanimated";

const sensor = useAnimatedSensor(SensorType.ROTATION, {
  interval: 20,
});
```

</details>
<br/>
<details>

<summary>
  <b>[3]</b> Now, `CellRenderItem` will receive the sensor and we can start animating the `View`. We are interested in `roll` and `pitch`. `Roll` for rotateX and `Pitch` for `rotateY`. Create a `rotateX` and `rotateY` derived values that will return `roll` and `pitch` values and clamp the values between `-Math.PI / 6` and `Math.PI / 6` as a `withSpring`.
</summary>

```jsx
const rotateX = useDerivedValue(() => {
  const { roll } = sensor.sensor.value;
  const angle = clamp(roll, -Math.PI / 6, Math.PI / 6);
  return withSpring(-angle, { damping: 300 });
});
const rotateY = useDerivedValue(() => {
  const { pitch } = sensor.sensor.value;
  // const angle = clamp(pitch, -Math.PI / 6, Math.PI / 6);
  // Compensate the "default" angle that a user might hold the phone at :)
  // 40 degrees to radians
  const angle = clamp(pitch, -Math.PI / 4, Math.PI) - 40 * (Math.PI / 180);
  return withSpring(-angle, { damping: 300 });
});
```

</details>
<br />
<details>

<summary>
  <b>[4]</b> Apply `rotateX` and `rotateY` to the `<Animated.View />`.
  ⚠️ TIP: To apply the animation only to the current selected/active item, you can use `interpolate` with `index-1, index, index+1` and add the `rotateX/Y` only for `index` `outputRange`.
</summary>

```jsx
const stylez = useAnimatedStyle(() => {
  return {
    // ...
    transform: [
      {
        perspective: layout.itemSize * 4,
      },
      {
        rotateY: `${interpolate(
          scrollX.value,
          [index - 1, index, index + 1],
          [0, rotateX.value, 0],
          Extrapolation.CLAMP
        )}rad`,
      },
      {
        rotateX: `${interpolate(
          scrollX.value,
          [index - 1, index, index + 1],
          [0, rotateY.value, 0],
          Extrapolation.CLAMP
        )}rad`,
      },
    ],
  };
});
```

</details>
<br />
<details>

<summary>
  <b>[5]</b> use `rotateX` and `rotateY` to create other derived values, that will apply a `translateX` and `translateY` to the element as well. You can return another spring animation for these new derived values as well.
</summary>

```jsx
const translateX = useDerivedValue(() => {
  return withSpring(-rotateX.value * 100, { damping: 300 });
});
const translateY = useDerivedValue(() => {
  return withSpring(rotateY.value * 100, { damping: 300 });
});

const stylez = useAnimatedStyle(() => {
  return {
    // ...
    transform: [
      {
        perspective: layout.itemSize * 4,
      },
      // ...rotateX, rotateY
      {
        translateY: interpolate(
          scrollX.value,
          [index - 1, index, index + 1],
          [0, translateY.value, 0],
          Extrapolation.CLAMP
        ),
      },
      {
        translateX: interpolate(
          scrollX.value,
          [index - 1, index, index + 1],
          [0, translateX.value, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  };
});
```

</details>
<br />
