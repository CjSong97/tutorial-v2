const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: '',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: 'https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/brand.svg',
    logoLink: 'https://hasura.io/learn/',
    title:
      "Avaloq DDK Tutorial",
    githubUrl: 'https://github.com/hasura/gatsby-gitbook-boilerplate',
    helpUrl: 'https://ddk.tools.avaloq.com/index.html',
    tweetText: '',
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/index',
      '/smalljava',
      '/ddk',
      '/troubleshooting',
    ],
    collapsedNav: [
      '/ddk', // add trailing slash if enabled above
    ],
    links: [{ text: 'DDK Documentation', link: 'https://ddk.tools.avaloq.com/index.html' }],
    frontline: false,
    ignoreIndex: false,
    title:
      "Avaloq DDK Tutorial",
  },
  siteMetadata: {
    title: 'Avaloq DDK Tutorial',
    description: 'Tutorial for the Domain-Specific Language Development Kit from Avaloq',
    ogImage: null,
    docsLocation: 'https://github.com/hasura/gatsby-gitbook-boilerplate/tree/master/content',
    favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Gatsby Gitbook Starter',
      short_name: 'GitbookStarter',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
