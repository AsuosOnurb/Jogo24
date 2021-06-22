


# Setup and Usage

## Requirements:
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/)


## Usage:

```bash
# Go into the repository folder
$ cd repoFolder

# Install dependencies
$ npm install

# Start the local development server (on port 8080)
# This will (at least it should) open a browser tab to test the game.
$ npm start

# Ready for production?
# Build the production ready code to the /dist folder
$ npm run build

# Play the production ready game in the browser
$ npm run serve
```

Change the **gameName** in /webpack/webpack.common.js.

All of the game code lies inside the **/src/scripts** folder. All assets need to be inside the **/src/assets** folder in order to get copied to **/dist** while creating the production build. 

# Documentation
Docs are generated using the [TypeDoc](https://typedoc.org/) npm package.

To install it (globally) execute:

```bash
$ npm install typedoc --save-dev
```

Then the docs can be rendered into .html files using:

```bash
$ npx typedoc --tsconfig .\tsconfig.json
```
This command will use the TypeDoc options defined in the `tsconfig.json` .
