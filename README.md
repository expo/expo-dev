# expo-dev

The purpose of this repository is to make it easier for people to
contribute to Expo.

A small, work in progress, test suite is available in apps/test-suite.
It is configured to use the local copy of expo-sdk in
libraries/expo-sdk.

An empty project in apps/playground is configured in the same way and is
a place for you to experiment with the ipi that you're working on.

### Please use npm rather than yarn here

On our internal monorepo we have a yarn cache, and yarn.lock for these
projects will point to that internal cache and `yarn` won't work for
you on these projects without it.

## Set up

1. Clone this repository
2. Run `git submodule update --init --recursive --remote` -- this will
get the latest version of each package.
3. `npm install -g hyperinstall`
4. Run `./tools/npm-hyperinstall`
5. Follow [these instructions to get the Expo client running](https://github.com/expo/expo#set-up)
6. Once you have the iOS or Android client running, cd into `apps/test-suite/__develop__` and run `exp start`
7. Open the test-suite app using the client that you built.

**Note: for CI reasons you need to use the `__develop__` directory with
test-suite. `apps/playground` doesn't have a `__develop__` directory,
run `exp start` in the project root instead.**

## Workflow for writing native APIs

Be sure to have followed the set up steps above before continuing here.

1. Get the client running for the platform that you want to work on.
2. Make native changes in the
[ios/Exponent/Versioned](https://github.com/expo/expo/tree/master/ios/Exponent/Versioned)
directory for iOS and
[android/expoview/src/main/java/versioned](https://github.com/expo/expo/tree/master/android/expoview/src/main/java/versioned)
directory for Android.
3. Re-build the app and open up playground or test-suite.
4. Make the changes in `libraries/expo-sdk` to use the native APIs that
you exposed before.
