FROM hmctspublic.azurecr.io/base/node:20-alpine as build

# Run all commands as hmcts user
USER root
RUN corepack enable
USER hmcts

WORKDIR /opt/app
# Copy necessary files
COPY --chown=hmcts:hmcts package.json yarn.lock webpack.config.js tsconfig.json .eslintrc.js .eslintignore .yarnrc.yml ./

# Install dependencies
# Copy .yarn directory
COPY --chown=hmcts:hmcts .yarn/ .yarn/

# Verify contents
RUN ls -l /opt/app/.yarn
RUN PUPPETEER_SKIP_DOWNLOAD=true yarn install

# Copy application files
COPY --chown=hmcts:hmcts src/main/ ./src/main/
COPY --chown=hmcts:hmcts webpack/ ./webpack/

RUN yarn build:prod

FROM build as runtime
RUN rm -rf webpack/ webpack.config.js
COPY --from=build $WORKDIR/src/main ./src/main
RUN yarn build:ts
EXPOSE 3002

