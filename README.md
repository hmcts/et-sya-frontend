# et-sya

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v18.6.0 or later
- [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com)

### Running the application

Install dependencies by executing the following command:

```bash
$ yarn install
```

Bundle:

```bash
$ yarn webpack
```

Run:

```bash
$ yarn start
```

Run Dev Mode:

```bash
$ yarn start:dev
```

Run Dev Mode With Redis server:

```bash
$ yarn start:dev-red
```

The applications's home page will be available at https://localhost:3001

### Running with Docker

Create docker image:

```bash
  docker-compose build
```

Run the application by executing the following command:

```bash
  docker-compose up
```

This will start the frontend container exposing the application's port
(set to `3001` in this template app).

In order to test if the application is up, you can visit https://localhost:3001 in your browser.
You should get a very basic home page (no styles, etc.).

### Running with CFTLIB

As CFTLIB may have different ports for IDAM API we need to have the following environment variables defined

IDAM_WEB_URL=http://localhost:XXXX/login

IDAM_API_URL=http://localhost:XXXX/o/token

XXXX is the port which CFTLIB uses for IDAM

## Developing

### Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint)
with [Prettier](https://github.com/prettier/prettier)
alongside [sass-lint](https://github.com/sasstools/sass-lint)
[Husky] Pre-Commit Hooks are enabled which makes sure all your files are formatted
before commiting (https://github.com/typicode/husky)

Running the linting with ES auto fix and Prettier check:

```bash
$ yarn lint --fix
```

Running the linting with Prettier auto fix:

```bash
$ yarn prettier src/* --write
```

### Running the tests

This template app uses [Jest](https://jestjs.io//) as the test engine. You can run unit tests by executing
the following command:

```bash
$ yarn test
```

Here's how to run functional tests (the template contains just one sample test):

```bash
$ yarn test:routes
```

Running accessibility tests:

```bash
$ yarn test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

Running all continuous integration tests:

```bash
$ yarn cichecks
```

### Security

#### CSRF prevention

[Cross-Site Request Forgery](https://github.com/pillarjs/understanding-csrf) prevention has already been
set up in this template, at the application level. However, you need to make sure that CSRF token
is present in every HTML form that requires it. For that purpose you can use the `csrfProtection` macro,
included in this template app. Your njk file would look like this:

```
...
<form ...>
  ...
    <input type="hidden" name="_csrf" value={{ csrfToken }}>
  ...
</form>
...
```

#### Helmet

This application uses [Helmet](https://helmetjs.github.io/), which adds various security-related HTTP headers
to the responses. Apart from default Helmet functions, following headers are set:

- [Referrer-Policy](https://helmetjs.github.io/docs/referrer-policy/)
- [Content-Security-Policy](https://helmetjs.github.io/docs/csp/)

There is a configuration section related with those headers, where you can specify:

- `referrerPolicy` - value of the `Referrer-Policy` header.

Here's an example setup:

```json
{
  "security": {
    "referrerPolicy": "origin"
  }
}
```

Make sure you have those values set correctly for your application.

### Healthcheck

The application exposes a health endpoint (https://localhost:3001/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [health.ts](src/main/modules/health/index.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Functional tests

### Technology Stack

| Technology       | Description                                                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nodejs & Yarn    | [Node.js](https://nodejs.org/) & [yarn](https://yarnpkg.com/)                                                                                                                                    |
| Codecept 3.2.3   | CodeceptJS allows to run several browser sessions inside a test. This can be useful for testing communication between users inside a chat or other systems.                                      |
| Puppeteer 13.2.0 | Puppeteer framework is one such framework that offers Headless Browser Testing for Google Chrome. It allows the tester to perform the actions on the Chrome browser using commands in JavaScript |
| JavaScript       | Using java script to implement features & scenarios                                                                                                                                              |

### Running functional tests

```bash
$ yarn test:functional
```

### Responsible Team
## Team
  Employment Tribunals
