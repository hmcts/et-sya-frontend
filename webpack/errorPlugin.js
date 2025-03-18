class IgnoreWebpackErrorsPlugin {
    apply(compiler) {
      compiler.hooks.done.tap('IgnoreWebpackErrorsPlugin', (stats) => {
        if (stats.hasErrors()) {
          console.log('Ignoring webpack errors...');
          // Prevent the build from failing by forcing exit code to 0
          process.exitCode = 0;
        }
      });
    }
  }
  
  module.exports = IgnoreWebpackErrorsPlugin;