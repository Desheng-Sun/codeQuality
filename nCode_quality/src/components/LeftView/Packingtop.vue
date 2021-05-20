<template>
  <div id="packingView">
    <div id="pakingViewTitle">Commiter Code Quality Issues</div>
    <div id="pakingViewdraw"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import * as d3 from "d3";
export default {
  computed: {
    nowid() {
      return this.$store.state.commitId;
    },
  },
  watch: {
    nowid() {
      console.log(this.nowid);
      this.$axios({
        method: "get",
        url: "/userissueCount",
        params: {
          commitId: this.nowid,
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
      url: "/userissueCount",
      params: {
        commitId: this.nowid,
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
      let chart = echarts.init(document.getElementById("pakingViewdraw"));
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
      let name = [
        "commiter",
        "issuesAdd",
        "issuesDel",
        "CRITICAL",
        "BLOCKER",
        "MAJOR",
        "MINOR",
        "INFO",
        "BUG",
        "VULNERABILITY",
        "CODE_SMELL",
        "IssuesRule",
      ];
      let color = [
        ["rgba(236, 100, 75,0.5)", "rgba(123, 239, 178,0.5)"],
        [
          "rgba(207, 0, 15, 0.5)",
          "rgba(159, 90, 253, 0.5)",
          "rgba(242, 120, 75, 0.5)",
          "rgba(82, 179, 217, 0.5)",
          "rgba(200, 247, 197, 0.5)",
        ],
        [
          "rgba(244,67,54, 0.5)",
          "rgba(255, 255, 126, 0.5)",
          "rgba(135, 211, 124, 0.5)",
        ],
      ];
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
        let colornow = "";
        let namenow = "";
        let nodeitem = nodePath.split("->");
        nodeitem = nodeitem[nodeitem.length - 1].trim();

        if (node.depth == 0) {
          colornow = "rgba(255, 255, 126, 0.5)";
        } else if (node.depth == 1) {
          colornow = "rgba(255, 236, 139, 0.5)";
        } else if (node.depth == 2) {
          if (nodeitem == "issuesAdd") {
            colornow = color[0][0];
            namenow = name[0]
          } else {
            colornow = color[0][1];
            namenow = name[1]
          }
        } else if (node.depth == 3) {
          if (nodeitem == "CRITICAL") {
            colornow = color[1][0];
            namenow = name[2]
          } else if (nodeitem == "BLOCKER") {
            colornow = color[1][1];
            namenow = name[3]
          } else if (nodeitem == "MAJOR") {
            colornow = color[1][2];
            namenow = name[4]
          } else if (nodeitem == "MINOR") {
            colornow = color[1][3];
            namenow = name[5]
          } else if (nodeitem == "INFO") {
            colornow = color[1][4];
            namenow = name[6]
          }
        } else if (node.depth == 4) {
          if (nodeitem == "BUG") {
            colornow = color[2][0];
            namenow = name[7]
          } else if (nodeitem == "VULNERABILITY") {
            colornow = color[2][1];
            namenow = name[8]
          } else if (nodeitem == "CODE_SMELL") {
            colornow = color[2][2];
            namenow = name[9]
          }
        } else {
          colornow = "rgba(244,244,244)";
        }
        return {
          type: "circle",
          name: namenow,
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
            fill: colornow,
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
        tooltip: {
          position: function (point, params, dom, rect, size) {
            return [point[0], point[1]];
          },
        },
        legend:{
          data:name,
          left:0,
          bottom:0,
          top:0
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
        chart.on("click", (params) => {
          drillDown(params.data.id);
          let RulesKey = params.data.id.split("->");
          RulesKey = RulesKey[RulesKey.length - 1].trim();
          this.$store.commit("setIssues", {
            newIssues: ["", this.nowid, RulesKey],
          });
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
<style scoped>
#pakingViewTitle {
  width: 525px;
  height: 25px;
  font-size: 25px;
  font-family: "Times New Roman", Times, serif;
  text-align: left;
  color: darkgray;
  padding-bottom: 5px;
}
#pakingViewdraw {
  width: 525px;
  height: 420px;
}
</style>