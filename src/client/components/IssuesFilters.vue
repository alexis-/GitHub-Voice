<template>
  <div class="d-none">
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { Moment } from 'moment';

import gitService from '@/services/gitService';

import Issue from '~/models/issue';
import Repository from '~/models/cl-repository';

@Component
export default class IssuesFilters extends Vue {
  @Prop({ required: true })
  repoIssues: Repository[];

  @Watch('repoIssues')
  filterIssues(newRepoData: Repository[]) {
    const sortFn = (a: Issue, b: Issue) => {
      const diff = b.reactions['+1'] - a.reactions['+1'];

      return diff !== 0
        ? Math.min(1, Math.max(diff))
        : (b.created_at as Moment).diff(a.created_at);
    };

    const filteredIssues = this.repoIssues
      .map((repo) => repo.issues)
      .flat()
      .sort(sortFn);

    this.$emit('update:filtered-issues', filteredIssues);
  }
}
</script>

<style scoped lang="scss">

</style>
