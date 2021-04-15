
export function getMapOption(name = 'heilongjiang') {
  return {
    tooltip: {
      show: true,
      trigger: 'item',
      alwaysShowContent: false,
      backgroundColor: 'rgba(50,50,50,0.7)',
      hideDelay: 100,
      triggerOn: 'mousemove',
      enterable: true,
      formatter (params: any, ticket: any, callback: any) {
        return '<span style="color: #fff">地区：' + params.name + '</span><br/>'
      },
    },
    visualMap: {
      min: 0,
      max: 500,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['lightskyblue', 'yellow', 'orangered'],
      },
    },
    series: [
      {
        type: 'map',
        map: name,
        roam: true,
        zoom: 1,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#2c3e50',
            },
          },
          emphasis: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        itemStyle: {
          normal: {
            borderColor: '#91e6ff',
            areaColor: '#87CEFA',
            borderWidth: 0,
            shadowColor: '#3c3c3c',
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10,
          },
          emphasis: {
            areaColor: '#0e8ee9',
            borderWidth: 0,
          },
        },
        data: [],
      },
    ],
  }
}

