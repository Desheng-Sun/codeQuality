<template>
  <div id="issues">
    <div id = "issuesTitle">Issues Infomation</div>
    <div v-if="isIssuesInfo" class="detail">
      <div v-if="isIssues" class="issuesmeta">
        <div class="issuesPosition">
          {{ trData[0]["component"] }}
        </div>
        <div class="message">{{ trData[0]["message"] }}</div>
      </div>
      <div class="rulemeta">
        <div class="RulesName">
          {{ trData[1]["name"] }}
        </div>
        <div>
          <div class="RulesInfo">severity: {{ trData[1]["severity"] }}</div>
          <div class="RulesInfo">key: {{ trData[1]["key"] }}</div>
          <div class="RulesInfo">type: {{ trData[1]["type"] }}</div>
          <div class="RulesInfo">tags: {{ trData[1]["tags"] }}</div>
          <div class="RulesInfo">Repair time: {{ trData[1]["defaultDebtRemFnOffset"] }}</div>
        </div>
        <div class="promptInfo" v-html="trData[1]['htmlDesc']"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    Issues() {
      return this.$store.state.Issues;
    },
  },
  data() {
    return {
      AllRules: [],
      trData: [],
      isIssuesInfo: false,
      isIssues: false,
    };
  },
  mounted() {
    this.$axios({
      method: "get",
      url: "/RulesInfo",
    })
      .then((res) => {
        this.AllRules = res.data;
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  watch: {
    Issues() {
      this.$axios({
        method: "get",
        url: "/IssuesInfo",
        params: {
          commitId: this.Issues[1],
        },
      })
        .then((res) => {
          this.isIssuesInfo = false;
          this.isIssues = false;
          this.trData = [];
          let rawData = res.data;
          this.drawIssusInfo(rawData);
        })
        .catch((reason) => {
          console.log(reason);
        });
    },
  },
  methods: {
    drawIssusInfo(rawData) {
      if (this.Issues[0] != "") {
        this.isIssues = true;
        for (let i in rawData) {
          if (rawData[i]["key"] == this.Issues[0]) {
            this.trData.push(rawData[i]);
          }
        }
      } else {
        this.trData.push([]);
      }
      for (let i in this.AllRules) {
        if (this.AllRules[i]["key"] == this.Issues[2]) {
          this.trData.push(this.AllRules[i]);
          this.isIssuesInfo = true;
          break;
        }
      }
      if (this.isIssuesInfo == false) {
        this.trData.push([]);
      }
      console.log(this.trData);
    },
  },
};
</script>
<style scoped>
/* 设置页面的大小、文字 */
#issues{
  width: 525px;
  height: 196px;
  overflow: auto;
  font-family: "Times New Roman", Times, serif;
}

#issuesTitle{
  width: 525px;
  height: 25px;
  font-size: 25px;
  font-family: 'Times New Roman', Times, serif;
  text-align: left;
  color: darkgray;
  padding-bottom: 5px;
}

.detail {
  width: 525px;
  height: 166px;
  overflow: auto;
  font-family: "Times New Roman", Times, serif;
}

.issuesmeta{
  width: 100%;
}
.issuesPosition {
  padding-bottom: 5px;
  font-weight: 800;
  font-size: 15px;
}
.message {
  font-weight: 300;
  font-size: 10px;
}
.rulemeta{
  padding-top:0.1cm;
}
.RulesName{
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 20px;
}
.RulesInfo{
  font-size: 8px;
  background-color: lavender;
  white-space: pre;
  display: inline-block;
}

.promptInfo{
  font-size: 8px;
}

>>> p {
  font-size: 14px;
}
>>> code{
  background-color:rgba(0,0,0,.06);
  line-height: 12px;
  font-family: "Times New Roman";
}
>>> h2{
  font-size: 15px;
}
>>>pre{
  font-family: "Times New Roman";
  white-space: pre;
  padding: 10px;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  color: #444;;
}
</style>