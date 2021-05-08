<template>
  <div id="App">
    <div id="titleBox">
      <p id="title">面向开发团队的代码质量可视分析系统</p>
    </div>
    <!-- 视图部分 -->
    <div id="content">
      <!--绘制左边的三个视图 -->
      <div id="leftView">
        <div id="topView">
          <!--绘制打包图 -->
          <div id="Top-LeftView">
            <div id="Top-Left-TopView">
              <PackingView></PackingView>
            </div>
            <div id="Top-Left-BottomView"></div>
          </div>
          <!--绘制主视图 -->
          <div id="MainView">
            <UserInfo></UserInfo>
          </div>
        </div>
        <!--绘制散点图 -->
        <div id="BottomView">
          <ScatterView></ScatterView>
        </div>
      </div>
      <!--绘制右边的一个视图 -->
      <div id="rightView">
        <FileItem></FileItem>
      </div>
    </div>
  </div>
</template>

<script>
import ScatterView from "@/components/BottomView/ScatterView.vue";
import PackingView from "@/components/LeftView/PackingView.vue";
import FileItem from "@/components/RightView/FileItem.vue";
import UserInfo from "./components/MainView/userinfo.vue";
export default {
  name: "App",
  components: {
    ScatterView,
    PackingView,
    FileItem,
    UserInfo,
  },
};
</script>

<style lang = "scss">
/* 隐藏滚动条 */
html,
body {
  margin: 0;
  padding: 0;
  width: 2048px;
  height: 1038px;
  min-width: 960px;
  transform-origin: 0 0 0; /*指定缩放的基本点*/
  -moz-transform-origin: 0 0 0;
  -ms-transform-origin: 0 0 0;
  -webkit-transform-origin: 0 0 0;
  -o-transform-origin: 0 0 0;
  overflow: hidden;
  background-color: #e3e3e3;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#titleBox {
  margin-top: 0.1cm;
  margin-left: 0.1cm;
  margin-right: 0.1cm;
  text-align: center;
  height: 50px;
  background-color: rgb(255, 255, 255);
}

#content {
  width: 2048px;
  height: 975px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0;
  margin-top: 0.1cm;
}

#title {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
  font-size: 30px;
  width: 100%;
  float: midd;
}

#letfView {
  width: 1400px;
  height: 975px;
}

#topView {
  margin-left: 0.1cm;
  width: 1450px;
  height: 700px;
}

#Top-LeftView {
  width: 525px;
  height: 700px;
  display: inline-block;
}

#Top-Left-TopView {
  width: 525px;
  height: 500px;
  background-color: rgb(255, 255, 255);
}

#Top-Left-BottomView {
  width: 525px;
  height: 196px;
  background-color: rgb(255, 255, 255);
  margin-top: 0.1cm;
}

#MainView {
  width: 920px;
  height: 700px;
  background-color: rgb(255, 255, 255);
  display: inline-block;
}
#BottomView {
  width: 1450px;
  height: 271.5px;
  background-color: rgb(255, 255, 255);
  margin-left: 0.1cm;
  margin-top: 0.1cm;
}

#rightView {
  width: 598px;
  height: 975px;
  background-color: rgb(255, 255, 255);
  margin-left: 0.1cm;
  margin-right: 0.1cm;
}
</style>
