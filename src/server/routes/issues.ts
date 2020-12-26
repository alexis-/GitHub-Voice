import { Router as AsyncRouter } from '@awaitjs/express';

import repoStore from '@/stores/repository-store';

const router = module.exports = AsyncRouter();

router.getAsync('/', async (req, resp) => {
  const repoIssues = await repoStore.getRepoIssuesAsync();

  resp.status(200);
  resp.setHeader('Content-Type', 'application/json');
  resp.setHeader('ETag', `"${repoIssues.eTag}"`);
  resp.end(repoIssues.json);
});

export default router;
