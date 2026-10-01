# ---- Base image ----
FROM hmctsprod.azurecr.io/base/node:20-alpine as base
USER root
RUN corepack enable
COPY --chown=hmcts:hmcts . .
USER hmcts

# ---- Build image ----

FROM base as build
RUN PUPPETEER_SKIP_DOWNLOAD=true yarn install && yarn build:prod

# ---- Runtime image ----
FROM build as runtime
RUN rm -rf webpack/ webpack.config.js
RUN yarn tsc -P . --outDir ./src
EXPOSE 3002
