# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:20-alpine as base
USER root
RUN corepack enable
COPY --chown=hmcts:hmcts . .
USER hmcts

# ---- Build image ----

FROM base as build
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install && yarn build:prod

# ---- Runtime image ----
FROM base as runtime
RUN rm -rf webpack/ webpack.config.js
COPY --from=build $WORKDIR/src/main ./src/main
RUN yarn build:ts
EXPOSE 3002
