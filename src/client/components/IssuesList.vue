<template>
  <div class="table-responsive">
    <table class="table align-items-center table-flush">
      <tbody>
        <tr v-for="(issue, idx) in displayedIssues" :key="idx">
          <th class="fit" scope="row">
            <base-button @click="voteUpOrDown(issue)"
                          icon="fas fa-thumbs-up"
                          type="primary"
                          size="sm">
              {{issue.reactions['+1']}}
            </base-button>
          </th>
          <td class="fit" v-if="showProjectColumn">
            <span>{{issue.repo.displayName}}</span>
          </td>
          <td>
            <a :href="issue.url" class="no-link" target="_blank">{{issue.title}}</a>
            <div>
              <small class="mr-2 text-muted">{{issue.created_at.fromNow()}}</small>
              <badge rounded v-for="(label, idx) in issue.labels"
                      :key="idx"
                      :custom-color="label.color">
                {{label.name}}
              </badge>
            </div>
          </td>
          <td class="fit">
            <span v-if="issue.comments > 0">
              <small><i class="text-muted far fa-comment-alt"></i> {{issue.comments}}</small>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <base-pagination :per-page="pageItems"
                       :total="displayedIssuesCount"
                       :prevHotKey="['arrowleft']"
                       :nextHotKey="['arrowright']"
                       v-model="pageNo"
                       class="mt-3"
                       align="center">
      </base-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Moment } from 'moment';

import gitService from '@/services/gitService';

import Issue from '~/models/issue';
import Repository from '~/models/cl-repository';

@Component
export default class IssuesList extends Vue {
  @Prop({ default: true })
  showProjectColumn: boolean;

  @Prop({ required: true })
  filteredIssues: Array<Issue>;

  pageItems: number = 25;
  pageNo: number = 1;

  get displayedIssues() {
    const start = (this.pageNo - 1) * this.pageItems;
    const end = (this.pageNo) * this.pageItems;

    return this.filteredIssues
      .filter((row, idx) => idx >= start && idx < end);
  }

  get displayedIssuesCount() {
    return this.filteredIssues.length;
  }

  async voteUpOrDown(issue: Issue) {
    if (this.$store.getters['auth/isAuthenticated'] === false) {
      this.$store.commit('TOGGLE_SIGN_IN_MODAL');
      return;
    }

    try {
      // 1 - Check existing reactions against cached reaction because GH api doesn't update in real time.
      let userReaction = issue.userReaction;
      console.log(`>>> 1. ${userReaction}`);

      // If no reaction was cached, fetch from GH.
      if (userReaction === null) {
        const listResp = await gitService.getReactions(issue);

        if (listResp === undefined || listResp.status !== 200) {
          return;
        }

        const reactions = listResp.data;
        const user = this.$store.getters['auth/user'];

        userReaction = reactions.find((r) => r.content === '+1' && r.user.id.toString() === user.id.toString());
        console.log(`>>> 2. ${userReaction}`);
      }

      // 2 - Either add or delete reaction depending on whether user has previously voted.
      const updateResp = (userReaction === null || userReaction === undefined)
        ? await gitService.addReaction(issue, '+1')
        : await gitService.delReaction(issue, userReaction.id);

      if (updateResp === undefined || updateResp.status >= 400) {
        return;
      }

      if (userReaction) {
        issue.reactions['+1']--;
        issue.userReaction = undefined;
        console.log(`>>> 3. ${issue.userReaction}`);
      } else {
        issue.reactions['+1']++;
        issue.userReaction = updateResp.data;
        console.log(`>>> 4. ${issue.userReaction}`);
      }
    } catch (ex) {
      console.error(ex);
    }
  }
}
</script>

<style scoped lang="scss">
.issues-page {

  .card {

    .table {
      th, td {
        padding: .7rem 1rem;
      }

      thead th {
        font-size: .65rem;
        padding-top: .75rem;
        padding-bottom: .75rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        border: none;
      }

      .thead-light {
        th {
          color: #738191;
          background-color: #F6F8FA;
        }
      }
    }
  }
}
</style>
