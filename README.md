# UoA-Discords/Website

Frontend website for the UoA Discords project.

[![CodeQL](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml)
[![Deploy](https://github.com/UoA-Discords/website/actions/workflows/deploy.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/deploy.yml)
[![Node.js CI](https://github.com/UoA-Discords/website/actions/workflows/node.js.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/node.js.yml)
</br></br>
## Installation

Make sure you have the following dependencies installed:

-   [NodeJS](https://nodejs.org/), any version >= 16 should work. Lower versions have not been tested.

-   [yarn](https://yarnpkg.com/) (can be installed using `npm i -g yarn`), not strictly required but strongly recommended.

-   [git](https://git-scm.com/), should be installed already (via NodeJS).

Open Command Prompt, and type `cd ` (with a space) and drag the folder you want the website to download to onto the window. Hit enter. **Now you can run the following code-block in a terminal:**

```sh
git clone https://github.com/UoA-Discords/website.git uoa-discords-website # download the website files
cd uoa-discords-website # set your terminal to the website files
git submodule init
git submodule update
yarn install # or npm install
yarn build # or npm install
yarn start # or npm install
```

By default your client will think the API is located at http://localhost:3001, you can override this by navigating to the settings page (http://localhost:3000/settings). For instance, if you don't want to set up the backend you can make the redirect to https://bpi.uoa-discords.com. This settings page also allows you to change other things like Discord client ID, redirect URI, etc...
</br></br>
## Script Reference

-   `yarn start` Starts the application with hot-reloading enabled.
-   `yarn build` Creates a production-ready build in the **build/** directory.
-   `yarn test` Runs Jest testing on the application.
-   `yarn lint` Runs eslint and Prettier linting rules on the source files.
-   `yarn typecheck` Runs TSC typechecking on the source files.
-   `yarn check-all` Runs linting, typechecking, and testing.
</br></br>
## General commands
To be done after the inital installation
- Download any new changes from the GitHub:
    ```sh
    cd uoa-discords-website
    git pull
    ```
- Run the website:
    ```sh
    cd uoa-discords-website
    yarn start
    ```
- Push to the GitHub:
    ```sh
    cd uoa-discords-website
    git checkout -b [BranchName] # Create a new branchName
    git add .
    git commit -m "Change summary here"
    git push origin [BranchName] # Same as you made
    ```
    - Then visit the [GitHub](https://github.com/UoA-Discords/website), and click "create pull request". Fill out your changes, and submit it to be verified by other team members :D

