# ![adonis icon](https://user-images.githubusercontent.com/25934051/82269493-44409680-9948-11ea-864f-26443e69da41.png) AdonisJS Blog made with Typescript

This is an example of an web application made with [AdonisJS](https://adonisjs.com/) in Typescript.
It is used [version 5](https://preview.adonisjs.com/) of the framework.

Based on [Adonis Blog Demo](https://github.com/AdonisCommunity/adonis-blog-demo) made in Javascript

![home preview](https://user-images.githubusercontent.com/25934051/82270824-689e7200-994c-11ea-9109-f54da384cfe8.png)

It is configured with:

- [SQLite](https://www.sqlite.org/index.html) (for development and tests)
- [AdonisJS Shield](https://preview.adonisjs.com/releases/shield/version-2) to protect from protects against common web attacks
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) as code formatters
- [Youch!](https://github.com/poppinss/youch) as web pretty error reporting (for development)

## 📝 Prerequisite

- [NodeJs](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

## 🏁 Getting Started

Run in bash:

```bash
# Install dependencies
yarn install

# Starts and keeps running Adonis Server
yarn start
```

Open another terminal on same folder an run

```bash
yarn run_migrations
```

## 🔧 Running the tests

Run in bash:

```bash
yarn test
```

### 🎈 Running coding style tests

Run in bash:

```bash
# Find coding style errors and report
yarn lint

# or

# Find coding style errors; try to fix, otherwise, report
yarn lint:fix
```

### ⛓️ Environment variables

In file `.env` is all the needed environment variables of project. Is recommended to store in it only values used on development or testing.

To production publishing, is recommended to ignore it and use another way to load environment variables outside project directory or use [AdonisJs default convention](https://adonisjs.com/docs/4.0/configuration-and-env#_environment_variables)
