<template>
  <div id="packing">
    <div id="packingView">
      <packingtop></packingtop>
    </div>
    <div id="timeline"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import packingtop from "./Packingtop.vue";
export default {
  components: {
    packingtop,
  },
  mounted() {
    this.$axios({
      method: "get",
      url: "/commitBaseInfo",
    })
      .then((res) => {
        let rawData = res.data;
        this.$store.commit("setcommitInfoNow", {
          newcommitInfoNow: [
            rawData[0][rawData[0].length - 1],
            rawData[1][rawData[0].length - 1],
            rawData[2][rawData[0].length - 1],
            rawData[3][rawData[0].length - 1],
          ],
        });
        this.drawPackingView(rawData);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  methods: {
    drawPackingView(rawData) {
      let chart = echarts.init(document.getElementById("timeline"));
      let projectTime = rawData[0];
      let option = {
        timeline: {
          data: projectTime,
          axisType: "category",
          autoPlay: false,
          realtime: false,
          left: "5%",
          right: "5%",
          bottom: "0%",
          width: "90%",
          symbolSize: 10,
          //  height: null,
          label: {
            normal: {
              show: true,
              color: "rgb(92, 151, 191)",
            },
          },
          lineStyle: {
            show: true,
            color: "rgb(92, 151, 191)",
          },
          itemStyle: {
            show: true,
            color: "rgb(92, 151, 191)",
          },
          controlStyle: {
            show: true,
            showPlayBtn: false,
            color: "rgb(92, 151, 191)",
            borderColor: "rgb(92, 151, 191)",
          },
          checkpointStyle: {
            symbolSize: 13,
            color: "rgb(115, 192, 222)",
            borderWidth: 2,
            borderColor: "rgb(255, 255, 138)",
          },
        },
      };
      chart.setOption(option);
      chart.on("timelinechanged", (timelineIndex) => {
        this.$store.commit("setcommitId", {
          newid: projectTime[timelineIndex.currentIndex],
        });
        this.$store.commit("setcommitInfoNow", {
          newcommitInfoNow: [
            rawData[0][timelineIndex.currentIndex],
            rawData[1][timelineIndex.currentIndex],
            rawData[2][timelineIndex.currentIndex],
            rawData[3][timelineIndex.currentIndex],
          ],
        });
      });
    },
  },
};
</script>

<style scoped>
#packing {
  width: 100%;
  height: 100%;
}
#packingView {
  width: 100%;
  height: 450px;
}
#timeline {
  width: 100%;
  height: 50px;
}
</style>
