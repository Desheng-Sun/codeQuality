<template>
  <div id="ScatterView"></div>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    this.$axios({
      method: "get",
      url: "/commitinfo_SonarQube",
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
      let commit_Hash = rawData.commit_Hash;
      commit_Hash = rawData.commit_Hash;
      let commit_name = rawData.commit_name;
      let date = rawData.date;
      let info_name = rawData.commitinfo_name;
      let data = rawData.data;
      let usedata = data.map(function (item) {
        if (item[1] == 0 || item[1] == 4) {
          return [item[0], item[1], item[2]];
        } else if (item[1] == 1) {
          return [item[0], item[1], item[4]];
        } else if (item[1] == 2 || item[1] == 3) {
          return [item[0], item[1], item[5]];
        } else if (item[1] == 5) {
          return [item[0], item[1], item[3]];
        }
      });

      let option = {
        title: {
          text: "Punch Card of Github",
        },
        legend: {
          data: ["Punch Card"],
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            let str = commit_name[params.value[1]] + ": \n";
            for (let i in info_name[params.value[1]]) {
              str =
                str +
                info_name[params.value[1]][i] +
                " : " +
                data[params.dataIndex][parseInt(i) + 2] +
                "\n";
            }
            return str;
          },
        },
        grid: {
          left: 2,
          bottom: 10,
          right: 10,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: commit_Hash,
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
          data: commit_name,
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
            top: "93%",
            bottom: "1%",
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: "Punch Card",
            type: "scatter",
            symbolSize: function (val) {
              let size =
                (val[2] /
                  usedata[parseInt(usedata.length) + parseInt(val[1]) - 6][2]) *
                100;
              size = Math.sqrt(size);
              return size;
            },
            data: usedata,
          },
        ],
      };
      chart.setOption(option);
    },
  },
};
</script>

<style>
#ScatterView {
  width: 100%;
  height: 100%;
}
</style>
