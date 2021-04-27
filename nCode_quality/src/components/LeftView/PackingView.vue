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
      url: "/commit_baseinfo",
    }).then((res) => {
        let rawData = res.data;
        this.drawPackingView(rawData);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  methods: {
    drawPackingView(rawData) {
      let chart = echarts.init(document.getElementById("timeline"));
      let project_time = rawData[0];
      let option = {
        timeline: {
          data: project_time,
          axisType: "category",
          autoPlay: false,
          playInterval: 1500, //播放速度
          realtime: false,
          left: "5%",
          right: "5%",
          bottom: "0%",
          width: "90%",
          //  height: null,
          label: {
            normal: {
              textStyle: {
                color: "red",
              },
            },
            emphasis: {
              textStyle: {
                color: "red",
              },
            },
          },
          symbolSize: 10,
          lineStyle: {
            color: "#red",
          },

          controlStyle: {
            showNextBtn: true,
            showPrevBtn: true,
            normal: {
              color: "#ff8800",
              borderColor: "#ff8800",
            },
            emphasis: {
              color: "red",
              borderColor: "red",
            },
          },
        },
      };
      chart.setOption(option);
      chart.on("timelinechanged", (timelineIndex) => {
        this.$store.commit('setcommit_id', {
          newid: project_time[timelineIndex.currentIndex]
        })
      })

    },
  },
};
</script>

<style>
#packing {
  width: 100%;
  height: 100%;
}
#packingView{
  width: 100%;
  height: 400px;
}
#timeline{
  width: 100%;
  height: 100px;
}
</style>
