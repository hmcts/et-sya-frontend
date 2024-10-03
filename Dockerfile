FROM hmctspublic.azurecr.io/base/node:20-alpine as build

USER root
RUN corepack enable
USER hmcts

WORKDIR /opt/app

COPY --chown=hmcts:hmcts . .

RUN PUPPETEER_SKIP_DOWNLOAD=true yarn install

RUN yarn build:prod

FROM build as runtime

RUN rm -rf webpack/ webpack.config.js

COPY --from=build $WORKDIR/src/main ./src/main

RUN yarn build:ts
EXPOSE 3002

