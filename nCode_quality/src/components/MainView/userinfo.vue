<template>
  <div id="userinfo">
    <div id="userinfotitle">Commiter Infomation about The Project</div>
    <div id="userinfodetial"></div>
    <div id="commitInfoUser">
      <commitInfo></commitInfo>
    </div>
    <div id="userinfocompare">
      <userInfoCompare></userInfoCompare>
    </div>
    <div id="commitInfoNow">
      <div class="commitInfoDetail">Version: {{ commitInfoNow[0] }}   </div>
      <div class="commitInfoDetail">Hash: {{ commitInfoNow[1] }}   </div>
      <div class="commitInfoDetail">commiter: {{ commitInfoNow[2] }}   </div>
      <div class="commitInfoDetail">Date: {{ commitInfoNow[3] }}   </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import commitInfo from "./commitInfo";
import userInfoCompare from "./UserInfoCompare";
export default {
  components: {
    commitInfo,
    userInfoCompare,
  },
  data() {
    return {
      rawData: [],
    };
  },
  computed: {
    commitInfoNow() {
      return this.$store.state.commitInfoNow;
    },
  },
  mounted() {
    this.$axios({
      method: "get",
      url: "/userinfo",
    })
      .then((res) => {
        this.rawData = res.data;
        this.drawUserinfoAll(this.rawData);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  watch: {
    rawData() {
      // this.$nextTick(function () {
      //   for (let i = 0; i < 15; i++) {
      //     this.drawUserinfoDetial(this.rawData, i);
      //   }
      // });
    },
  },
  methods: {
    drawUserinfoAll(rawData) {
      let chart = echarts.init(document.getElementById("userinfodetial"));
      let commitId = rawData[0];
      let userdata = rawData[4];
      let color = [
        "rgb(92, 151, 191)",
        "rgb(250, 190, 88)",
        "rgb(35, 203, 167)",
        "rgb(226, 106, 106)",
        "rgb(207, 0, 15)",
        "rgb(123, 239, 178)",
      ];
      let titleInfo = () => {
        let titleNow = [];
        for (let i in userdata) {
          titleNow.push({
            text: userdata[i]["username"].substring(0, 20) + "..",
            top: ((parseInt(i / 6) + 1) / 3) * 100 - 6 + "%",
            bottom: (1 - (parseInt(i / 6) + 1) / 3) * 100 + "%",
            left: ((i % 6) / 6) * 100 + 4 + "%",
            textStyle: {
              fontFamily: "Times new roman",
              fontSize: 8,
            },
          });
        }
        return titleNow;
      };
      let legendName = () => {
        let legendNameNow = [];
        for (let i in userdata[0]["data"]) {
          legendNameNow.push(i);
        }
        return legendNameNow;
      };
      let xAxisInfo = () => {
        let xAxisNow = [];
        for (let i in userdata) {
          xAxisNow.push({
            data: commitId,
            gridIndex: i,
            boundaryGap: false,
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          });
        }
        return xAxisNow;
      };
      let yAxisInfo = () => {
        let yAxisNow = [];
        for (let i in userdata) {
          yAxisNow.push({
            gridIndex: i,
            axisLabel: {
              inside: false,
              fontSize: 8,
              formatter: function (value) {
                let isMinus = 1;
                let finalValue = 0;
                if (value < 0) {
                  value = -value;
                  isMinus = -1;
                }
                if (value > 20) {
                  finalValue = 2000 + (value - 20) * 2800;
                } else if (value > 10) {
                  finalValue = 500 + (value - 10) * 150;
                } else {
                  finalValue = value * 50;
                }
                finalValue = finalValue * isMinus;
                if (Math.abs(finalValue) > 1000) {
                  finalValue = finalValue / 1000 + "k";
                }
                return finalValue;
              },
            },
            axisTick: {
              show: false,
            },
          });
        }
        return yAxisNow;
      };
      let gridInfo = () => {
        let gridNow = [];
        for (let i in userdata) {
          gridNow.push({
            top: (parseInt(i / 6) / 3) * 100 + 2 + "%",
            bottom: (1 - (parseInt(i / 6) + 1) / 3) * 100 + 7 + "%",
            left: ((i % 6) / 6) * 100 + 3 + "%",
            right: (1 - ((i % 6) + 1) / 6) * 100 + 1 + "%",
          });
        }
        return gridNow;
      };
      let seriesInfo = () => {
        let seriseNow = [];
        for (let i in userdata) {
          let num = 0;
          for (let j in userdata[i]["data"]) {
            seriseNow.push({
              xAxisIndex: i,
              yAxisIndex: i,
              name: j,
              type: "line",
              color: color[num],
              data: userdata[i]["data"][j],
              lineStyle: {
                width: 1,
                opacity: 0.8,
              },
            });
            num = num + 1;
          }
        }
        return seriseNow;
      };
      let option = {
        title: titleInfo(),
        legend: {
          data: legendName(),
          left: "84%",
          right: "0%",
          bottom: "5%",
          top: "67%",
          itemWidth: "1",
          itemHeight: "10",
          textStyle: {
            fontStyle: "times new roman",
            fontSize: "10",
          },
        },
        xAxis: xAxisInfo(),
        yAxis: yAxisInfo(),
        grid: gridInfo(),
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function (params) {
            let str = params[0].axisValue + "<br /> ";
            for (let i in params) {
              let isMinus = 1;
              let finalValue = 0;
              if (params[i].data < 0) {
                params[i].data = -params[i].data;
                isMinus = -1;
              }
              if (params[i].data > 20) {
                finalValue = 2000 + (params[i].data - 20) * 2800;
              } else if (params[i].data > 10) {
                finalValue = 500 + (params[i].data - 10) * 150;
              } else {
                finalValue = params[i].data * 50;
              }
              finalValue = finalValue * isMinus;
              finalValue = Math.round(finalValue);
              if (Math.abs(finalValue) > 1000) {
                finalValue = finalValue / 1000 + "k";
              }
              str = str + params[i].seriesName + ": " + finalValue + "<br />";
            }
            return str;
          },

          position: function (point, params, dom, rect, size) {
            return [point[0], point[1]];
          },
        },
        series: seriesInfo(),
      };
      chart.setOption(option);
      chart.getZr().on("dblclick", (params) => {
        console.log(params);
      });
    },
  },
};
</script>
<style scoped>
#userinfo {
  width: 100%;
  height: 100%;
}
#userinfotitle {
  width: 920px;
  height: 25px;
  font-size: 25px;
  font-family: "Times New Roman", Times, serif;
  text-align: left;
  color: darkgray;
}
#userinfodetial {
  width: 920px;
  height: 400px;
}
#commitInfoUser {
  width: 920px;
  height: 150px;
}
#userinfocompare {
  width: 920px;
  height: 105px;
}
#commitInfoNow {
  width: 920px;
  height: 20px;
  font-family: "Times New Roman", Times, serif;
  text-align: center;
  color: darkgray;
}
.commitInfoDetail {
  height: 15px;
  font-size: 8px;
  white-space: pre;
  display: inline-block;
}
</style>