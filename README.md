# The Reanimated Workshop – App.js Conference 2024

## Hosted by

- Catalin Miron ([@mironcatalin](https://x.com/mironcatalin))
- Kacper Kapuściak ([@kacperkapusciak](https://x.com/kacperkapusciak))

## Setup

During this workshop we will work with an [Expo Go](https://expo.dev/go) app. Expo Go is a React Native sandbox with all the native dependencies we need for this workshop, integrated into a handy app.

You can download Expo Go to your [Android phone from the Google Play store](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www) or [iOS phone from the App Store](https://apps.apple.com/us/app/expo-go/id982107779). 

You can use an iOS simulator, Android emulator, or any modern Android or iOS phone to perform the exercises, however, we recommend that you stick to one choice to avoid additional setup steps you may need to do in the future.

If you choose to work with an emulator (either iOS or Android) make sure that you have that emulator installed and configured as setting it up is outside of this setup scope.

When you first open a project the Expo Go app will be automatically installed on the simulator/emulator.

## Preparing device

To set up a local development environment for running your project on Android and iOS, follow [this guide](https://docs.expo.dev/get-started/set-up-your-environment/).

## Running the app

After completing _Preparing device_ installation step, you now should be able to clone this repo and launch the app.
Follow the below steps from the terminal:

1. Clone the repo:

```bash
git clone git@github.com:software-mansion-labs/appjs-2024-workshop-reanimated.git && cd appjs-2024-workshop-reanimated
```

2. Install project dependencies (run the below command from the project main directory):

```bash
npm install
```

3. Launch the app with Expo CLI:

```bash
npx expo start
```

4. The above step will print instructions on how to launch the app on phone or simulator. For iOS simulator you'll need to press `"i"`, for Android press `"a"`, and if you'd like to run the app on a physical device you'll need to scan the QR code that will be displayed on the command line output.

## Next step

**Go to: [Circle Gestures](./src/lessons/CircleGestures/)**
