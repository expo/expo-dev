# expo-dev

The purpose of this repository is to make it easier for people to
contribute to Expo.

A small, work in progress, test suite is available in apps/test-suite.
It is configured to use the local copy of expo-sdk in
libraries/expo-sdk.

An empty project in apps/playground is configured in the same way and is
a place for you to experiment with the ipi that you're working on.

## Set up

0. First, make sure you have Node >= v7.9.0 installed.
1. Clone this repository `git clone git@github.com:expo/expo-dev.git`
2. `cd expo-dev` and `git submodule init` and `git submodule update`
3. `npm install -g hyperinstall`
4. Run `./tools/setup` -- this will get the latest version of each
package, then build and link xdl and start the packager for Expo home.
5. Follow [these steps to run the Expo client on
Android](https://github.com/expo/expo#android) or [these
steps](https://github.com/expo/expo#ios) to run it on iOS.
6. Once you have the iOS or Android client running, cd into `apps/test-suite/__develop__` and run `exp start`
7. Open the test-suite app using the client that you built.

**Note: for CI reasons you need to use the `__develop__` directory with
test-suite. `apps/playground` doesn't have a `__develop__` directory,
run `exp start` in the project root instead.**

## Pulling the latest versions of each repo

- Check out the master branch in each submodule and have a clean index,
then run `git submodule foreach "git pull"`
- Commit the new submodule commit refs. ([example commit](https://github.com/expo/expo-dev/commit/e69d197f))

## Uing our eslint setup

We use prettier with eslint to keep code formatted nicely. The .eslintrc
in root is the one we use for every project -- I use Visual Studio Code
with the `dbaeumer.vscode-eslint` plugin and configure it to point to
my .eslintrc with:

```
{
  "eslint.options": {
    "configFile": "/Users/brent/expo-dev/.eslintrc"
  }
}
```

It's up to you whether you want to format on save or not, but please
format JS changes before submitting a PR.

## Workflow for writing native APIs

Be sure to have followed the set up steps above before continuing here.

1. Pull the latest version of each submodule `git submodule update
--init --recursive --remote` -- you may need to go into a few
--directories and clear the index. Run `./tools/npm-hyperinstall` again.
2. Get the client running for the platform that you want to work on.
3. Make native changes in the
[ios/Exponent/Versioned](https://github.com/expo/expo/tree/master/ios/Exponent/Versioned)
directory for iOS and
[android/expoview/src/main/java/versioned](https://github.com/expo/expo/tree/master/android/expoview/src/main/java/versioned)
directory for Android.
4. Re-build the app and open up playground or test-suite.
5. Make the changes in `libraries/expo-sdk` to use the native APIs that
you exposed before.
