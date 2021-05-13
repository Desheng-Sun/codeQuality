<template>
  <div id="filequalityinfo"></div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    cfileInfo: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      useData: [],
    };
  },
  watch: {
    cfileInfo() {
      this.$axios({
        method: "get",
        url: "/FileQuality",
        params: {
          commitId: this.cfileInfo[1],
        },
      })
        .then((res) => {
          this.useData.push(res.data);
          this.$axios({
            method: "get",
            url: "/FileQuality",
            params: {
              commitId: this.cfileInfo[2],
            },
          })
            .then((res) => {
              this.useData.push(res.data);
              this.codequalityInfo(this.useData);
            })
            .catch((reason) => {
              console.log(reason);
            });
        })
        .catch((reason) => {
          console.log(reason);
        });
    },
  },
  methods: {
    codequalityInfo(rawData) {
      let chart = echarts.init(document.getElementById("filequalityinfo"));
      let codeQualityType = rawData[0].codeQualityType;
      let infoName = rawData[0].codeQualityInfoName;
      let filepathUse = this.cfileInfo[0];
      let qualityData = [];
      let color = [
        "rgba(92, 151, 191,0.8)",
        "rgba(250, 190, 88,0.8)",
        "rgba(35, 203, 167,0.8)",
        "rgba(226, 106, 106,0.8)",
        "rgba(207, 0, 15,0.8)",
        "rgba(123, 239, 178,0.8)",
      ];
      for (let i in rawData) {
        let datanow = rawData[i].data;
        let filepathNow = rawData[i].filePath;
        let filepathNum = -1;
        for (let j in filepathNow) {
          if (filepathNow[j] == filepathUse) {
            filepathNum = j;
            break;
          }
        }
        for (let j in datanow) {
          if (datanow[j][0] == filepathNum) {
            qualityData.push(datanow[j]);
          }
        }
      }
      let finalUseData = qualityData.map(function (item, index) {
        if (index % 6 == 0 || index % 6 == 3 || index % 6 == 5) {
          return [index % 6, parseInt(index / 6), item[2]];
        } else if (index % 6 == 1 || index % 6 == 4) {
          return [index % 6, parseInt(index / 6), item[4]];
        } else if (index % 6 == 2) {
          return [index % 6, parseInt(index / 6), item[5]];
        }
      });
      let yAxisData = [this.cfileInfo[1], this.cfileInfo[2]];
      if (this.cfileInfo[3] == "False") {
        yAxisData = [this.cfileInfo[1]];
        finalUseData = finalUseData.slice(0, 6);
      }
      let seriesInfo = () => {
        let seriesNow = [];
        for (let i in codeQualityType) {
          let usedatanow = [];
          for (let j in finalUseData) {
            if (finalUseData[j][0] == i) {
              usedatanow.push(finalUseData[j]);
            }
          }
          seriesNow.push({
            name: codeQualityType[i],
            type: "scatter",
            symbolSize: function (val) {
              if (finalUseData[parseInt(val[0])][2] == 0) {
                if (val[2] == finalUseData[parseInt(val[0])][2]) {
                  return 10;
                } else {
                  return 15;
                }
              }
              let size =
                (val[2] / finalUseData[parseInt(val[0])][2]) * 100 + 100;
              size = Math.sqrt(size);
              return size;
            },
            color: color[i],
            data: usedatanow,
          });
        }
        console.log(seriesNow);
        return seriesNow;
      };
      console.log(yAxisData);
      let option = {
        legend: {
          show: false,
          data: codeQualityType,
        },
        tooltip: {
          formatter: function (params) {
            console.log(params);
            let str = codeQualityType[params.value[0]] + ": <br />";
            for (let i in infoName[params.value[0]]) {
              str =
                str +
                infoName[params.value[0]][i] +
                " : " +
                qualityData[params.dataIndex * 6 + params.value[0]][
                  parseInt(i) + 2
                ] +
                "<br />";
            }
            return str;
          },
          position: function (point, params, dom, rect, size) {
            return [point[0], "10%"];
          },
        },
        grid: {
          top: "0%",
          left: "20%",
          bottom: "0%",
          right: "10%",
        },
        xAxis: {
          type: "category",
          data: codeQualityType,
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
          data: yAxisData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        dataZoom: {
          type: "inside",
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        series: seriesInfo(),
      };
      console.log(option);
      chart.setOption(option);
      this.useData = [];
    },
  },
};
</script>
<style scoped>
/* 设置页面的大小、文字 */
#filequalityinfo {
  width: 430px;
  height: 75px;
}
</style>
