<template>
  <div class="detail">
    <table class="source_code">
      <tbody v-if="isFileChange">
        <tr
          v-for="t in trData"
          :key="t"
          :class="t.lineSoD"
          :data-line-number="t.line"
        >
          <td class="line_num">{{ t.line }}</td>
          <td class="lineinfo">
            <button
              type="button"
              v-on:click="lineinfoclick(this)"
              :data-line-number="t.line"
            >
              {{ t.commitUserShort }}
            </button>
            <div class="lineinfo_detail">
              <div class="lineinfo_top">{{ t.commitId }}</div>
              <div class="lineinfo_top">{{ t.commitHash }}</div>
              <div class="lineinfo_top">{{ t.commitUser }}</div>
              <div class="lineinfo_top">{{ t.commitDate }}</div>
            </div>
          </td>
          <td class="line_issues">
            <button
              :class="t.lineIssues"
              type="button"
              v-on:click="issuesinfoclick(this)"
              value="..."
            ></button>
            <div class="lineissue_detail">{{ t.issues }}</div>
          </td>
          <td class="code_context">{{ t.codeContext }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          v-for="t in trData"
          :key="t"
          :class="t.trClass"
          :data-line-number="t.line"
        >
          <td class="line_num">{{ t.lineNow }}</td>
          <td class="lineinfo">
            <button
              :class="t.lineInfoButtonClassNow"
              type="botton"
              v-on:click="lineinfoclick(this)"
              :data-line-number="t.line"
              data-line-NaB = "now"
            >
              {{ t.commitUserShortNow }}
            </button>
            <div :class="lineInfoClassNow">
              <div class="lineinfo_top">{{ t.commitIdNow }}</div>
              <div class="lineinfo_top">{{ t.commitHashNow }}</div>
              <div class="lineinfo_top">{{ t.commitUserNow }}</div>
              <div class="lineinfo_top">{{ t.commitDateNow }}</div>
            </div>
          </td>
          <td class="line_issues">
            <button
              :class="t.lineIssuesButtonNow"
              type="button"
              v-on:click="issuesinfoclick(this)"
              :data-line-number="t.line"
              data-line-NaB = "now"
            >
              ...
            </button>
            <div class="lineissue_detail">{{ t.issuesNow }}</div>
          </td>
          <td class="code_context">{{ t.codeContextNow }}</td>


          <td class="line_num before">{{ t.lineBefore }}</td>
          <td class="lineinfo before">
            <button
              :class="t.lineInfoButtonClassBefore"
              type="botton"
              v-on:click="lineinfoclick(this)"
              :data-line-number="t.line"
              data-line-NaB = "before"
            >
              {{ t.commitUserShortBefore }}
            </button>
            <div :class="lineInfoClassBefore">
              <div class="lineinfo_top">{{ t.commitIdBefore }}</div>
              <div class="lineinfo_top">{{ t.commitHashBefore }}</div>
              <div class="lineinfo_top">{{ t.commitUserBefore }}</div>
              <div class="lineinfo_top">{{ t.commitDateBefore }}</div>
            </div>
          </td>
          <td class="line_issues before">
            <button
              :class="t.lineIssuesButtonBefore"
              type="button"
              v-on:click="issuesinfoclick(this)"
              :data-line-number="t.line"
              data-line-NaB = "before"
            >
              ...
            </button>
            <div class="lineissue_detail before">{{ t.issuesBefore }}</div>
          </td>
          <td class="code_context before">{{ t.codeContextBefore }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFileChange: true,
      trData: [],
    };
  },
  methods: {
    if(isFileChange) {
      lineSoD = "line_Single";
      if (int(k["line"]) % 2 == 0) {
        lineSoD = "line_Double";
      }
      line = k["line"];
      commitUserShort = "";
      commitId = "";
      commitHash = "";
      commitUser = "";
      commitDate = "";
      codeContext = "";
      lineIssues = "line_issues_false";
      issues = "";
    },
  },
};
</script>

<style>
</style>