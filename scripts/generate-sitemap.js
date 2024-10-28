import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const links = [
  { url: '/', changefreq: 'never', priority: 1.0 },
  // { url: '/room', changefreq: 'daily', priority: 0 },
];

const generateSitemap = async () => {
  const sitemap = new SitemapStream({ hostname: 'https://misfortune-engine.vercel.app' });

  const writeStream = createWriteStream('./public/sitemap.xml');
  sitemap.pipe(writeStream);

  links.forEach(link => sitemap.write(link));
  sitemap.end();

  await streamToPromise(sitemap);
  console.log('Sitemap generated successfully!');
};

generateSitemap();
