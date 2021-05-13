<template>
  <div id="ScatterView"></div>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    this.$axios({
      method: "get",
      url: "/codeQualityInfo",
    })
      .then((res) => {
        let rawData = res.data;
        this.drawScatter(rawData);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  methods: {
    drawScatter(rawData) {
      let chart = echarts.init(document.getElementById("ScatterView"));
      let commitId = rawData.commitId;
      let codeQualityType = rawData.codeQualityType;
      let infoName = rawData.codeQualityInfoName;
      let data = rawData.data;
      let color = [
        "rgba(92, 151, 191,0.8)",
        "rgba(250, 190, 88,0.8)",
        "rgba(35, 203, 167,0.8)",
        "rgba(226, 106, 106,0.8)",
        "rgba(207, 0, 15,0.8)",
        "rgba(123, 239, 178,0.8)",
      ];
      let usedata = data.map(function (item) {
        if (item[1] == 0 || item[1] == 5) {
          return [item[0], item[1], item[2]];
        } else if (item[1] == 1 || item[1] == 2 || item[1] == 3) {
          return [item[0], item[1], item[3]];
        } else if (item[1] == 4) {
          return [item[0], item[1], item[6]];
        }
      });
      let seriesInfo = () => {
        let seriseNow = [];
        for (let i in codeQualityType) {
          let usedatanow = [];
          for (let j in usedata) {
            if (usedata[j][1] == i) {
              usedatanow.push(usedata[j]);
            }
          }
          seriseNow.push({
            name: codeQualityType[i],
            type: "scatter",
            symbolSize: function (val) {
              let size =
                (val[2] /
                  usedata[parseInt(usedata.length) + parseInt(val[1]) - 6][2]) *
                100;
              size = Math.sqrt(size);
              return size;
            },
            color: color[i],
            data: usedatanow,
          });
        }
        return seriseNow;
      };
      let option = {
        title: {
          text: "Code quality of each version",
          textStyle:{
            fontSize:"25",
            fontFamily:"times new roman",
            color:"darkgray",
          }
        },
        legend: {
          data: codeQualityType,
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            let str = codeQualityType[params.value[1]] + ": <br />";
            for (let i in infoName[params.value[1]]) {
              str =
                str +
                infoName[params.value[1]][i] +
                " : " +
                data[params.dataIndex*6 + params.value[1]][parseInt(i) + 2] +
                "<br />";
            }
            return str;
          },
          position: function (point, params, dom, rect, size) {
            return [point[0], "10%"];
          },
        },
        grid: {
          left: "1%",
          top:"8%",
          bottom: "10%",
          right: "1%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: commitId,
          boundaryGap: false,
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "category",
          data: codeQualityType,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: 0,
            start: 0,
            end: 100,
          },
          {
            show: true,
            xAxisIndex: 0,
            type: "slider",
            top: "90%",
            bottom: "4%",
            start: 0,
            end: 100,
          },
        ],
        series: seriesInfo(),
      };
      chart.setOption(option);
    },
  },
};
</script>

<style scoped>
#ScatterView {
  width: 100%;
  height: 100%;
}
</style>
