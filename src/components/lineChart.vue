<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

export default {
  name: "LineChart",
  components: {
    VChart,
  },
  data() {
    return {
      option: {
        title: {
          text: "传播趋势",
          left: "center",
          top: 20,
          textStyle: {
            color: "#e0e6f6",
            fontWeight: "bold",
            fontSize: 18,
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(40,45,60,0.95)",
          borderColor: "#6c7ae0",
          textStyle: {
            color: "#e0e6f6",
          },
        },
        legend: {
          data: ["声量"],
          top: 50,
          textStyle: {
            color: "#bfc6d9",
          },
        },
        grid: {
          left: "6%",
          right: "6%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["7-22", "7-23", "7-24", "7-25", "7-26", "7-27", "7-28"],
          axisLine: {
            lineStyle: {
              color: "#bfc6d9",
            },
          },
          axisLabel: {
            color: "#d3d7e9",
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
              color: "#bfc6d9",
            },
          },
          axisLabel: {
            color: "#d3d7e9",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(180,200,255,0.08)",
            },
          },
        },
        series: [
          {
            name: "声量",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            data: [60, 65, 70, 80, 78, 75, 82],
            lineStyle: {
              color: "#6c7ae0",
              width: 3,
            },
            itemStyle: {
              color: "#6c7ae0",
              borderColor: "#fff",
              borderWidth: 2,
            },
            areaStyle: {
              color: "rgba(108,122,224,0.15)",
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