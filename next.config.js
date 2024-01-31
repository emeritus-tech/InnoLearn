/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-destructuring */
/** @type {import('next').NextConfig} */

const loaderUtils = require('loader-utils')
const nextTranslate = require('next-translate')
const { withSentryConfig } = require('@sentry/nextjs')

const localIdent = (loaderContext, localIdentName, localName, options) => {
  const interpolatedClassname = loaderUtils
    .interpolateName(loaderContext, `[folder]_[name]__${localName}`, options)
    .replace(/\.module_/, '_')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/^(\d|--|-\d)/, '__$1')
  return interpolatedClassname.includes('globals') ? localName : interpolatedClassname
}

function cssLoaderOptions(modules) {
  const { ...others } = modules
  return {
    ...others,
    getLocalIdent: localIdent,
    exportLocalsConvention: 'camelCaseOnly',
    mode: 'local'
  }
}

const regexEqual = (x, y) =>
  x instanceof RegExp &&
  y instanceof RegExp &&
  x.source === y.source &&
  x.global === y.global &&
  x.ignoreCase === y.ignoreCase &&
  x.multiline === y.multiline

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true
  },
  eslint: {
    dirs: ['src', 'tests']
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['images.ctfassets.net']
  },
  async headers() {
    return [
      {
        // matching all font assests alone
        source: '/_next/:path*.(eot|otf|svg|ttf|woff|woff2)',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }]
      }
    ]
  },
  env: {
    SENTRY_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development'
  },
  sassOptions: {
    includePaths: ['./src/styles'],
    prependData: `
      @use "variables" as *;
      @use "mixins" as *;`
  },
  // Staging and Production have Cloudfront instances configured, review apps do not
  assetPrefix:
    (process.env.CLOUDFRONT_INSTANCE || process.env.HEROKU_APP_NAME) &&
    (process.env.CLOUDFRONT_INSTANCE || `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`),

  webpack: (config) => {
    const oneOf = config.module.rules.find((rule) => typeof rule.oneOf === 'object')
    if (oneOf) {
      const moduleSassRule = oneOf.oneOf.find((rule) => regexEqual(rule.test, /\.module\.(scss|sass)$/))

      if (moduleSassRule) {
        const cssLoader = moduleSassRule.use.find(({ loader }) => loader.includes('css-loader'))
        if (cssLoader) {
          cssLoader.options = {
            ...cssLoader.options,
            modules: cssLoaderOptions(cssLoader.options.modules)
          }
        }
      }
    }
    return config
  },
  sentry: {
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true
  }
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = nextTranslate(withSentryConfig(nextConfig))
