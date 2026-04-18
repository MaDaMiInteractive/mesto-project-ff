module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 4 versions', 'not dead']
        }
      }
    ]
  ]
};
