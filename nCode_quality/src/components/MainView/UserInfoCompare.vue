<template>
  <div id="userInfoCompareC"></div>
</template>

<script>
import echarts from "echarts";
export default {
  computed: {
    nowid() {
      return this.$store.state.commitId;
    },
  },
  watch: {
    nowid() {
      this.$axios({
        method: "get",
        url: "/UserInfoCompare",
      })
        .then((res) => {
          let rawData = res.data;
          this.drawUserinfoDetial(rawData);
        })
        .catch((reason) => {
          console.log(reason);
        });
    },
  },
  mounted() {
    this.$axios({
      method: "get",
      url: "/UserInfoCompare",
    })
      .then((res) => {
        let rawData = res.data;
        this.drawUserinfoDetial(rawData);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  methods: {
    drawUserinfoDetial(rawData) {
      let chart = echarts.init(document.getElementById("userInfoCompareC"));
      let infoName = rawData.infoName;
      let userName = rawData.userName;
      let useData = [];
      for (let i in rawData["data"]) {
        if (rawData["data"][i]["commitId"] == this.nowid) {
          useData = rawData["data"][i]["data"];
          break;
        }
      }
      let parallelAxisInfo = () => {
        let parallelAxisNow = [];
        parallelAxisNow.push({
          dim: 0,
          name: infoName[0],
          type: "category",
          data: userName,
          nameLocation: "end",
          axisLabel: {
            formatter: (value) => {
              return value.substring(0, 4);
            },
          },
        });
        for (let i = 1; i < infoName.length; i++) {
          parallelAxisNow.push({
            dim: i,
            name: infoName[i],
            nameLocation: "end",
            axisLabel: {
              formatter: (value) => {
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
          });
        }
        return parallelAxisNow;
      };

      let option = {
        parallel: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "35%",

          parallelAxisDefault: {
            type: "value",
            nameLocation: "end",
            nameTextStyle: {
              color: "#aaa",
              fontSize: 12,
            },
            axisLine: {
              lineStyle: {
                color: "#aaa",
              },
            },
            axisTick: {
              lineStyle: {
                color: "#777",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: "#aaa",
            },
            realtime: true,
          },
        },
        parallelAxis: parallelAxisInfo(),
        tooltip: {
          show: true,
          trigger: "item",
          padding: 10,
          backgroundColor: "#222",
          borderColor: "#777",
          borderWidth: 1,
          position: function (point, params, dom, rect, size) {
            return [point[0], point[1]];
          },
          formatter: function (params) {
            console.log(params);
            return params
          },
        },
        series: {
          name: "userInfo",
          type: "parallel",
          data: useData,
          lineStyle: {
            width: 1,
            opacity: 0.5,
            color: "rgb(92, 151, 191)",
          },
        },
      };
      chart.setOption(option);
    },
  },
};
</script>
<style scoped>
#userInfoCompareC {
  height: 100%;
  width: 100%;
}
</style>