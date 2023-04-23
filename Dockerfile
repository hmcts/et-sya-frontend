# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base
COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM base as build
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install && yarn build:prod

# ---- Runtime image ----
FROM base as runtime
RUN rm -rf webpack/ webpack.config.js
COPY --from=build $WORKDIR/src/main ./src/main
EXPOSE 3001
