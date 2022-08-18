# UoA-Discords/Website

Frontend website for the UoA Discords project.

[![CodeQL](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml)
[![Deploy](https://github.com/UoA-Discords/website/actions/workflows/deploy.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/deploy.yml)
[![Node.js CI](https://github.com/UoA-Discords/website/actions/workflows/node.js.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/node.js.yml)

## Installation

1. Make sure you have NodeJS
    ```sh
    node -v
    ```
    Get it [here](https://nodejs.org/).
1. Install dependencies using [yarn](https://yarnpkg.com/) or npm

    ```sh
    yarn
    ```

    ```sh
    npm install
    ```

1. Start the API in development mode using the **start** script

    ```sh
    yarn start
    ```

    ```sh
    npm run start
    ```

1. Make a production build using the **build** script

    ```sh
    yarn build
    ```

    ```sh
    npm run build
    ```

    - You should now have static HTML, JS, and CSS files ready to be served from the **build** folder.
