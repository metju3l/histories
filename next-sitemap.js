const siteUrl = 'https://www.histories.cc';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', disallow: '/api/*' },
      { userAgent: '*', allow: '/' },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
  exclude: ['/api/*'],
};
