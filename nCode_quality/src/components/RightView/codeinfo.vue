<template>
  <div id="codecontext">
      <div v-if="isData" class="detail">
        <table class="sourceCode">
          <tbody v-if="!isFileChange">
            <tr
              v-for="(t, index) in trData"
              :key="'notfilechange_' + index"
              :class="t.trClass"
              :data-line-number="t.line"
            >
              <td class="lineNum">{{ t.line }}</td>
              <td class="lineinfo">
                <button
                  type="button"
                  v-on:click="lineinfoclick($event)"
                  :data-line-number="t.line"
                >
                  {{ t.commitUser }}
                </button>
                <div class="lineInfoDetail">
                  <div class="lineinfoTop">{{ t.commitId }}</div>
                  <div class="lineinfoTop">{{ t.commitHash }}</div>
                  <div class="lineinfoTop">{{ t.commitUser }}</div>
                  <div class="lineinfoTop">{{ t.commitDate }}</div>
                </div>
              </td>
              <td class="lineIssues">
                <button
                  :class="t.lineIssuesButtonClass"
                  type="button"
                  v-on:click="issuesinfoclick($event)"
                  :data-line-number="t.line"
                  data-line-NaB="now"
                >
                  ...
                </button>
                <div class="lineIssueDetail" v-if="t.issuesIn">
                  <div
                    v-for="(issues, issuesIndex) in t.lineIssuesDetial"
                    :key="index + 'issues_' + issuesIndex"
                    v-on:click="issuesclick($event)"
                    :value="issues.key"
                    :data-commitId="issues.commitId"
                    :data-rule="issues.rule"
                    class="issuesInfoTop"
                  >
                    rule:{{ issues.rule }},issueSeq:{{ issues.seq }}
                  </div>
                </div>
              </td>
              <td class="codeContext">{{ t.codeContext }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr
              v-for="(t, index) in trData"
              :key="'filechange_' + index"
              :class="t.trClass"
              :data-line-number="t.line"
            >
              <td class="codeContext">{{ t.codeContextNow }}</td>
              <td class="lineNum">{{ t.lineNow }}</td>
              <td class="lineinfo">
                <button
                  :class="t.lineInfoButtonClassNow"
                  type="botton"
                  v-on:click="lineinfoclick($event)"
                  :data-line-number="t.line"
                  data-line-NaB="now"
                >
                  {{ t.commitUserNow }}
                </button>
                <div class="lineInfoDetail">
                  <div class="lineinfoTop">{{ t.commitIdNow }}</div>
                  <div class="lineinfoTop">{{ t.commitHashNow }}</div>
                  <div class="lineinfoTop">{{ t.commitUserNow }}</div>
                  <div class="lineinfoTop">{{ t.commitDateNow }}</div>
                </div>
              </td>
              <td class="lineIssues">
                <button
                  :class="t.lineIssuesButtonClassNow"
                  type="button"
                  v-on:click="issuesinfoclick($event)"
                  :data-line-number="t.line"
                  data-line-NaB="now"
                >
                  ...
                </button>
                <div class="lineIssueDetail" v-if="t.issuesNowIn">
                  <div
                    v-for="(issues, issuesIndex) in t.lineIssuesNowDetial"
                    :key="index + 'issuesnow_' + issuesIndex"
                    v-on:click="issuesclick($event)"
                    :value="issues.key"
                    :data-commitId="issues.commitId"
                    :data-rule="issues.rule"
                    :class="issues.divClass"
                  >
                    rule:{{ issues.rule }},issueSeq:{{ issues.seq }}
                  </div>
                </div>
              </td>

              <td class="lineNum before">{{ t.lineBefore }}</td>
              <td class="lineinfo before">
                <button
                  :class="t.lineInfoButtonClassBefore"
                  type="button"
                  v-on:click="lineinfoclick($event)"
                  :data-line-number="t.line"
                  data-line-NaB="before"
                >
                  {{ t.commitUserBefore }}
                </button>
                <div class="lineInfoDetail">
                  <div class="lineinfoTop">{{ t.commitIdBefore }}</div>
                  <div class="lineinfoTop">{{ t.commitHashBefore }}</div>
                  <div class="lineinfoTop">{{ t.commitUserBefore }}</div>
                  <div class="lineinfoTop">{{ t.commitDateBefore }}</div>
                </div>
              </td>

              <td class="lineIssues before">
                <button
                  :class="t.lineIssuesButtonClassBefore"
                  type="button"
                  v-on:click="issuesinfoclick($event)"
                  :data-line-number="t.line"
                  data-line-NaB="before"
                >
                  ...
                </button>
                <div class="lineIssueDetail before" v-if="t.issuesBeforeIn">
                  <div
                    v-for="(issues, issuesIndex) in t.lineIssuesBeforeDetial"
                    :key="index + 'issuesbefore_' + issuesIndex"
                    v-on:click="issuesclick($event)"
                    :value="issues.key"
                    :data-rule="issues.rule"
                    :data-commitId="issues.commitId"
                    :class="issues.divClass"
                  >
                    rule:{{ issues.rule }},issueSeq:{{ issues.seq }}
                  </div>
                </div>
              </td>
              <td class="codeContext before">{{ t.codeContextBefore }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
import FileQuality from "./FileItem";
export default {
  components: {
    FileQuality,
  },
  props: {
    cfilename: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      isData: false,
      isFileChange: false,
      trData: [],
    };
  },
  watch: {
    cfilename() {
      this.$axios({
        method: "get",
        url: "/fileLineInfo",
        params: {
          commitId: this.cfilename[1],
          filename: this.cfilename[0].replace(/\//g, "_").replace(/`/g, "_"),
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
          let trClass = "lineSingle";
          if (parseInt(rawData["data"][i]["line"]) % 2 == 0) {
            trClass = "lineDouble";
          }
          let line = rawData["data"][i]["line"];
          let commitId = "";
          let commitHash = "";
          let commitUser = "";
          let commitDate = "";
          let codeContext = "";
          let lineIssuesButtonClass = "lineIssuesFalse";
          let issuesIn = false;
          let lineIssuesDetial = [];
          if (parseInt(rawData["data"][i]["line"]) == 0) {
            if (rawData["data"][i]["issues"].length > 0) {
              lineIssuesButtonClass = "lineIssuesTrue";
              issuesIn = true;
            } else {
              continue;
            }
            for (let j in rawData["data"][i]["issues"]) {
              lineIssuesDetial.push({
                key: rawData["data"][i]["issues"][j]["issueKey"],
                commitId: rawData["data"][i]["issues"][j]["CommitId"],
                rule: rawData["data"][i]["issues"][j]["rules"],
                seq: rawData["data"][i]["issues"][j]["issueSeq"],
              });
            }
          } else {
            commitId = rawData["data"][i]["commitId"];
            commitHash = rawData["data"][i]["commitHash"];
            commitUser = rawData["data"][i]["commiter"];
            commitDate = rawData["data"][i]["date"];
            codeContext = rawData["data"][i]["context"];
            if (rawData["data"][i]["issues"].length > 0) {
              lineIssuesButtonClass = "lineIssuesTrue";
              issuesIn = true;
            }
            for (let j in rawData["data"][i]["issues"]) {
              lineIssuesDetial.push({
                key: rawData["data"][i]["issues"][j]["issueKey"],
                commitId: rawData["data"][i]["issues"][j]["CommitId"],
                rule: rawData["data"][i]["issues"][j]["rules"],
                seq: rawData["data"][i]["issues"][j]["issueSeq"],
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
          let trClass = "lineSingle";
          if (i % 2 == 0) {
            trClass = "lineDouble";
          }
          let lineNow = rawData["data"][i]["fileNow"]["line"];
          let lineInfoButtonClassNow = "";
          let commitIdNow = "";
          let commitHashNow = "";
          let commitUserNow = "";
          let commitDateNow = "";
          let lineIssuesButtonClassNow = "lineIssuesFalse";
          let issuesNowIn = false;
          let lineIssuesNowDetial = [];
          let codeContextNow = "";
          let lineBefore = rawData["data"][i]["fileBefore"]["line"];
          let lineInfoButtonClassBefore = "";
          let commitIdBefore = "";
          let commitHashBefore = "";
          let commitUserBefore = "";
          let commitDateBefore = "";
          let lineIssuesButtonClassBefore = "lineIssuesFalse";
          let issuesBeforeIn = false;
          let lineIssuesBeforeDetial = [];
          let codeContextBefore = "";
          if (parseInt(rawData["data"][i]["fileNow"]["line"]) == 0) {
            lineInfoButtonClassNow = " IsUserFalse";
            lineInfoButtonClassBefore = " IsUserFalse";
            if (rawData["data"][i]["fileNow"]["issues"].length > 0) {
              lineIssuesButtonClassNow = "lineIssuesTrue";
              issuesNowIn = true;
            } else {
              continue;
            }
            let issuesAdd = "issuesNewFalse";
            for (let j in rawData["data"][i]["fileNow"]["issues"]) {
              let divClass = "issuesInfoTop";
              if ((rawData["data"][i]["fileNow"]["issues"][j]["isNew"] == "True")) {
                issuesAdd = "issuesNewTrue";
                divClass = "isissuesInfoTopChange";
              }
              lineIssuesNowDetial.push({
                key: rawData["data"][i]["fileNow"]["issues"][j]["issueKey"],
                commitId:
                  rawData["data"][i]["fileNow"]["issues"][j]["CommitId"],
                rule: rawData["data"][i]["fileNow"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileNow"]["issues"][j]["issueSeq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassNow =
              lineIssuesButtonClassNow + " " + issuesAdd;

            let issuesDel = "issuesDelFalse";
            if (rawData["data"][i]["fileBefore"]["issues"].length > 0) {
              lineIssuesButtonClassBefore = "lineIssuesTrue";
              issuesBeforeIn = true;
            }
            for (let j in rawData["data"][i]["fileBefore"]["issues"]) {
              let divClass = "issuesInfoTop";
              if (
                (rawData["data"][i]["fileBefore"]["issues"][j]["isDel"] == "True")
              ) {
                issuesDel = "issuesDelTrue";
                divClass = "isissuesInfoTopChange";
              }
              lineIssuesBeforeDetial.push({
                key: rawData["data"][i]["fileBefore"]["issues"][j]["issueKey"],
                commitId:
                  rawData["data"][i]["fileBefore"]["issues"][j]["CommitId"],
                rule: rawData["data"][i]["fileBefore"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileBefore"]["issues"][j]["issueSeq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassBefore =
              lineIssuesButtonClassBefore + " " + issuesDel;
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

            commitIdNow = rawData["data"][i]["fileNow"]["commitId"];
            commitHashNow = rawData["data"][i]["fileNow"]["commitHash"];
            commitUserNow = rawData["data"][i]["fileNow"]["commiter"];
            commitDateNow = rawData["data"][i]["fileNow"]["date"];
            codeContextNow = rawData["data"][i]["fileNow"]["context"];
            if (rawData["data"][i]["fileNow"]["issues"].length > 0) {
              lineIssuesButtonClassNow = "lineIssuesTrue";
              issuesNowIn = true;
            }
            let issuesAdd = "issuesNewFalse";
            for (let j in rawData["data"][i]["fileNow"]["issues"]) {
              let divClass = "issuesInfoTop";
              if ((rawData["data"][i]["fileNow"]["issues"][j]["isNew"] == "True")) {
                issuesAdd = "issuesNewTrue";
                divClass = "isissuesInfoTopChange";
              }
              lineIssuesNowDetial.push({
                key: rawData["data"][i]["fileNow"]["issues"][j]["issueKey"],
                commitId:
                  rawData["data"][i]["fileNow"]["issues"][j]["CommitId"],
                rule: rawData["data"][i]["fileNow"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileNow"]["issues"][j]["issueSeq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassNow =
              lineIssuesButtonClassNow + " " + issuesAdd;
            commitIdBefore = rawData["data"][i]["fileBefore"]["commitId"];
            commitHashBefore = rawData["data"][i]["fileBefore"]["commitHash"];
            commitUserBefore = rawData["data"][i]["fileBefore"]["commiter"];
            commitDateBefore = rawData["data"][i]["fileBefore"]["date"];
            codeContextBefore = rawData["data"][i]["fileBefore"]["context"];
            if (rawData["data"][i]["fileBefore"]["issues"].length > 0) {
              lineIssuesButtonClassBefore = "lineIssuesTrue";
              issuesBeforeIn = true;
            }
            let issuesDel = "issuesDelFalse";
            if (rawData["data"][i]["fileBefore"]["issues"].length > 0) {
              lineIssuesButtonClassBefore = "lineIssuesTrue";
              issuesBeforeIn = true;
            }
            for (let j in rawData["data"][i]["fileBefore"]["issues"]) {
              let divClass = "issuesInfoTop";
              if (
                (rawData["data"][i]["fileBefore"]["issues"][j]["isDel"] == "True")
              ) {
                issuesDel = "issuesDelTrue";
                divClass = "isissuesInfoTopChange";
              }
              lineIssuesBeforeDetial.push({
                key: rawData["data"][i]["fileBefore"]["issues"][j]["issueKey"],
                commitId:
                  rawData["data"][i]["fileBefore"]["issues"][j]["CommitId"],
                rule: rawData["data"][i]["fileBefore"]["issues"][j]["rules"],
                seq: rawData["data"][i]["fileBefore"]["issues"][j]["issueSeq"],
                divClass: divClass,
              });
            }
            lineIssuesButtonClassBefore =
              lineIssuesButtonClassBefore + " " + issuesDel;
          }
          this.trData.push({
            trClass: trClass,
            line: i,
            lineNow: lineNow,
            lineInfoButtonClassNow: lineInfoButtonClassNow,
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
      let lineNum = domelememt.getAttribute("data-line-number");
      let showNow = true;
      if (domelememt.getAttribute("data-line-NaB") == "before") {
        showNow = false;
      }
      let showLine = document.querySelector(
        'tr[data-line-number = "' + lineNum + '"]'
      );
      let divLineInfo = showLine.getElementsByClassName("lineinfo")[0];
      if (!showNow) {
        divLineInfo = showLine.getElementsByClassName("lineinfo")[1];
      }
      let divDetail = divLineInfo.getElementsByClassName("lineInfoDetail")[0];
      if (divDetail.style.display == "block") {
        divDetail.style.display = "none";
      } else {
        divDetail.style.display = "block";
      }
    },
    issuesinfoclick(e) {
      let domelememt = e.srcElement;
      let lineNum = domelememt.getAttribute("data-line-number");
      let showNow = true;
      if (domelememt.getAttribute("data-line-NaB") == "before") {
        showNow = false;
      }
      let showLine = document.querySelector(
        'tr[data-line-number = "' + lineNum + '"]'
      );
      let divLineIssues = showLine.getElementsByClassName("lineIssues")[0];
      if (!showNow) {
        divLineIssues = showLine.getElementsByClassName("lineIssues")[1];
      }
      let divDetail = divLineIssues.getElementsByClassName(
        "lineIssueDetail"
      )[0];
      if (divDetail.style.display == "block") {
        divDetail.style.display = "none";
      } else {
        divDetail.style.display = "block";
      }
    },
    issuesclick(e) {
      let domelememt = e.srcElement;
      let issuesKey = domelememt.getAttribute("value");
      let commitId = domelememt.getAttribute("data-commitId");
      let issuesRule = domelememt.getAttribute("data-rule");
      this.$store.commit("setIssues", {
        newIssues: [issuesKey, commitId, issuesRule],
      });
    },
  },
};
</script>
<style scoped>
/* 设置页面的大小、文字 */
#codecontext {
  width: 430px;
  height: 100%;
  font-size: 1px;
  font-family: "Times New Roman", Times, serif;
  overflow: auto;
}
.ditail {
  width: 430px;
  height: 100%;
}
.sourceCode {
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
.lineDouble {
  background-color: ghostwhite;
}

.isNew {
  background-color: rgba(35, 203, 167, 0.5);
}

.isDel {
  background-color: rgba(226, 106, 106, 0.5);
}
/* 设置页面行号显示格式 */
.lineNum {
  width: 20px;
}

/* 设置代码详细信息的格式 */
.lineinfo {
  width: 35px;
}

.lineinfo > button {
  padding: 0;
  height: 18px;
  width: 100%;
  background-color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lineInfoDetail {
  display: none;
  position: relative;
  float: left;
  padding: 5px 5px 5px 5px;
  border: 1px solid lightgray;
  background-color: aqua;
}

.issuesInfoTop {
  cursor: pointer;
}

.issuesInfoTop:hover {
  text-decoration: underline;
  background-color: lightblue;
  color: white;
}

.isissuesInfoTopChange {
  cursor: pointer;
  background-color: #aaffaa;
}

.isissuesInfoTopChange:hover {
  text-decoration: underline;
  background-color: lightblue;
  color: white;
}

button:hover {
  text-decoration: underline;
  background-color: lightblue;
  color: white;
}

.IsUserFalse {
  display: none;
}

/* 设置显示issues表格的格式 */
.lineIssues {
  width: 30px;
}

.lineIssues > button {
  padding: 0;
  height: 18px;
  width: 100%;
  border: none;
  cursor: pointer;
  font-size: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lineIssuesTrue {
  background-color: rgba(92, 151, 191, 0.5);
}

.lineIssuesFalse {
  display: none;
}

.issuesNewTrue {
  background-color: rgba(207, 0, 15, 0.5);
}
.issuesDelTrue {
  background-color: rgba(123, 239, 178, 0.5);
}

.lineIssueDetail {
  display: none;
  position: relative;
  float: left;
  padding: 5px 5px 5px 5px;
  border: 1px solid lightgray;
  background-color: aqua;
}

.codeContext {
  width: 470px;
  white-space: pre-wrap;
  font-size: 1px;
}
</style>
