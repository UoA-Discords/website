# UoA-Discords/Website

Frontend website for the UoA Discords project.

[![CodeQL](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml)
[![Deploy](https://github.com/UoA-Discords/website/actions/workflows/deploy.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/deploy.yml)
[![Node.js CI](https://github.com/UoA-Discords/website/actions/workflows/node.js.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/node.js.yml)

## Installation

Make sure you have the following dependencies installed:

-   [NodeJS](https://nodejs.org/), any version >= 16 should work. Lower versions have not been tested.

-   [yarn](https://yarnpkg.com/) (can be installed using `npm i -g yarn`), not strictly required but strongly recommended.

-   [git](https://git-scm.com/), should be installed already (via NodeJS).

Now you can run the following in a terminal:

```sh
git clone https://github.com/UoA-Discords/website.git uoa-discords-website
cd uoa-discords-website
git submodule init
git submodule update
yarn install # or npm install
yarn build # or npm run build
yarn start # or npm run start
```

## Script Reference

-   `yarn start` Starts the application with hot-reloading enabled.
-   `yarn build` Creates a production-ready build in the **build/** directory.
-   `yarn test` Runs Jest testing on the application.
-   `yarn lint` Runs eslint and Prettier linting rules on the source files.
-   `yarn typecheck` Runs TSC typechecking on the source files.
-   `yarn check-all` Runs linting, typechecking, and testing.
