const path = require('path');

class Repository {
  constructor(orgAndRepo, displayName) {
    this.orgAndRepo = orgAndRepo;
    this.displayName = displayName;

    this.orgName = orgAndRepo.substring(0, orgAndRepo.indexOf('/'));
    this.repoName = orgAndRepo.substring(orgAndRepo.indexOf('/') + 1);

    this.eTag = '';
  }

  get filePath() {
    return path.join(global.cfg.server.dataPath, `${this.orgName}_${this.repoName}.json`);
  }

  updateETag(eTag) {
    if (eTag === this.eTag) {
      return false;
    }

    this.eTag = eTag;
    return true;
  }
}

module.exports = Repository;
