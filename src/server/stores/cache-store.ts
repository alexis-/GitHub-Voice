import cacheManager, { CachingConfig } from 'cache-manager';

// TODO: use configuration parameter to choose backing store (redis, mongodb, ...)
export default cacheManager.caching({
  store: 'memory',
  max: 500,
  ttl: 0, // infinite
});

export const cacheCfg: CachingConfig = null!;
