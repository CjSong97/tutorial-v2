const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://ddk.tools.avaloq.com',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: '/app/bin/public/house.png',
    logoLink: 'https://ddk.tools.avaloq.com/index.html',
    title:
      "Avaloq DDK Tutorial",
    githubUrl: 'https://github.com/CjSong97/tutorial-v2',
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
      '/introduction',
      '/smalljava',
      '/ddk',
      '/troubleshooting',
      '/express',
    ],
    collapsedNav: [
      
    ],
    links: [{ text: 'DDK Documentation', link: 'https://ddk.tools.avaloq.com/index.html' }],
    frontline: false,
    ignoreIndex: true,
    title:
      "Avaloq DDK Tutorial",
  },
  siteMetadata: {
    title: 'Avaloq DDK Tutorial',
    description: 'Tutorial for the Domain-Specific Language Development Kit from Avaloq',
    ogImage: null,
    docsLocation: 'https://ddk.tools.avaloq.com/index.html',
    favicon: '/app/bin/house.png',
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
