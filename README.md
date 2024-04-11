# fixfrontend

The frontend for the FIX service

## Installation

This project needs [NodeJS](https://nodejs.org/en) version 18 (at least 18.17.1) and [Yarn](https://yarnpkg.com/) version 1 (at least 1.22.19) to run.

- Download Recommended [NodeJS](https://nodejs.org/dist/v18.17.1/)
- To install Yarn simply first install nodejs and then run `npm i -g yarn`. More info on the [Yarn's Documentation](https://classic.yarnpkg.com/en/docs/getting-started)

## Environment variables

- `VITE_FIX_LANDING_PAGE_URL: string` - URL to main landing page (Default: `location.origin`)
- `VITE_SERVER: string` - Server address that should call the API (Default: `location.origin`, ignore on test env or `VITE_USE_PROXY=true`)
- `VITE_WS_SERVER: string` - WS server address for events (Default: `location.origin.replace('http', 'ws')`, ignore on test env or `VITE_USE_PROXY=true`)
- `VITE_VIDEOS_ASSETS_URL: string` - URL to cdn that contains video assets (Default: `location.origin`)
- `VITE_USE_PROXY: boolean` - Whether or not should vite use proxy to connect to api (Default: `false`)
- `VITE_NETWORK_RETRY_COUNT: number` - Number of retry in case of 5xx error until give up the API call (Default: `5`)
- `VITE_WEBSOCKET_RETRY_TIMEOUT: number` - How many milliseconds before retrying request that failed with 5xx error on API call (Default: `5000`)
- `HOST: string` - on which host vite should create the server Eg. 127.0.0.1 or localhost (Default: `localhost`)
- `PORT: number` - on which port vite should run the local server Eg. 80 or 8081 (Default: `5173`)
- `VITE_USE_MOCK: boolean` - Whether or not runs the mock server instead of getting data from real server (Default: `false`)
- `VITE_DISCORD_URL: string` - Discord URL (Default: `#`)
- `VITE_GTM_DEV_ID: string` - Google Analytics token for development (Default: `undefined`, if empty it won't install GTM)
- `VITE_GTM_PROD_ID: string` - Google Analytics token for production (Default: `undefined`, if empty it won't install GTM)
- `VITE_TRACKJS_TOKEN: string` - TrackJS token (Default: `undefined`, if empty it won't install TrackJS)
- `VITE_MUI_LICENSE_KEY: string` - MUI premium license key (Default: `undefined`, if empty it won't install the license for MUI)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:8081](http://localhost:8081) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [Getting Started in Vitest](https://vitest.dev/guide/) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://vitejs.dev/guide/cli.html#build) for more information.
