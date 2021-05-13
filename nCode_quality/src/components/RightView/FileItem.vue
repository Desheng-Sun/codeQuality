<template>
  <div id="fileinfo">
    <div id="fileitem">
      <div id="fileitemtitle">FileItem</div>
    </div>
    <div id="codeDetial">
      <div id="codequality">
        <filequality :cfileInfo="fileInfo"></filequality>
      </div>
      <div id="codeinfo">
        <codeinfo :cfilename="filename"></codeinfo>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import codeinfo from "./codeinfo";
import filequality from "./fileQuality";

export default {
  components: {
    codeinfo,
    filequality,
  },
  data() {
    return {
      filename: [],
      fileInfo: [],
    };
  },
  computed: {
    nowid() {
      return this.$store.state.commitId;
    },
  },
  watch: {
    nowid() {
      this.$axios({
        method: "get",
        url: "/commitFilePath",
        params: {
          commitId: this.nowid,
        },
      })
        .then((res) => {
          let svg = d3.select("#fileitem");
          svg.selectAll("*").remove();
          let rawData = res.data;
          this.drawFileItem(rawData);
        })
        .catch((reason) => {
          console.log(reason);
        });
    },
  },
  mounted() {
    this.$axios({
      method: "get",
      url: "/commitFilePath",
      params: {
        commitId: this.nowid,
      },
    })
      .then((res) => {
        let rawData = res.data;
        this.drawFileItem(rawData);
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  methods: {
    drawFileItem(data) {
      var width = 150,
        barHeight = 20,
        barWidth = 130;

      var i = 0,
        duration = 200,
        root;

      var diagonal = d3
        .linkHorizontal()
        .x(function (d) {
          return d.y;
        })
        .y(function (d) {
          return d.x;
        });

      var svg = d3
        .select("#fileitem")
        .append("svg")
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0" + "," + 20 + ")");

      // Toggle children on click.
      let click = (d) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          this.filename = [d.data.path, data.nowCommitId];
          this.fileInfo = [
            d.data.path,
            data.nowCommitId,
            data.lastCommitId,
            d.data.IsFileChange,
          ];
          d.children = d._children;
          d._children = null;
        }
        update(d);
      };

      let color = (d) => {
        return d._children
          ? "rgb(35, 203, 167)"
          : d.children
          ? "rgb(123, 239, 178)"
          : "rgb(232, 232, 232)";
      };

      let update = (source) => {
        // Compute the flattened node list.
        var nodes = root.descendants();

        var height = Math.max(500, nodes.length * barHeight + 40);

        d3.select("svg").transition().duration(duration).attr("height", height);

        d3.select(self.frameElement)
          .transition()
          .duration(duration)
          .style("height", height + "px");

        // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
        var index = -1;
        root.eachBefore(function (n) {
          n.x = ++index * barHeight;
          n.y = n.depth * 2;
        });

        // Update the nodes…
        var node = svg.selectAll(".node").data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

        var nodeEnter = node
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", function (d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
          })
          .style("opacity", 0);

        // Enter any new nodes at the parent's previous position.
        nodeEnter
          .append("rect")
          .attr("y", -barHeight / 2)
          .attr("height", barHeight)
          .attr("width", barWidth)
          .style("fill", color)
          .on("click", click);

        nodeEnter
          .append("text")
          .attr("dy", 3.5)
          .attr("dx", 5.5)
          .text(function (d) {
            return d.data.name;
          })
          .style("fill", function (d) {
            if (d.data.IsIssuesChange == "True") {
              return "rgb(226, 106, 106)";
            } else if (d.data.IsFileChange == "True") {
              return "rgb(250, 190, 88)";
            } else if (d.data.IsIssuesIn == "True") {
              return "rgb(92, 151, 191)";
            } else {
              return "gray";
            }
          });
        nodeEnter
          .append("text")
          .attr("dy", 3.5)
          .attr("dx", function (d) {
            return -d.y;
          })
          .text(function (d) {
            return d.depth + 1;
          });

        // Transition nodes to their new position.
        nodeEnter
          .transition()
          .duration(duration)
          .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
          })
          .style("opacity", 1);

        node
          .transition()
          .duration(duration)
          .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
          })
          .style("opacity", 1)
          .select("rect")
          .style("fill", color);

        // Transition exiting nodes to the parent's new position.
        node
          .exit()
          .transition()
          .duration(duration)
          .attr("transform", function (d) {
            return "translate(" + source.y + "," + source.x + ")";
          })
          .style("opacity", 0)
          .remove();

        // // Update the links…
        // var link = svg.selectAll(".link").data(root.links(), function (d) {
        //   return d.target.id;
        // });

        // // Enter any new links at the parent's previous position.
        // link
        //   .enter()
        //   .insert("path", "g")
        //   .attr("class", "link")
        //   .attr("d", function (d) {
        //     var o = { x: source.x0, y: source.y0 };
        //     return diagonal({ source: o, target: o });
        //   })
        //   .transition()
        //   .duration(duration)
        //   .attr("d", diagonal);

        // // Transition links to their new position.
        // link.transition().duration(duration).attr("d", diagonal);

        // // Transition exiting nodes to the parent's new position.
        // link
        //   .exit()
        //   .transition()
        //   .duration(duration)
        //   .attr("d", function (d) {
        //     var o = { x: source.x, y: source.y };
        //     return diagonal({ source: o, target: o });
        //   })
        //   .remove();

        // Stash the old positions for transition.
        root.each(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      };

      root = d3.hierarchy(data);
      root.x0 = 0;
      root.y0 = 0;
      update(root);
    },
  },
};
</script>
<style>
#fileinfo {
  width: 100%;
  height: 100%;
  display: inline-block;
}

#fileitem {
  width: 150px;
  height: 100%;
  display: inline-block;
  font-size: 8px;
  overflow-y: auto;
  overflow-x: hidden;
}
#fileitem::-webkit-scrollbar {
  width: 2px;
  opacity: 0;
}
#fileitem::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  display: none;
}
#fileitem::-webkit-scrollbar-track {
  opacity: 1;
}

#fileitemtitle {
  width: 150px;
  height: 15px;
  font-size: 15px;
  font-family: "Times New Roman", Times, serif;
  text-align: center;
  text-align: left;
  padding-bottom: 5px;
  color: darkgray;
}
#codeDetial {
  width: 430px;
  height: 100%;
  display: inline-block;
  position: absolute;
}

#codequality {
  width: 430px;
  height: 75px;
}

#codeinfo {
  width: 430px;
  height: 900px;
}
.node text {
  pointer-events: none;
}

.link {
  fill: none;
  stroke: #9ecae1;
  stroke-width: 1.5px;
}

.node rect {
  /* 矩形外框*/
  cursor: pointer;
  fill: #fff;
  fill-opacity: 0.5;
  stroke: white;
  stroke-width: 0.5px;
}
</style>

