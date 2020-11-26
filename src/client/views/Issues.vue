<template>
  <div class="issues-page">
    <section>
      <div class="container-lg">
        <card no-body>
          <div class="table-responsive">
            <table class="table align-items-center table-flush">
              <thead class="thead-light">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Project</th>
                  <th scope="col">Description</th>
                  <th scope="col"></th>
                </tr>
              </thead>
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
                  <td class="fit">
                    <span>{{issue.projectName}}</span>
                  </td>
                  <td>
                    <a :href="issue.html_url" class="no-link" target="_blank">{{issue.title}}</a>
                    <div>
                      <small class="mr-2 text-muted">{{issue.displayElapsedTime}}</small>
                      <badge rounded v-for="(label, idx) in issue.labels"
                             :key="idx"
                             :custom-color="label.color">
                        {{label.name}}
                      </badge>
                    </div>
                  </td>
                  <td class="fit">
                    <span class="ml-1 float-right">
                      <small><i class="text-muted far fa-comment-alt"></i> {{issue.comments}}</small>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <base-pagination :per-page="pageItems" :total="displayedIssuesCount" v-model="pageNo" align="center"></base-pagination>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';

import gitService from '@/services/gitService';
import issuesService from '@/services/issuesService';

export default {
  created() {
    issuesService.list()
      .then((resp) => {
        this.repoIssues = this.processIssuesResp(resp);
      })
      .catch(console.warn);
  },
  data() {
    return {
      repoIssues: {},
      pageItems: 25,
      pageNo: 1,
    };
  },
  computed: {
    filteredIssues() {
      return Object
        .entries(this.repoIssues)
        .map(([repo, issues]) => issues)
        .flat()
        .sort((a, b) => {
          const diff = b.reactions['+1'] - a.reactions['+1'];

          return diff !== 0
            ? Math.min(1, Math.max(diff))
            : b.createdMoment - a.createdMoment;
        });
    },
    displayedIssues() {
      const start = (this.pageNo - 1) * this.pageItems;
      const end = (this.pageNo) * this.pageItems;

      return this.filteredIssues
        .filter((row, idx) => idx >= start && idx < end);
    },
    displayedIssuesCount() {
      return this.filteredIssues.length;
    },
  },
  methods: {
    voteUpOrDown(issue) {
      if (this.$store.getters['auth/isAuthenticated'] === false) {
        this.$store.commit('TOGGLE_SIGN_IN_MODAL');
        return;
      }

      gitService.getReactions(issue.reactions.url)
        .then((resp1) => {
          if (resp1 === undefined || resp1.status !== 200) {
            return;
          }

          const reactions = resp1.data;
          const user = this.$store.getters['auth/user'];
          const userReaction = reactions.find((r) => r.content === '+1' && r.user.id.toString() === user.id);
          const apiCall = (userReaction === null || userReaction === undefined)
            ? gitService.addReaction(issue.reactions.url, '+1')
            : gitService.delReaction(issue.reactions.url, userReaction.id);

          apiCall
            .then((resp2) => {
              if (resp2 === undefined || resp2.status >= 400) {
                return;
              }

              if (userReaction === null || userReaction === undefined) {
                issue.reactions['+1']++;
              } else {
                issue.reactions['+1']--;
              }
            })
            .catch(console.debug);
        })
        .catch(console.debug);
    },
    processIssuesResp(resp) {
      if (!resp || !resp.data) {
        return {};
      }

      const repoIssues = resp.data;

      Object
        .entries(repoIssues)
        .forEach(([projectName, issues]) => {
          issues.forEach((i) => {
            i.projectName = projectName;
            i.createdMoment = moment(i.created_at);
            i.displayElapsedTime = i.createdMoment.fromNow();
          });
        });

      return repoIssues;
    },
  },
};
</script>

<style lang="scss" scoped>
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
