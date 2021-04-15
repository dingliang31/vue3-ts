<template>
	<div class="map" ref="mapRef"></div>
</template>

<script lang="ts">
	import * as echarts from 'echarts'
	import { ref, reactive, computed, onMounted, nextTick } from 'vue'
	import { useRouter } from 'vue-router'
	import { request } from '@/utils/request'
	import { Ref } from '@vue/reactivity';
	import { getMapOption } from '@/views/Map/MapOption';
	import axios from 'axios'
	import { EChartsType } from 'echarts/types/dist/echarts';

	const mapDeep: {
	  [key: string]: string
	} = {
    '哈尔滨市' :'230100',
    '齐齐哈尔市' :'230200',
    '鸡西市' :'230300',
    '鹤岗市' :'230400',
    '双鸭山市' :'230500',
    '大庆市' :'230600',
    '伊春市' :'230700',
    '佳木斯市' :'230800',
    '七台河市' :'230900',
    '牡丹江市' :'231000',
    '黑河市' :'231100',
    '绥化市' :'231200',
    '大兴安岭地区' :'232700'
	};
	export default {
		name: 'Map',
		props: {},
		emits: [],
		/**
     * setup函数的执行时机是在beforeCreate和created之间
     * 由于setup执行时机是在created之间，所以组件才刚刚被创建，而data和methods还没初始化好，所以无法在setup中使用data和methods
     * setup中this指向undefined
     * setup只能是同步的，不能是异步的
		 * @param props 接收来的props对象，可以通过watchEffect监视其变化
		 * @param context 含attrs，slots，emit三个属性
		 */
		setup(props: any, context: any) {
			let mapRef: Ref = ref()
			let mapChart: EChartsType
			onMounted(() => {
				mapChart = echarts.init(mapRef.value)
        initChart()
			})
			const chartClick = (param: any) => {
			  const code: string | undefined = mapDeep[param.name]
				code ? initChart(code) : initChart()
      }
      const initChart = (code: string = '230000') => {
        fetchJson(code).then((res: any) => {
          // @ts-ignore
          echarts.registerMap('heilongjiang', res)
          const option = getMapOption()
          option.series[0].data = res.features.map((it: any) => {
            return {
              name: it.properties.name,
              value: 0
            }
          })
					option.series[0].zoom = 1
          mapChart.setOption(option, true)
          mapChart.off().on('click', chartClick)
					window.onresize = () => {
            mapChart.setOption(option, true)
          }
        })
			}
			const fetchJson = (code: string = '230000') => {
				return new Promise((resolve, reject) => {
					axios.get(`/json/hlj/${code}.json`, {}).then((res: any) => {
						resolve(res.data)
					}).catch((error) => {
						reject(error)
					})
				})
			}
			return {
				mapRef
			}
		}
	}
</script>

<style lang="stylus">
	.map {
		width: 100%;
		height: 100%;
	}
</style>
