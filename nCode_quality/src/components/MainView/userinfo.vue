<template>
  <div id="userinfo">
    <div id="userinfodetial">
      <div
        v-for="(data, index) in AllUser"
        :key="index"
        :id="'userinfo' + index"
        class="userData"
      ></div>
    </div>
    <div id="commithot"></div>
    <div id="userinfocompare"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      AllUser: [],
      rawData: [],
    };
  },
  created() {
    this.$axios({
      method: "get",
      url: "/userinfo",
    })
      .then((res) => {
        this.rawData = res.data;
        this.AllUser = this.rawData[4];
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  watch: {
    rawData() {
      this.$nextTick(function () {
        for (let i = 0; i < this.AllUser.length; i++) {
          this.drawUserinfoDetial(this.rawData, i);
        }
      });
    },
  },
  methods: {
    drawUserinfoAll(rawData) {
      let chart = echarts.init(document.getElementById("userinfodetial"));
      let commit_id = rawData[0];
      let commit_Hash = rawData[1];
      let commiter = rawData[2];
      let date = rawData[3];
      let userdata = rawData[4];
      let titleInfo = (d) => {
        let titleNow = [];
        for (let i in userdata) {
          titleNow.push({
            text: userdata[i]["username"].substring(0, 4) + "..",
            top: ((parseInt(i / 6) + 1) / 3) * 100 - 6 + "%",
            bottom: (1 - (parseInt(i / 6) + 1) / 3) * 100 + "%",
            left: ((i % 6) / 6) * 100 + 6 + "%",
          });
        }
        return titleNow;
      };
      let xAxisInfo = (d) => {
        let xAxisNow = [];
        for (let i in userdata) {
          xAxisNow.push({
            data: commit_id,
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
      let yAxisInfo = (d) => {
        let yAxisNow = [];
        for (let i in userdata) {
          yAxisNow.push({
            gridIndex: i,
          });
        }
        return yAxisNow;
      };
      let gridInfo = (d) => {
        let gridNow = [];
        for (let i in userdata) {
          gridNow.push({
            top: (parseInt(i / 6) / 3) * 100 + 2 + "%",
            bottom: (1 - (parseInt(i / 6) + 1) / 3) * 100 + 7 + "%",
            left: ((i % 6) / 6) * 100 + 2 + "%",
            right: (1 - ((i % 6) + 1) / 6) * 100 + 2 + "%",
          });
        }
        return gridNow;
      };
      let seriesInfo = (d) => {
        let seriseNow = [];
        for (let i in userdata) {
          let num = 0;
          for (let j in userdata[i]["data"]) {
            num = num + 1;
            if (num <= 5) {
              seriseNow.push({
                xAxisIndex: i,
                yAxisIndex: i,
                type: "bar",
                data: userdata[i]["data"][j],
              });
            } else {
              seriseNow.push({
                xAxisIndex: i,
                yAxisIndex: i,
                type: "line",
                data: userdata[i]["data"][j],
              });
            }
          }
        }
        return seriseNow;
      };
      let option = {
        title: titleInfo(),
        xAxis: xAxisInfo(),
        yAxis: yAxisInfo(),
        grid: gridInfo(),
        series: seriesInfo(),
      };
      chart.setOption(option);
    },
    drawUserinfoDetial(rawData, i) {
      let chart = echarts.init(document.getElementById("userinfo" + i));
      let commit_id = rawData[0];
      let commit_Hash = rawData[1];
      let commiter = rawData[2];
      let date = rawData[3];
      let userdata = rawData[4];
      let seriesInfo = (d) => {
        let seriseNow = [];
        let num = 0;
        for (let j in userdata[i]["data"]) {
          num = num + 1;
          if (num <= 5) {
            seriseNow.push({
              type: "bar",
              data: userdata[i]["data"][j],
            });
          } else {
            seriseNow.push({
              type: "line",
              data: userdata[i]["data"][j],
            });
          }
        }
        return seriseNow;
      };
      let option = {
        title: {
          text: userdata[i]["username"].substring(0, 10) + "..",
          top: "90%",
          bottom: "0%",
          left: "10%",
          textStyle: {
            fontFamily: "Times new roman",
            fontSize: 10,
          },
        },
        xAxis: {
          data: commit_id,
          boundaryGap: false,
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        grid:{
          top:"5%",
          bottom:"15%"
        },
        series: seriesInfo(),
      };
      chart.setOption(option);
    },
  },
};
</script>
<style>
#userinfo {
  width: 100%;
  height: 100%;
}
#userinfodetial {
  width: 920px;
  height: 400px;
}
#commithot {
  width: 920px;
  height: 100px;
}
#userinfocompare {
  width: 920px;
  height: 200px;
}
.userData {
  width: 151px;
  height: 130px;
  display: inline-block;
  padding: 1px;
  display: none;
}
</style>