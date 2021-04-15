<template>
	<div id="mapChart" ref="amapRef"/>
</template>

<script lang="ts">
  import * as echarts from 'echarts'
  import { ref, reactive, computed, onMounted, nextTick } from 'vue'
  import { Ref } from '@vue/reactivity';
  import axios from 'axios'
	import { pjPoint } from './MapChartOption'

	export default {
    name: 'MapChart',
    props: {},
    emits: [],
		setup(props: any, context: any) {
			const amapRef: Ref = ref()
			let mapChart: any
      onMounted(() => {
        console.log(props, context, this)
        const initAMap = (mapChart: any) => {
          const data: any[] = pjPoint.data
          let markContent: string = `
						<div class="custom-content-marker" style="z-index: 99;">
							<img style="display: inline-block;width: 70px; height: 70px;" src="/images/amapNow.png">
						</div>
					`
          const option = {
            zoom: 12,
            // resizeEnable: true,
            center: [data[0].lng * 1, data[0].lat * 1]
          }
          mapChart = new AMap.Map('mapChart', option)
          let infoWindow: any = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })
          let marker: any
          for (let i = 0; i < data.length; i++) {
            marker = new AMap.Marker({
              position: [data[i].lng * 1, data[i].lat * 1],
              content: markContent,
              offset: new AMap.Pixel(-35, -35),
              map: mapChart
            })
            marker.content = `<div style="line-height: 1.5; width: 280px">`
            marker.content += `<h3>Msg</h3>`
            marker.content += `</div>`
            marker.on('mouseover', infoOpen(infoWindow, mapChart));
            // 注释 后打开地图时默认关闭信息窗体
            // marker.emit('mouseover', {target: marker});
            marker.on('mouseout', infoClose(infoWindow, mapChart));
            marker.on('click', newMAp(infoWindow, mapChart, data));
          }
        }
        const infoOpen = (infoWindow: any, mapChart: any) => {
          return (e: any) => {
            infoWindow.setContent(e.target.content);
            infoWindow.open(mapChart, e.target.getPosition());
          }
        }
        const infoClose = (infoWindow: any, mapChart: any) => {
          return (e: any) => {
            infoWindow.close(mapChart, e.target.getPosition());
          }
        }
        const newMAp = (infoWindow: any, mapChart: any, data: any[]) => {
          return (e: any) => {
            mapChart.setCenter(e.target.getPosition());
            // map.setZoomAndCenter(12, e.target.getPosition());
            infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(30, -30) });
            infoWindow.setContent(e.target.content);
            infoWindow.open(mapChart, e.target.getPosition());
          }
        }
        initAMap(mapChart)
      })
			return {
        amapRef
			}
		}
	}
</script>

<style lang="stylus">
	#mapChart
		width: 100%;
		height: 100%;
	.amap-marker {
		width 70px
		height 70px
		.amap-marker-content {
			width 70px
			height 70px
			position absolute
			left 0px
			top 0px
			.custom-content-marker {
				width 70px
				height 70px
				position absolute
				left 0px
				top 0px
				&>img {
					position absolute
					left 0px
					top 0px
				}
			}
		}
	}
</style>
