# Kartka

### Installation

```
yarn install // or npm install
```

### Scripts

`yarn run dev`

- run the app in development mode, app will be reloaded on file changes

`yarn run start`

- start the app in non-reloadable mode

`yarn run build`

- build the app

`yarn run lint`

- check typescript errors via TSLint

`yarn run lint:fix`

- check and fix typescript errors via TSLint

`yarn run format`

- check for formatting errors via Prettier

`yarn run format:fix`

- fix formatting errors via Prettier

`yarn run format:lint:fix`

- check and fix typescript errors via TSLint and correct formatting errors via Prettier

### Production deployment example

Clone the repo on any unix (cloud) server. Make a build of the app:

```
yarn run build
```

Install [pm2](https://github.com/Unitech/pm2) process manager:

```
yarn global add pm2
```

Start the app:

```
pm2 start pm2-process.json
```

App will be started in daemon mode (background). To check the logs of the app issue following command:

```
pm2 logs nameOfTheAppFromPm2
```

You can find the name of the app in `pm2-process.json` file.

<br />
<br />

