<template>
  <div id="commitInfo"></div>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    this.$axios({
      method: "get",
      url: "/commitInfo",
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
      let chart = echarts.init(document.getElementById("commitInfo"));
      let commitId = rawData[0];
      let commiter = rawData[2];
      let color = [
        "rgb(250, 190, 88)",
        "rgb(35, 203, 167)",
        "rgb(226, 106, 106)",
        "rgb(207, 0, 15)",
        "rgb(123, 239, 178)",
      ];
      let seriesInfo = () => {
        let seriseNow = [];
        seriseNow.push({
          name: "filesChange",
          color: color[0],
          type: "bar",
          data: rawData[4],
        });
        seriseNow.push({
          name: "lineAdd",
          color: color[1],
          type: "bar",
          stack: "two",
          data: rawData[5],
        });
        seriseNow.push({
          name: "lineDel",
          color: color[2],
          type: "bar",
          stack: "two",
          data: rawData[6],
        });
        seriseNow.push({
          name: "issuesAdd",
          color: color[3],
          type: "bar",
          stack: "three",
          data: rawData[7],
        });
        seriseNow.push({
          name: "issuesDel",
          color: color[4],
          type: "bar",
          stack: "three",
          data: rawData[8],
        });
        return seriseNow;
      };
      let option = {
        legend: {
          data: ["filesChange", "lineAdd", "lineDel", "issuesAdd", "issuesDel"],
          itemHeight: "5",
          textStyle: {
            fontStyle: "times new roman",
            fontSize: "10",
          },
        },
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function (params) {
            let str =
              params[0].axisValue +
              "<br /> " +
              "commiter: " +
              commiter[params[0].dataIndex]
                .replace("<", "&lt;")
                .replace(">", "&gt;") +
              "<br /> ";
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
        xAxis: {
          data: commitId,
          boundaryGap: false,
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            onZero: true,
          },
          axisPointer: {
            type: "shadow",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            inside: false,
            fontSize: 8,
            formatter: function (value) {
              if (Math.abs(value) >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          axisTick: {
            show: false,
          },
        },
        grid: {
          top: "15%",
          bottom: "5%",
          left: "5%",
          right: "5%",
          containLabel: true,
        },
        dataZoom: {
          type: "inside",
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        series: seriesInfo(),
      };
      chart.setOption(option);
    },
  },
};
</script>
<style scoped>
#commitInfo {
  height: 100%;
  width: 100%;
}
</style>