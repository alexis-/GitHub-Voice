import { Router as AsyncRouter } from '@awaitjs/express';

import repoStore from '@/stores/repository-store';

const router = module.exports = AsyncRouter();

router.getAsync('/', async (req, resp) => {
  const repoIssues = await repoStore.getRepoIssuesJsonAsync();

  resp.writeHead(200, { 'Content-Type': 'application/json' });
  resp.end(repoIssues);
});

export default router;
