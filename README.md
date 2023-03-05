# UoA Discords / Website <!-- omit in toc -->

[![CI](https://github.com/UoA-Discords/website/actions/workflows/node.js.ci.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/node.js.ci.yml)
[![CodeQL](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/UoA-Discords/website/actions/workflows/codeql-analysis.yml)

Main organization and server registry website.

This is our main website, which interfaces our UoA Discord server registry (see our [server registry API](https://github.com/UoA-Discords/server-registry-api)) and contains information about our organization and other projects.

We are not affiliated with the University of Auckland in any official capacity.

The production version of this website is hosted at https://uoa-discords.com.

## Table of Contents <!-- omit in toc -->

- [Technologies](#technologies)
- [Installation](#installation)
- [Documentation](#documentation)
  - [Script Reference](#script-reference)
  - [Dependency Reference](#dependency-reference)
  - [Configuring the App](#configuring-the-app)
- [Contributing](#contributing)
- [Licensing](#licensing)



### Technologies

<div style="display: flex">

  <a href="https://nodejs.org/">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  </a>

  <a href="https://www.typescriptlang.org/">
  <img alt="Typescript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  </a>

  <a href="https://reactjs.org/">
  <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
  </a>

</div>

### Installation

Dependencies:

-   [Node JS](https://nodejs.org/) v16 or higher. Non-LTS and versions below 16 will probably work, but haven't been tested.
-   [pnpm](https://pnpm.io/), recommended but npm and yarn should still work fine.

You can easily get pnpm using:

```sh
npm i -g pnpm
```

Next you can set up the repository from a terminal:

```sh
git clone https://github.com/UoA-Discords/website.git website
cd website
pnpm install
```

All done! You can now run scripts using `pnpm <script name>`, e.g. `pnpm start`. See the [script reference](#script-reference) below to get started.

### Documentation

#### Script Reference

-   `start` Starts a development version of the website with hot-reloading enabled.
-   `build` Creates a production-ready version of the website to statically host.
-   `lint` Makes sure code follows style rules.
-   `typecheck` Makes sure there are no type errors in the code.
-   `check-all` Does linting and typechecking, note that this requires pnpm.

#### Dependency Reference

-   `axios` Helps with making web requests to our API.

#### Configuring the App

If you want to edit some properties of the website, such as the API URL it makes requests to (e.g. if you're running a local version of our server registry API), you can do so by going to the [/settings](http://localhost:3000/settings) page.

### Contributing

Contributions are always welcome, check out [CONTRIBUTING.md](./.github/CONTRIBUTING.md) to get started.

### Licensing

This API is licensed under the [MIT license](./LICENSE).
