<template>
  <div id="codeinfo">
    <div id="codequality"></div>
    <div id="codecontext">
      <div v-if="isData">
        <div class="detail">
          <table class="source_code">
            <tbody v-if="!isFileChange">
              <tr
                v-for="(t, index) in trData"
                :key="'notfilechange_' + index"
                :class="t.trClass"
                :data-line-number="t.line"
              >
                <td class="line_num">{{ t.line }}</td>
                <td class="lineinfo">
                  <button
                    type="button"
                    v-on:click="lineinfoclick($event)"
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
                    :class="t.lineIssuesButtonClass"
                    type="button"
                    v-on:click="issuesinfoclick($event)"
                    value="..."
                    :data-line-number="t.line"
                    data-line-NaB="now"
                  ></button>
                  <div class="lineissue_detail" v-if="t.issuesIn">
                    <div
                      v-for="(issues, issues_index) in t.lineIssuesDetial"
                      :key="index + 'issues_' + issues_index"
                      v-on:click="issuesclick($event)"
                      :value="issues.id"
                      class="issuesinfo_top"
                    >
                      rule: {{ issues.rule }}, issue_seq:{{ issues.seq }}
                    </div>
                  </div>
                </td>
                <td class="code_context">{{ t.codeContext }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr
                v-for="(t, index) in trData"
                :key="'filechange_' + index"
                :class="t.trClass"
                :data-line-number="t.line"
              >
                <td class="line_num">{{ t.lineNow }}</td>
                <td class="lineinfo">
                  <button
                    :class="t.lineInfoButtonClassNow"
                    type="botton"
                    v-on:click="lineinfoclick($event)"
                    :data-line-number="t.line"
                    data-line-NaB="now"
                  >
                    {{ t.commitUserShortNow }}
                  </button>
                  <div class="lineinfo_detail">
                    <div class="lineinfo_top">{{ t.commitIdNow }}</div>
                    <div class="lineinfo_top">{{ t.commitHashNow }}</div>
                    <div class="lineinfo_top">{{ t.commitUserNow }}</div>
                    <div class="lineinfo_top">{{ t.commitDateNow }}</div>
                  </div>
                </td>
                <td class="line_issues">
                  <button
                    :class="t.lineIssuesButtonClassNow"
                    type="button"
                    v-on:click="issuesinfoclick($event)"
                    :data-line-number="t.line"
                    data-line-NaB="now"
                  >
                    ...
                  </button>
                  <div class="lineissue_detail" v-if="t.issuesNowIn">
                    <div
                      v-for="(issues, issues_index) in t.lineIssuesNowDetial"
                      :key="index + 'issuesnow_' + issues_index"
                      v-on:click="issuesclick($event)"
                      :value="issues.id"
                      :class="issues.divClass"
                    >
                      rule: {{ issues.rule }}, issue_seq:{{ issues.seq }}
                    </div>
                  </div>
                </td>
                <td class="code_context">{{ t.codeContextNow }}</td>

                <td class="line_num before">{{ t.lineBefore }}</td>
                <td class="lineinfo before">
                  <button
                    :class="t.lineInfoButtonClassBefore"
                    type="botton"
                    v-on:click="lineinfoclick($event)"
                    :data-line-number="t.line"
                    data-line-NaB="before"
                  >
                    {{ t.commitUserShortBefore }}
                  </button>
                  <div class="lineinfo_detail">
                    <div class="lineinfo_top">{{ t.commitIdBefore }}</div>
                    <div class="lineinfo_top">{{ t.commitHashBefore }}</div>
                    <div class="lineinfo_top">{{ t.commitUserBefore }}</div>
                    <div class="lineinfo_top">{{ t.commitDateBefore }}</div>
                  </div>
                </td>
                <td class="line_issues before">
                  <button
                    :class="t.lineIssuesButtonClassBefore"
                    type="button"
                    v-on:click="issuesinfoclick($event)"
                    :data-line-number="t.line"
                    data-line-NaB="before"
                  >
                    ...
                  </button>
                  <div class="lineissue_detail before" v-if="t.issuesBeforeIn">
                    <div
                      v-for="(issues, issues_index) in t.lineIssuesBeforeDetial"
                      :key="index + 'issuesbefore_' + issues_index"
                      v-on:click="issuesclick($event)"
                      :value="issues.id"
                      :class="issues.divClass"
                    >
                      rule: {{ issues.rule }}, issue_seq:{{ issues.seq }}
                    </div>
                  </div>
                </td>
                <td class="code_context before">{{ t.codeContextBefore }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cfilename: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isData: false,
      isFileChange: false,
      trData: [],
    };
  },
  computed: {
    nowid() {
      return this.$store.state.commit_id;
    },
  },
  watch: {
    nowid() {
      
    },
    cfilename() {
      this.$axios({
        method: "get",
        url: "/file_line_info",
        params: {
          commit_id: this.nowid,
          filename: this.cfilename.replace(/\//g, "_").replace(/`/g, "_"),
        },
      })
        .then((res) => {
          this.isData = false;
          this.codeinfoData(res.data);
        })
        .catch((reason) => {
          console.log(reason);
        });
    },
  },
  methods: {
    codeinfoData(rawData) {
      this.isData = true;
      this.trData = [];
      if (rawData["isFileChange"] == "False") {
        this.isFileChange = false;
        for (let i in rawData["data"]) {
          let trClass = "line_Single";
          if (parseInt(rawData["data"][i]["line"]) % 2 == 0) {
            trClass = "line_Double";
          }
          let line = rawData["data"][i]["line"];
          let commitUserShort = "";
          let commitId = "";
          let commitHash = "";
          let commitUser = "";
          let commitDate = "";
          let codeContext = "";
          let lineIssuesButtonClass = "line_issues_false";
          let issuesIn = false;
          let lineIssuesDetial = [];
          if (parseInt(rawData["data"][i]["line"]) == 0) {
            if (rawData["data"][i]["issues"].length > 0) {
              lineIssuesButtonClass = "line_issues_true";
              issuesIn = true;
            }
            for (let j in rawData["data"][i]["issues"]) {
              lineIssuesDetial.push({
                id: rawData["data"][i]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["issues"][j]["rules"],
                seq: rawData["data"][i]["issues"][j]["issue_seq"],
              });
            }
          } else {
            commitUserShort = rawData["data"][i]["commiter"]
              .substring(0, 4)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            commitId = rawData["data"][i]["commit_id"];
            commitHash = rawData["data"][i]["commit_Hash"];
            commitUser = rawData["data"][i]["commiter"]
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            commitDate = rawData["data"][i]["date"];
            codeContext = rawData["data"][i]["context"]
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            if (rawData["data"][i]["issues"].length > 0) {
              lineIssuesButtonClass = "line_issues_true";
              issuesIn = true;
            }
            for (let j in rawData["data"][i]["issues"]) {
              lineIssuesDetial.push({
                id: rawData["data"][i]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["issues"][j]["rules"],
                seq: rawData["data"][i]["issues"][j]["issue_seq"],
              });
            }
          }
          this.trData.push({
            trClass: trClass,
            line: line,
            commitUserShort: commitUserShort,
            commitId: commitId,
            commitHash: commitHash,
            commitUser: commitUser,
            commitDate: commitDate,
            codeContext: codeContext,
            lineIssuesButtonClass: lineIssuesButtonClass,
            issuesIn: issuesIn,
            lineIssuesDetial: lineIssuesDetial,
          });
        }
      } else {
        this.isFileChange = true;
        for (let i in rawData["data"]) {
          let trClass = "line_Single";
          if (i % 2 == 0) {
            trClass = "line_Double";
          }
          let lineNow = rawData["data"][i]["fileNow"]["line"];
          let lineInfoButtonClassNow = "";
          let commitUserShortNow = "";
          let commitIdNow = "";
          let commitHashNow = "";
          let commitUserNow = "";
          let commitDateNow = "";
          let lineIssuesButtonClassNow = "line_issues_false";
          let issuesNowIn = false;
          let lineIssuesNowDetial = [];
          let codeContextNow = "";
          let lineBefore = rawData["data"][i]["fileBefore"]["line"];
          let lineInfoButtonClassBefore = "";
          let commitUserShortBefore = "";
          let commitIdBefore = "";
          let commitHashBefore = "";
          let commitUserBefore = "";
          let commitDateBefore = "";
          let lineIssuesButtonClassBefore = "line_issues_false";
          let issuesBeforeIn = false;
          let lineIssuesBeforeDetial = [];
          let codeContextBefore = "";
          if (parseInt(rawData["data"][i]["fileNow"]["line"]) == 0) {
            lineInfoButtonClassNow = " IsUser_false";
            lineInfoButtonClassBefore = " IsUser_false";
            if (rawData["data"][i]["fileNow"]["issues"].length > 0) {
              lineIssuesButtonClassNow = "line_issues_true";
              issuesNowIn = true;
            }
            let issuesAdd = "issues_new_false";
            for (let j in rawData["data"][i]["fileNow"]["issues"]) {
              let divClass = "issuesinfo_top";
              if ((rawData["data"][i]["fileNow"]["issues"]["isNew"] = "True")) {
                issuesAdd = "issues_new_True";
                divClass = "issuesinfo_top_change";
              }
              lineIssuesNowDetial.push({
                id: rawData["data"][i]["fileNow"]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["fileNow"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileNow"]["issues"][j]["issue_seq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassNow = lineIssuesButtonClassNow + issuesAdd;

            let issuesDel = "issues_del_false";
            if (rawData["data"][i]["fileBefore"]["issues"].length > 0) {
              lineIssuesButtonClassBefore = "line_issues_true";
              issuesBeforeIn = true;
            }
            for (let j in rawData["data"][i]["fileBefore"]["issues"]) {
              let divClass = "issuesinfo_top";
              if (
                (rawData["data"][i]["fileBefore"]["issues"]["isNew"] = "True")
              ) {
                issuesDel = "issues_del_True";
                divClass = "issuesinfo_top_change";
              }
              lineIssuesBeforeDetial.push({
                id: rawData["data"][i]["fileBefore"]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["fileBefore"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileBefore"]["issues"][j]["issue_seq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassBefore =
              lineIssuesButtonClassBefore + issuesDel;
          } else {
            if (lineNow == "") {
              trClass = trClass + " isDel";
              lineInfoButtonClassNow = lineInfoButtonClassNow + "isDel";
              lineInfoButtonClassBefore = lineInfoButtonClassBefore + "isDel";
            } else if (lineBefore == "") {
              trClass = trClass + " isNew";
              lineInfoButtonClassNow = lineInfoButtonClassNow + "isNew";
              lineInfoButtonClassBefore = lineInfoButtonClassBefore + "isNew";
            }

            commitUserShortNow = rawData["data"][i]["fileNow"]["commiter"]
              .substring(0, 4)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            commitIdNow = rawData["data"][i]["fileNow"]["commit_id"];
            commitHashNow = rawData["data"][i]["fileNow"]["commit_Hash"];
            commitUserNow = rawData["data"][i]["fileNow"]["commiter"]
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            commitDateNow = rawData["data"][i]["fileNow"]["date"];
            codeContextNow = rawData["data"][i]["fileNow"]["context"]
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            if (rawData["data"][i]["fileNow"]["issues"].length > 0) {
              lineIssuesButtonClassNow = "line_issues_true";
              issuesNowIn = true;
            }
            let issuesAdd = "issues_new_false";
            for (let j in rawData["data"][i]["fileNow"]["issues"]) {
              let divClass = "issuesinfo_top";
              if ((rawData["data"][i]["fileNow"]["issues"]["isNew"] = "True")) {
                issuesAdd = "issues_new_True";
                divClass = "issuesinfo_top_change";
              }
              lineIssuesNowDetial.push({
                id: rawData["data"][i]["fileNow"]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["fileNow"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileNow"]["issues"][j]["issue_seq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassNow = lineIssuesButtonClassNow + issuesAdd;

            commitUserShortBefore = rawData["data"][i]["fileBefore"]["commiter"]
              .substring(0, 4)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            commitIdBefore = rawData["data"][i]["fileBefore"]["commit_id"];
            commitHashBefore = rawData["data"][i]["fileBefore"]["commit_Hash"];
            commitUserBefore = rawData["data"][i]["fileBefore"]["commiter"]
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            commitDateBefore = rawData["data"][i]["fileBefore"]["date"];
            codeContextBefore = rawData["data"][i]["fileBefore"]["context"]
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            if (rawData["data"][i]["fileBefore"]["issues"].length > 0) {
              lineIssuesButtonClassBefore = "line_issues_true";
              issuesBeforeIn = true;
            }
            let issuesDel = "issues_del_false";
            if (rawData["data"][i]["fileBefore"]["issues"].length > 0) {
              lineIssuesButtonClassBefore = "line_issues_true";
              issuesBeforeIn = true;
            }
            for (let j in rawData["data"][i]["fileBefore"]["issues"]) {
              let divClass = "issuesinfo_top";
              if (
                (rawData["data"][i]["fileBefore"]["issues"]["isNew"] = "True")
              ) {
                issuesDel = "issues_del_True";
                divClass = "issuesinfo_top_change";
              }
              lineIssuesBeforeDetial.push({
                id: rawData["data"][i]["fileBefore"]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["fileBefore"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileBefore"]["issues"][j]["issue_seq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassBefore =
              lineIssuesButtonClassBefore + issuesDel;
          }
          this.trData.push({
            lineNow: lineNow,
            lineInfoButtonClassNow: lineInfoButtonClassNow,
            commitUserShortNow: commitUserShortNow,
            commitIdNow: commitIdNow,
            commitHashNow: commitHashNow,
            commitUserNow: commitUserNow,
            commitDateNow: commitDateNow,
            lineIssuesButtonClassNow: lineIssuesButtonClassNow,
            issuesNowIn: issuesNowIn,
            lineIssuesNowDetial: lineIssuesNowDetial,
            codeContextNow: codeContextNow,
            lineBefore: lineBefore,
            lineInfoButtonClassBefore: lineInfoButtonClassBefore,
            commitUserShortBefore: commitUserShortBefore,
            commitIdBefore: commitIdBefore,
            commitHashBefore: commitHashBefore,
            commitUserBefore: commitUserBefore,
            commitDateBefore: commitDateBefore,
            lineIssuesButtonClassBefore: lineIssuesButtonClassBefore,
            issuesBeforeIn: issuesBeforeIn,
            lineIssuesBeforeDetial: lineIssuesBeforeDetial,
            codeContextBefore: codeContextBefore,
          });
        }
      }
    },

    lineinfoclick(e) {
      let domelememt = e.srcElement;
      let line_num = domelememt.getAttribute("data-line-number");
      let show_Now = true;
      if (domelememt.getAttribute("data-line-NaB") == "before") {
        show_Now = false;
      }
      let showLine = document.querySelector(
        'tr[data-line-number = "' + line_num + '"]'
      );
      let div_lineinfo = showLine.getElementsByClassName("lineinfo")[0];
      if (!show_Now) {
        div_lineinfo = showLine.getElementsByClassName("lineinfo")[1];
      }
      let div_detail = div_lineinfo.getElementsByClassName(
        "lineinfo_detail"
      )[0];
      if (div_detail.style.display == "block") {
        div_detail.style.display = "none";
      } else {
        div_detail.style.display = "block";
      }
    },
    issuesinfoclick(e) {
      let line_num = e.getAttribute("data-line-number");
      let show_Now = true;
      if (line_num.indexOf("before") != -1) {
        line_num = line_num.replace(" - before", "");
        show_Now = false;
      }
      let showLine = document.querySelector(
        'tr[data-line-number = "' + line_num + '"]'
      );
      let div_line_issues = showLine.getElementsByClassName("line_issues")[0];
      if (!show_Now) {
        div_line_issues = showLine.getElementsByClassName("line_issues")[1];
      }
      let div_detail = div_line_issues.getElementsByClassName(
        "lineissue_detail"
      )[0];
      if (div_detail.style.display == "block") {
        div_detail.style.display = "none";
      } else {
        div_detail.style.display = "block";
      }
    },
    issuesclick(e) {
      rules_detail = e.innerHTML;
    },
  },
};
</script>
<style>
/* 设置页面的大小、文字 */
#codequality {
  width: 430px;
  height: 75px;
}
#codecontext {
  width: 430px;
  height: 900px;
  font-family: "宋体", "Times New Roman";
  font-size: 8px;
}
.ditail {
  width: 430px;
  height: 800px;
  font-family: "宋体", "Times New Roman";
  font-size: 8px;
}
.source_code {
  table-layout: fixed;
  border-collapse: collapse;
}
/* 设置改行背景颜色，以便进行查看 */
.td {
  box-sizing: border-box;
  border-width: 0px;
  padding: 0px;
}
.line_Double {
  background-color: ghostwhite;
}

.isNew {
  background-color: #aaffaa;
}

.isDel {
  background-color: #ffaaaa;
}
/* 设置页面行号显示格式 */
.line_num {
  width: 30px;
}

/* 设置代码详细信息的格式 */
.lineinfo {
  width: 49px;
}

button {
  height: 20px;
  width: 100%;
  background-color: #fff;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: "宋体", "Times New Roman";
  font-size: 8px;
}

button:hover {
  text-decoration: underline;
  background-color: lightblue;
  color: white;
}

.IsUser_false {
  display: none;
}

/* 设置显示issues表格的格式 */
.line_issues {
  width: 49px;
}

.line_issues_true {
  background-color: #ffff77;
}

.line_issues_false {
  display: none;
}
.issues_new_true {
  background-color: lightsalmon;
}
.lineissue_detail {
  display: none;
  position: absolute;
  padding: 5px 5px 5px 5px;
  border: 1px solid lightgray;
  background-color: aqua;
}

.lineinfo_detail {
  display: none;
  position: absolute;
  padding: 5px 5px 5px 5px;
  border: 1px solid lightgray;
  background-color: aqua;
}
.issuesinfo_top {
  cursor: pointer;
}

.issuesinfo_top:hover {
  text-decoration: underline;
  background-color: lightblue;
  color: white;
}

.issuesinfo_top_change {
  cursor: pointer;
  background-color: #aaffaa;
}

.issuesinfo_top_change:hover {
  text-decoration: underline;
  background-color: lightblue;
  color: white;
}

/* .lineinfo_detail::before{

    } */

/* .lineinfo:hover{
        text-decoration:underline
    } */

.code_context {
  width: 470px;
  white-space: pre;
}
</style>
