<p align="center">
  <img src="assets/screenshots/logo.png" alt="main logo">
</p>

# Gather the magic App

Welcome everyone to Gather the Magic!

This simple app uses the magnificent Magic the Gathering API: https://api.magicthegathering.io/ to list
all the game cards.

## But... what does it actually do?

* If no option is selected, it will fetch all the game cards that contain a multiverseId (all that are present at http://gatherer.wizards.com/) ordered alphabetically,
* You can filter cards by name using the top search bar.
* Also, by clicking on the filter icon you can filter the cards by color (do not mistake with the mana cost colors).
* ... aaaand if you click an item from the list, a full screen preview of the card will be shown.

| Default card list | Filter cards by colors | Filter cards by name | Card preview on click |
|     :---:      |     :---:      |     :---:      |     :---:      |
| ![Default cards list](assets/screenshots/sc-list-default.jpg?raw=true "Default card list")    | ![Filter cards by color](assets/screenshots/sc-filter-colors.jpg?raw=true "Filter cards by color")  | ![Filter cards by name](assets/screenshots/sc-filter-name.jpg?raw=true "Filter cards by name")  | ![Card preview](assets/screenshots/sc-card-preview.jpg?raw=true "Card preview on click") |

```
Isn't this just PURE MAGIC?
```

NOTE: In order to make the experience smooth, this app stores every server request so that subsecuent queries will fetch the data from the store instead of
making another async request to the API. Thus rendering the content much faster. This storage is reset everytime the app is open.


## Run the app from expo server

### Prerequisites

Install expo client app for Android or iOs. Follow the instructions at: https://docs.expo.io/versions/v35.0.0/get-started/installation/

### Instructions

Once you have installed the expo client app, go to https://expo.io/@seviferr/gatherthemagic and scan the QR code.

* on Android: from expo client app / scan QR code
* on iOS: scan directly from the camera app


## Run the app locally with expo development local server

### Prerequisites

You must install yarn and expo-cli globally

```
npm install -g yarn
npm install -g expo-cli
```
NOTE: You may need to sudo the global installs

And install expo client app for Android or iOs. Follow the instructions at: https://docs.expo.io/versions/v35.0.0/get-started/installation/

### Instructions

Get into the project directory an run:

```
yarn install
```

Wait untill all modules are installed and then start the expo local development server:


```
yarn start
```
or

```
expo start
```

To run the app we don’t need to build any native code because it runs in the Expo client, and the CLI will automatically install it for us in the iOS simulator or on any connected Android emulator or device. You can also download it from the App Store and Play Store.

For more details on how to use expo client check the docs: https://docs.expo.io/versions/latest/
