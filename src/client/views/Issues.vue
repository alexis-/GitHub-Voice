<template>
  <div class="issues-page">
    <section>
      <div class="container-lg">
        <IssuesFilters :repoIssues="repoIssues"
                       v-on:update:filtered-issues="filteredIssues = $event" />
        <card no-body>
          <IssuesList :filteredIssues="filteredIssues"
                      :showProjectColumn="showProjectColumn" />
        </card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';

import IssuesList from '@/components/IssuesList.vue';
import IssuesFilters from '@/components/IssuesFilters.vue';

import issuesService from '@/services/issuesService';

import Issue from '~/models/issue';
import Repository from '~/models/cl-repository';

@Component({
  components: {
    IssuesList,
    IssuesFilters,
  },
})
export default class Issues extends Vue {
  repoIssues: Array<Repository> = [];
  filteredIssues: Array<Issue> = [];

  created() {
    issuesService.listAsync()
      .then(this.processIssuesResp)
      .catch(console.warn);
  }

  processIssuesResp(resp: AxiosResponse<Repository[]>) {
    if (!resp || !resp.data) {
      return;
    }

    const repoIssues = resp.data;

    Object
      .entries(repoIssues)
      .forEach(([projectName, repo]) => {
        repo.issues.forEach((i) => {
          i.repo = repo;
          i.created_at = moment(i.created_at);
          // i.displayElapsedTime = i.createdMoment.fromNow();
        });
      });

    this.repoIssues = repoIssues;
  }

  get showProjectColumn(): boolean {
    return Object.keys(this.repoIssues).length > 1;
  }
}

</script>

<style lang="scss" scoped>
</style>
