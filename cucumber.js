const common = [
    'support/*.ts',
    'steps/*.ts',
    'pages/*.ts',
    'test.setup.js'
  ];
  
  module.exports = {
    default: {
      path: 'features/*.feature',
      require: common,
      requireModule: ['ts-node/register', 'tsconfig-paths/register'],
      parallel: 2,
      retry: 0,
      format: ['progress-bar', 'json:test-results/cucumber-report.json', 'html:test-results/cucumber-report.html'],
      publish: true
    },
  };