module.exports = {
  dependency: {
    platforms: {
      ios: {
        podspecPath: 'NebulaHost.podspec',
      },
      android: {
        sourceDir: 'android',
        packageImportPath: 'import com.hectorzhuang.nebula.NebulaPackage;',
        packageInstance: 'new NebulaPackage()',
      },
    },
  },
};
