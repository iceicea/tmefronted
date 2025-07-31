<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
]);

export default {
  name: "PieChart",
  components: {
    VChart,
  },
  data() {
    return {
      option: {
        title: {
          text: "分数和级别",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc",
          },
        },
        tooltip: {
          trigger: "item",
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
  {
    name: "分数",
    type: "pie",
    radius: "55%",
    center: ["50%", "50%"],
    data: [
      {
        value: 335,
        name: "用户影响分",
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: '#4f8cff' },
              { offset: 1, color: '#a259ff' }
            ]
          }
        }
      },
      {
        value: 310,
        name: "立场得分",
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: '#6a93ff' },
              { offset: 1, color: '#b266ff' }
            ]
          }
        }
      },
      {
        value: 274,
        name: "传播扩散分",
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: '#7f9cff' },
              { offset: 1, color: '#c17cff' }
            ]
          }
        }
      }
    ].sort(function (a, b) {
      return a.value - b.value;
    }),
    roseType: "radius",
    label: {
      color: "rgba(255, 255, 255, 0.7)",
    },
    labelLine: {
      lineStyle: {
        color: "rgba(255, 255, 255, 0.3)",
      },
      smooth: 0.2,
      length: 10,
      length2: 20,
    },
    // itemStyle: { // 不要全局 color，否则会覆盖单独设置
    //   color: "#c23531",
    //   shadowBlur: 200,
    //   shadowColor: "rgba(0, 0, 0, 0.5)",
    // },
    animationType: "scale",
    animationEasing: "elasticOut",
    animationDelay: function (idx) {
      return Math.random() * 200;
    },
  },
],
      },
    };
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
