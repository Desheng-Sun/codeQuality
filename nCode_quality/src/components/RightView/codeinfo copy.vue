<template>
  <div id="codeinfo">
    <div id="codequality"></div>
    <div id="codecontext">
      <div v-if="isData">
        <div class="detail">
          <table class="source_code">
            <tbody >
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
                    {{ t.commitUser }}
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
                      :class="issues.divClass"
                    >
                      rule: {{ issues.rule }}, issue_seq:{{ issues.seq }}
                    </div>
                  </div>
                </td>
                <td class="code_context">{{ t.codeContext }}</td>

                <td class="line_num before" v-if="isFileChange">{{ t.lineBefore }}</td>
                <td class="lineinfo before" v-if="isFileChange">
                  <button
                    :class="t.lineInfoButtonClassBefore"
                    type="button"
                    v-on:click="lineinfoclick($event)"
                    :data-line-number="t.line"
                    data-line-NaB="before"
                  >
                    {{ t.commitUserBefore }}
                  </button>
                  <div class="lineinfo_detail">
                    <div class="lineinfo_top">{{ t.commitIdBefore }}</div>
                    <div class="lineinfo_top">{{ t.commitHashBefore }}</div>
                    <div class="lineinfo_top">{{ t.commitUserBefore }}</div>
                    <div class="lineinfo_top">{{ t.commitDateBefore }}</div>
                  </div>
                </td>

                <td class="line_issues before" v-if="isFileChange">
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
                <td class="code_context before" v-if="isFileChange">{{ t.codeContextBefore }}</td>
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
    nowid() {},
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
            } else {
              continue;
            }
            for (let j in rawData["data"][i]["issues"]) {
              lineIssuesDetial.push({
                id: rawData["data"][i]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["issues"][j]["rules"],
                seq: rawData["data"][i]["issues"][j]["issue_seq"],
              });
            }
          } else {
            commitId = rawData["data"][i]["commit_id"];
            commitHash = rawData["data"][i]["commit_Hash"];
            commitUser = rawData["data"][i]["commiter"];
            commitDate = rawData["data"][i]["date"];
            codeContext = rawData["data"][i]["context"];
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
          let line = rawData["data"][i]["fileNow"]["line"];
          let lineInfoButtonClass = "";
          let commitId = "";
          let commitHash = "";
          let commitUser = "";
          let commitDate = "";
          let lineIssuesButtonClass = "line_issues_false";
          let issuesIn = false;
          let lineIssuesDetial = [];
          let codeContext = "";
          let lineBefore = rawData["data"][i]["fileBefore"]["line"];
          let lineInfoButtonClassBefore = "";
          let commitIdBefore = "";
          let commitHashBefore = "";
          let commitUserBefore = "";
          let commitDateBefore = "";
          let lineIssuesButtonClassBefore = "line_issues_false";
          let issuesBeforeIn = false;
          let lineIssuesBeforeDetial = [];
          let codeContextBefore = "";
          if (parseInt(rawData["data"][i]["fileNow"]["line"]) == 0) {
            lineInfoButtonClass = " IsUser_false";
            lineInfoButtonClassBefore = " IsUser_false";
            if (rawData["data"][i]["fileNow"]["issues"].length > 0) {
              lineIssuesButtonClass = "line_issues_true";
              issuesIn = true;
            } else {
              continue;
            }
            let issuesAdd = "issues_new_false";
            for (let j in rawData["data"][i]["fileNow"]["issues"]) {
              let divClass = "issuesinfo_top";
              if ((rawData["data"][i]["fileNow"]["issues"]["isNew"] = "True")) {
                issuesAdd = "issues_new_true";
                divClass = "issuesinfo_top_change";
              }
              lineIssuesDetial.push({
                id: rawData["data"][i]["fileNow"]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["fileNow"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileNow"]["issues"][j]["issue_seq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClass =
              lineIssuesButtonClass + " " + issuesAdd;

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
              lineIssuesButtonClassBefore + " " + issuesDel;
          } else {
            if (line == "") {
              trClass = trClass + " isDel";
              lineInfoButtonClass = lineInfoButtonClass + "isDel";
              lineInfoButtonClassBefore = lineInfoButtonClassBefore + "isDel";
            } else if (lineBefore == "") {
              trClass = trClass + " isNew";
              lineInfoButtonClass = lineInfoButtonClass + "isNew";
              lineInfoButtonClassBefore = lineInfoButtonClassBefore + "isNew";
            }

            commitId = rawData["data"][i]["fileNow"]["commit_id"];
            commitHash = rawData["data"][i]["fileNow"]["commit_Hash"];
            commitUser = rawData["data"][i]["fileNow"]["commiter"];
            commitDate = rawData["data"][i]["fileNow"]["date"];
            codeContext = rawData["data"][i]["fileNow"]["context"];
            if (rawData["data"][i]["fileNow"]["issues"].length > 0) {
              lineIssuesButtonClass = "line_issues_true";
              issuesIn = true;
            }
            let issuesAdd = "issues_new_false";
            for (let j in rawData["data"][i]["fileNow"]["issues"]) {
              let divClass = "issuesinfo_top";
              if ((rawData["data"][i]["fileNow"]["issues"]["isNew"] = "True")) {
                issuesAdd = "issues_new_true";
                divClass = "issuesinfo_top_change";
              }
              lineIssuesDetial.push({
                id: rawData["data"][i]["fileNow"]["issues"][j]["issue_id"],
                rule: rawData["data"][i]["fileNow"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileNow"]["issues"][j]["issue_seq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClass =
              lineIssuesButtonClass + " " + issuesAdd;
            commitIdBefore = rawData["data"][i]["fileBefore"]["commit_id"];
            commitHashBefore = rawData["data"][i]["fileBefore"]["commit_Hash"];
            commitUserBefore = rawData["data"][i]["fileBefore"]["commiter"];
            commitDateBefore = rawData["data"][i]["fileBefore"]["date"];
            codeContextBefore = rawData["data"][i]["fileBefore"]["context"];
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
                issuesDel = "issues_del_true";
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
              lineIssuesButtonClassBefore + " " + issuesDel;
          }
          this.trData.push({
            trClass: trClass,
            line: i,
            line: line,
            lineInfoButtonClass: lineInfoButtonClass,
            commitId: commitId,
            commitHash: commitHash,
            commitUser: commitUser,
            commitDate: commitDate,
            lineIssuesButtonClass: lineIssuesButtonClass,
            issuesIn: issuesIn,
            lineIssuesDetial: lineIssuesDetial,
            codeContext: codeContext,
            lineBefore: lineBefore,
            lineInfoButtonClassBefore: lineInfoButtonClassBefore,
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
      console.log(this.trData);
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
      let domelememt = e.srcElement;
      let line_num = domelememt.getAttribute("data-line-number");
      let show_Now = true;
      if (domelememt.getAttribute("data-line-NaB") == "before") {
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
  font-size: 1px;
  font-family: "Times New Roman";
  overflow: auto;
}
.ditail {
  width: 430px;
  height: 800px;
}
.source_code {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.tr {
  height: 18px;
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
  width: 20px;
}

/* 设置代码详细信息的格式 */
.lineinfo {
  width: 35px;
  
}

.lineinfo > button{
  padding: 0;  
  height: 18px;
  width: 100%;
  background-color: #fff;
  border: none;
  cursor: pointer;
  font-family: "Times New Roman", "宋体";
  font-size: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; 
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
  width: 30px;
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
.issues_del_true {
  background-color: lawngreen;
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
  white-space: pre-wrap;
  font-family: "Times New Roman", "宋体";
  font-size: 1px;
}
</style>