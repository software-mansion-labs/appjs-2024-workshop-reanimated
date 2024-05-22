# Dynamic Tabs

https://user-images.githubusercontent.com/2805320/236649726-82140d72-177f-4895-ac61-6827a13dd8e9.MP4

## Step 1 - Get active tab and animate the indicator

https://user-images.githubusercontent.com/2805320/236649722-47f571e5-45a4-4247-b1b0-8f88be584115.mov

<details>
<summary>
  <b>[1]</b> `measure` each individual tab layout (`width`, `height`, `x` and `y` )
</summary>

<br />
<details>
<summary>
  let’s use `useAnimatedRef()` inside each `Tab` element and pass it to the view
</summary>

```tsx
const tabRef = useAnimatedRef<View>()
<View
 style={styles.tab}
 ref={tabRef}
/>
```

</details>
<br />
<details>
<summary>
  create a method that will use `measure` from reanimated. In order to `measure` a ref, this method should run on `UI Thread` so you need to use `runOnUI` . After you have the measurements, add a callback prop to the `Tab` component and pass the `measurements` as parameter.
</summary>

```tsx
type TabsProps = {
  // other props
  onActive: (measurements: MeasuredDimensions) => void;
};

const sendMeasurements = () => {
  runOnUI(() => {
    "worklet";
    const measurements = measure(tabRef);
    runOnJS(onActive)(measurements);
  })();
};
```

</details>
<br />
<details>
<summary>
  Now, we need to call the method responsible for measuring the tab ref whenever `isActiveTabIndex` props is `true` or when the `Tab` is initially loaded (first mount)
</summary>

```tsx
useEffect(() => {
  // Send measurements when the active tab changes. This callback is necessary
  // because we need the tab measurements in order to animate the indicator
  // and the position of the scroll
  if (isActiveTabIndex) {
    sendMeasurements()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isActiveTabIndex])

<View
  style={styles.tab}
  ref={tabRef}
  onLayout={() => {
    // This is needed because we can't send the initial render measurements
    // without hooking into `onLayout`. When the tab first mounts, we are
    // informing its parent and send the measurements.
    if (isActiveTabIndex) {
      sendMeasurements()
    }
  }}
>

// Inside parent where we display the tab
// add `onActive` prop as such
<Tab
  // the other props
  onActive={(measurements) => {
    // leave it empty for now
  }}
/>
```

</details>
<br />
<details>
<summary>
  After we have the active `Tab` measurements and the `Tab` is prepared to send the measurements whenever its active, we want to store these measurements. Create a `sharedValue` inside the `DynamicTabs` component to store these measurements
</summary>

```tsx
import type { MeasuredDimensions } from "react-native-reanimated";
const tabMeasurements = useSharedValue<MeasuredDimensions | null>(null);
```

</details>
<br />
<details>
<summary>
  Inside the callback prop that we’re passing down to the `Tab` component, change `tabMeasurement.value`  shared value when this callback gets called from the `Tab` component with the new measurements.
</summary>

```tsx
// Where we display the tab add `onActive` prop as such
<Tab
  // the other props
  onActive={(measurements) => {
    tabMeasurements.value = measurements;
  }}
/>
```

</details>
<br />
<details>
<summary>
  Animate `indicator` component based on the tab measurements shared value
</summary>

<br />
<details>
<summary>
  pass `tab` measurement shared value as prop
</summary>

```tsx
<Indicator selectedTabMeasurements={tabMeasurements} />;

function Indicator({
  selectedTabMeasurements,
}: {
  selectedTabMeasurements: SharedValue<MeasuredDimensions | null>;
}) {}
```

</details>
<br />
<details>
<summary>
  use this to animate the indicator using `useAnimatedStyle` for `left` and `width` style properties (Tip: take into account that tab measurements might be missing)
</summary>

```tsx
const stylez = useAnimatedStyle(() => {
  if (!selectedTabMeasurements?.value) {
    return {};
  }

  const { x, width } = selectedTabMeasurements.value;

  return {
    left: withTiming(x),
    width: withTiming(width),
  };
});
```

</details>
</details>
</details>
<br/>

## Step 2 - Scroll to the selected tab (final)

https://user-images.githubusercontent.com/2805320/236649724-28ffb34e-f967-4591-9a42-13d9d1d20cf1.MP4

