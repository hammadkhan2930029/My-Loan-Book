const path = require('path');
const { getDefaultConfig ,mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
const srcRoot = path.resolve(__dirname, 'src');
const previousResolveRequest = config.resolver?.resolveRequest;

config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName.startsWith('@/')) {
      const resolvedModuleName = path.join(srcRoot, moduleName.slice(2));

      if (previousResolveRequest) {
        return previousResolveRequest(context, resolvedModuleName, platform);
      }

      return context.resolveRequest(context, resolvedModuleName, platform);
    }

    if (previousResolveRequest) {
      return previousResolveRequest(context, moduleName, platform);
    }

    return context.resolveRequest(context, moduleName, platform);
  },
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules ?? {}),
    '@': srcRoot,
  },
};

module.exports = withNativeWind(config, {
  input: './global.css',
});
