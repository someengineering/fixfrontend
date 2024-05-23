# Fix Frontend

The frontend for the Fix service.

## Installation

This project requires [NodeJS](https://nodejs.org) version 18 (>= v18.17.1) and [Yarn](https://yarnpkg.com) version 1 (>= v1.22.19) to run.

- **NodeJS:** [Download here](https://nodejs.org/dist/v18.17.1)
- **Yarn:** Run `npm i -g yarn` after installing NodeJS. More info in the [Yarn documentation](https://classic.yarnpkg.com/en/docs/getting-started)

## Environment variables

| Variable                            | Type      | Description                                                                                                               | Default value                           |
| ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `VITE_FIX_LANDING_PAGE_URL`         | `string`  | URL of main landing page                                                                                                  | `location.origin`                       |
| `VITE_SERVER`                       | `string`  | Server address for API calls (ignored in test environments or when `VITE_USE_PROXY=true`)                                 | `location.origin`                       |
| `VITE_WS_SERVER`                    | `string`  | WS server address for events (ignored in test environments or when `VITE_USE_PROXY=true`)                                 | `location.origin.replace('http', 'ws')` |
| `VITE_VIDEOS_ASSETS_URL`            | `string`  | URL to CDN containing video assets                                                                                        | `location.origin`                       |
| `VITE_USE_PROXY`                    | `boolean` | Whether or not Vite should use a proxy for API calls                                                                      | `false`                                 |
| `VITE_NETWORK_RETRY_COUNT`          | `number`  | Number of retries for 5xx failed API requests                                                                             | `5`                                     |
| `VITE_WEBSOCKET_RETRY_TIMEOUT`      | `number`  | Time in milliseconds to wait before retrying 5xx failed API requests                                                      | `5000`                                  |
| `HOST`                              | `string`  | Host on which Vite should create the server                                                                               | `localhost`                             |
| `PORT`                              | `number`  | Port on which Vite should run the local server                                                                            | `5173`                                  |
| `VITE_USE_MOCK`                     | `boolean` | Whether or not to use the mock server                                                                                     | `false`                                 |
| `VITE_DISCORD_URL`                  | `string`  | Discord server URL                                                                                                        | `#`                                     |
| `VITE_TRACKJS_TOKEN`                | `string`  | TrackJS token (if undefined, TrackJS won't be installed)                                                                  | `undefined`                             |
| `VITE_MUI_LICENSE_KEY`              | `string`  | MUI premium license key (if undefined, MUI license won't be installed)                                                    | `undefined`                             |
| `VITE_LOAD_PAGE_TIMEOUT`            | `number`  | Loading page timeout in milliseconds                                                                                      | `30000`                                 |
| `VITE_POSTHOG_DEV_PROJECT_API_KEY`  | `string`  | Development/testing PostHog project API key (if undefined, PostHog won't be initialized in test/development environments) | `undefined`                             |
| `VITE_POSTHOG_PROD_PROJECT_API_KEY` | `string`  | Production PostHog project API key (if undefined, PostHog won't be initialized in production environments)                | `undefined`                             |
| `VITE_POSTHOG_API_HOST`             | `string`  | URL of PostHog instance                                                                                                   | `https://eu.posthog.com`                |
| `VITE_POSTHOG_UI_HOST`              | `string`  | PostHog app URL (required if using a reverse proxy for `VITE_POSTHOG_API_HOST`)                                           | `undefined`                             |

## Scripts

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
