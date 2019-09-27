module.exports = [{
  script: 'index.js',
  name: 'server',
  exec_mode: 'cluster',
  instances: '2',
  env: {
    NODE_ENV: 'development'
  },
  env_production: {
    NODE_ENV: 'production'
  },
  env_test: {
    NODE_ENV: 'test'
  },
  env_staging: {
    NODE_ENV: 'staging'
  }
}]
  ;
