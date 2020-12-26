<template>
  <div class="d-flex flex-justify-between mb-3 flex-column-reverse flex-md-row flex-items-end">
    <div class="d-flex justify-content-start flex-auto w-100 mt-3 my-md-0">
      <div class="btn-group" role="group" aria-label="Repository group">
        <base-button v-for="(repo, idx) in repoIssues" :key="idx"
                     type="outline-default"
                     :toggleable="true"
                     :toggled.sync="repo.isDisplayed"
                     @click="searchThrottled">
          {{repo.displayName}}
        </base-button>
      </div>
    </div>
    <div class="ml-md-3 d-flex justify-content-between w-100 w-md-auto">
      <base-input v-model="searchTerm"
                  placeholder="Search"
                  :focusKeys="['alt', 'f']"
                  addon-left-icon="fas fa-search"
                  class="mb-0"></base-input>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import throttle from 'lodash.throttle';
import { Moment } from 'moment';

import gitService from '@/services/gitService';

import Issue from '~/models/issue';
import Repository from '~/models/cl-repository';

@Component
export default class IssuesFilters extends Vue {
  @Prop({ required: true })
  repoIssues: Repository[];

  searchTerm: string = '';
  // eslint-disable-next-line no-control-regex
  searchRegex = new RegExp('[ \t]+');
  searchThrottled = throttle(() => this.filterIssues([]), 500);

  get searchTerms(): string[] {
    return this.searchTerm.split(this.searchRegex);
  }

  @Watch('searchTerm')
  searchUpdated(newSeartchTerm: string) {
    this.searchThrottled();
  }

  @Watch('repoIssues')
  filterIssues(newRepoData: Repository[]) {
    const filteredIssues = this.repoIssues
      .filter(this.filterRepo, this)
      .map((repo) => repo.issues)
      .flat()
      .filter(this.filterSearchIssues, this)
      .sort(this.sortIssues);

    this.$emit('update:filtered-issues', filteredIssues);
  }

  private filterRepo(r: Repository, _idx: number, _arr: Repository[]): boolean {
    return r.isDisplayed;
  }

  private filterSearchIssues(i: Issue, _idx: number, _arr: Issue[]): boolean {
    return this.searchTerms.every((st) => i.title.includes(st));
  }

  private sortIssues(a: Issue, b: Issue) {
    const diff = b.reactions['+1'] - a.reactions['+1'];

    return diff !== 0
      ? Math.min(1, Math.max(diff))
      : (b.created_at as Moment).diff(a.created_at);
  }
}
</script>

<style scoped lang="scss">

</style>
