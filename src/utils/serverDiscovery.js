// serverDiscovery.js
// Node.js utility to discover available radio-browser servers via DNS
// run in terminal:
// node src/utils/serverDiscovery.js

import dns from 'node:dns';
import { promisify } from 'node:util';
const resolveSrv = promisify(dns.resolveSrv);

/**
 * Get a list of base urls of all available radio-browser servers
 * Returns: Promise<string[]> - base urls of radio-browser servers
 */
export function getRadioBrowserBaseUrls() {
  return resolveSrv('_api._tcp.radio-browser.info').then(hosts => {
    hosts.sort((a, b) => a.name.localeCompare(b.name));
    return hosts.map(host => `https://${host.name}`);
  });
}

/**
 * Get a random available radio-browser server.
 * Returns: Promise<string> - base url for radio-browser api
 */
export function getRadioBrowserBaseUrlRandom() {
  return getRadioBrowserBaseUrls().then(hosts => {
    const item = hosts[Math.floor(Math.random() * hosts.length)];
    return item;
  });
}

// Example usage:
getRadioBrowserBaseUrls().then(hosts => {
  console.log('All available urls');
  console.log('------------------');
  hosts.forEach(host => console.log(host));
  console.log();
  return getRadioBrowserBaseUrlRandom();
}).then(randomHost => {
  console.log('Random base url');
  console.log('------------------');
  console.log(randomHost);
});
