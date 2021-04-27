<template>
  <div id="packingView"></div>
</template>

<script>
import echarts from "echarts";
import * as d3 from "d3";
export default {
  computed: {
    nowid() {
      return this.$store.state.commit_id;
    },
  },
  watch: {
    nowid() {
      console.log(this.nowid);
      this.$axios({
        method: "get",
        url: "/userissueCountNum",
        params: {
          commit_id: this.nowid,
        },
      })
        .then((res) => {
          let rawData = res.data;
          rawData = this.prepareData(rawData);
          this.drawPackingTop(rawData.seriesData, rawData.maxDepth);
        })
        .catch((reason) => {
          console.log(reason);
        });
    },
  },
  mounted() {
    this.$axios({
      method: "get",
      url: "/userissueCountNum",
      params: {
        commit_id: this.nowid,
      },
    })
      .then((res) => {
        let rawData = res.data;
        rawData = this.prepareData(rawData);
        this.drawPackingTop(rawData.seriesData, rawData.maxDepth);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  methods: {
    prepareData(rawData) {
      return {
        seriesData: rawData["seriesdata"],
        maxDepth: rawData["maxDepth"],
      };
    },
    drawPackingTop(seriesData, maxDepth) {
      let chart = echarts.init(document.getElementById("packingView"));
      let displayRoot = stratify();
      function stratify() {
        return d3
          .stratify()
          .parentId(function (d) {
            return d.id.substring(0, d.id.lastIndexOf(" -> "));
          })(seriesData)
          .sum(function (d) {
            return d.value || 0;
          })
          .sort(function (a, b) {
            return b.value - a.value;
          });
      }

      function overallLayout(params, api) {
        let context = params.context;
        d3
          .pack()
          .size([api.getWidth() - 2, api.getHeight() - 2])
          .padding(3)(displayRoot);

        context.nodes = {};
        displayRoot.descendants().forEach(function (node, index) {
          context.nodes[node.id] = node;
        });
      }

      function renderItem(params, api) {
        let context = params.context;

        // Only do that layout once in each time `setOption` called.
        if (!context.layout) {
          context.layout = true;
          overallLayout(params, api);
        }

        let nodePath = api.value("id");
        let node = context.nodes[nodePath];

        if (!node) {
          // Reder nothing.
          return;
        }

        let isLeaf =
          (!node.children || !node.children.length) && node.depth == 5;

        let focus = new Uint32Array(
          node.descendants().map(function (node) {
            return node.data.index;
          })
        );
        let nodeName = isLeaf
          ? nodePath
              .slice(nodePath.lastIndexOf(" -> ") + 1)
              .split(/(?=[A-Z][^A-Z])/g)
              .join("\n")
              .replace("-> ", "")
          : "";

        let z2 = api.value("depth") * 2;
        return {
          type: "circle",
          focus: focus,
          shape: {
            cx: node.x,
            cy: node.y,
            r: node.r,
          },
          transition: ["shape"],
          z2: z2,
          textContent: {
            type: "text",
            style: {
              // transition: isLeaf ? 'fontSize' : null,
              text: nodeName,
              fontFamily: "Arial",
              width: node.r * 1.3,
              overflow: "truncate",
              fontSize: node.r / 3,
            },
            emphasis: {
              style: {
                overflow: null,
                fontSize: Math.max(node.r / 3, 12),
              },
            },
          },
          textConfig: {
            position: "inside",
          },
          style: {
            text: nodeName,
            fill: api.visual("color"),
            fontFamily: "Arial",
            width: node.r * 1.3,
            overflow: "truncate",
            fontSize: node.r / 3,
          },
          emphasis: {
            style: {
              fontFamily: "Arial",
              fontSize: 5,
              shadowBlur: 20,
              shadowOffsetX: 3,
              shadowOffsetY: 5,
              shadowColor: "rgba(0,0,0,0.3)",
            },
          },
        };
      }

      let option = {
        dataset: {
          source: seriesData,
        },
        tooltip: {},
        visualMap: {
          show: false,
          min: 0,
          max: maxDepth,
          dimension: "depth",
          inRange: {
            color: ["#006edd", "rgb(81, 172, 254)"],
          },
        },
        hoverLayerThreshold: Infinity,
        series: {
          type: "custom",
          renderItem: renderItem,
          progressive: 0,
          coordinateSystem: "none",
          encode: {
            tooltip: "value",
            itemName: "id",
          },
        },
      };

      chart.setOption(option);
      if ((chart._$handlers = {})) {
        chart.on("click", function (params) {
          drillDown(params.data.id);
        });

        function drillDown(targetNodeId) {
          displayRoot = stratify();
          if (targetNodeId != null) {
            displayRoot = displayRoot.descendants().find(function (node) {
              return node.data.id === targetNodeId;
            });
          }
          // A trick to prevent d3-hierarchy from visiting parents in this algorithm.
          displayRoot.parent = null;

          chart.setOption({
            dataset: {
              source: seriesData,
            },
          });
        }

        // Reset: click on the blank area.
        chart.getZr().on("click", function (event) {
          if (!event.target) {
            drillDown();
          }
        });
      }
    },
  },
};
</script>