Scrolling the `ScrollView` when a tab is active. (hint: we get this via the `Tab` callback that you’ve just created.

<details>
<summary>
  Use `useAnimatedRef` to create the `ScrollView` ref and pass it to the `ScrollView` component
</summary>
<br />

```tsx
const scrollViewRef = useAnimatedRef<ScrollView>()

<ScrollView
  ref={scrollViewRef}
  // other props
/>
```

</details>
<br/>

<details>
<summary>
  Create a method responsible for scrolling inside the `ScrollView` that will receive the `index: number` as argument (the active tab index). You should use the power of `scrollTo` from reanimated along with `measure` method to get calculate the offset of the `ScrollView` , and position the active tab in the middle
  <br />
  <i>⚠️ Hint: It’s not enough to know the tab position you need to take into account the `ScrollView` dimension to properly</i>
  <br />
  <i>⚠ Hint2: As mentioned above, `measure` should happen on `UI thread`</i>
</summary>
<br />

```tsx
const scrollToTab = (index: number) => {
  runOnUI(() => {
    "worklet";

    const scrollViewDimensions: MeasuredDimensions = measure(scrollViewRef);

    if (!scrollViewDimensions || !tabMeasurements.value) {
      return;
    }

    scrollTo(
      scrollViewRef,
      tabMeasurements.value.x -
        // this is how to place the item in the middle
        (scrollViewDimensions.width - tabMeasurements.value.width) / 2,
      0,
      true
    );
  })();
};
```

</details>
<br/>
<details>
<summary>
  After scrolling, ensure that you’re calling `onChangeTab` callback that’s received as prop inside this component and so, any components that’s going to render this `DynamicTabs` component will be aware of any tab changes and can act accordingly.
</summary>
<br />

```tsx
// call onChangeTab after `scrollTo` is called.
if (onChangeTab) {
  runOnJS(onChangeTab)(index);
}
```

</details>
<br/>
<details>
<summary>
  finally, call this method when the tab change and pass the tab index as argument
</summary>
<br />

```tsx
onActive={(measurements) => {
  tabMeasurements.value = measurements
  scrollToTab(index) // <--- add this
}}
```

</details>
<br/>

## [Bonus] Step 3 - Hook it to a FlatList and create the bi-directional scrolling

The bonus and a real life usecase.

https://user-images.githubusercontent.com/2805320/236649726-82140d72-177f-4895-ac61-6827a13dd8e9.MP4

You need to connect this component with a `FlatList` . You’ll have both `DynamicTabs` and `FlatList` as siblings. When a tab is changed inside `DynamicTabs` you must scroll inside `FlatList` and viceversa, when `FlatList` slide has changed, pass the new index down to `DynamicTabs` (copy `bonus_boilerplate.tsx` inside your `DynamicTabs.tsx` or create your own component). Let’s move one with the `DynamicTabs` + `FlatList` approach.

<details>
<summary>
  store the `selectedTabIndex` as state and pass this state to `DynamicTab` component
</summary>

```tsx
const [selectedTabIndex, setSelectedTabIndex] = useState(0)
<DynamicTabs
  selectedTabIndex={selectedTabIndex}
/>
```

</details>
<br />

<details>
<summary>
change `selectedTabIndex` whenever the slide inside the `FlatList` has changed (hint: `onMomentumScrollEnd`)
</summary>

```tsx
<FlatList
  // other props
  onMomentumScrollEnd={(ev) => {
    setSelectedTabIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
  }}
/>
```

</details>
<br />

Now, this is solving one direction `FlatList -> DynamicTab`. Let’s solve the other way around `DynamicTab -> FlatList`. Remember that we have this callback `onChangeTab` that’s going to receive the `pressed/active` tab index? Well, let’s use it :)

<br />
<details>
<summary>
create a `ref` for the `FlatList` and use the `imperative` method of the ref: `scrollToIndex`
</summary>

```tsx
const ref = useRef<FlatList>(null);

<FlatList
  ref={ref}
  // other props
>

<DynamicTabs
  // other props
  onChangeTab={(index) => {
    ref.current?.scrollToIndex({
      index,
      animated: true,
    })
  }}
/>
```

</details>
<br />
<details>
<summary>
⚠️ Hint: It might be possible that either `react-native` to complain or if the list is too large and the index that you want to scroll to it’s outside the render window, this might not work, so you need to “help” `FlatList` by providing the `itemLayout` (this will boost the list performance + ensures that scroll to index its working properly)
</summary>

```tsx
const { width } = useWindowDimensions()

<FlatList
  // other props
  getItemLayout={(_, index) => ({
    length: width,
    offset: width * index,
    index,
  })}
/>
```

</details>
<br />

## Next step

**Go to: [Scroll Animation](../ScrollAnimation/)**
