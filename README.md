# The Reanimated Workshop – App.js Conference 2024

## Hosted by

- Catalin Miron ([@mironcatalin](https://c.com/mironcatalin))
- Kacper Kapuściak ([@kzzzf](https://c.com/kacperkapusciak))

## Setup

During this workshop we will work with an Expo / React Native app published in this repo.
In order to make setup more seamless we have prepared a so-called Expo's development client builds that include all the native code for all the dependencies that are used as a part of the workshop.

You should be able to use iOS simulator, Android emulator, or any modern Android or iOS phone to perform the exercises, however, we recommend that you stick to one choice to avoid additional setup steps you may need to do in the future.
If you choose to work with an emulator (either iOS or Android) make sure that you have that emulator installed and configured as setting it up is outside of this setup scope.

## Before you begin

use the below command to install [Expo CLI](https://docs.expo.dev/workflow/expo-cli/):

```bash
npm install -g expo-cli
```

Or make sure it is up to date if you have it installed already:

```bash
expo --version
```

## Preparing device

To set up a local development environment for running your project on Android and iOS, follow [this guide](https://docs.expo.dev/get-started/set-up-your-environment/)

## Running the app

After completing Preparing device installation step, you now should be able to clone this repo and launch the app.
Follow the below steps from the terminal:

1. Clone the repo:

```bash
git clone git@github.com:software-mansion-labs/appjs-2024-workshop-reanimated.git && cd appjs-2024-workshop-reanimated
```

2. Install project dependencies (run the below command from the project main directory):

```bash
bun install
```

3. Launch the app with Expo CLI:

```bash
bun start
```

4. The above step will print instructions on how to launch the app on phone or simulator. For iOS simulator you'll need to press "i", for Android press "a", and if you'd like to run the app on a physical device you'll need to scan the QR code that will be displayed on the command line output.

## Next step

**Go to: [Circle Gestures](./src/lessons/CircleGestures/)**
