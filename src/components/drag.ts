// 拖拽指令
import { ObjectDirective } from 'vue'

const drag: ObjectDirective = {
  mounted(el, binding, vnode) {
    let firstTime: number = 0
    let lastTime: number = 0
    const headerElement = el.querySelector('.drag')
    headerElement.style.cursor = 'move';
    // 获取原有CSS属性
    const elementStyle = window.getComputedStyle(headerElement)

    headerElement.onmousedown = (evt: MouseEvent) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = evt.clientX
      const disY = evt.clientY
      console.log(evt.clientX, el.offsetLeft)
      // 获取left和top的值
      const leftValue = parseFloat(elementStyle.left)
      const topValue = parseFloat(elementStyle.top)
      // console.log(leftValue, topValue)
      el.setAttribute('data-flag', false)
      firstTime = new Date().getTime()
      document.onmousemove = (e: MouseEvent) => {
        // 通过事件委托，计算移动的距离
        const moveLeft = e.clientX - disX
        const moveTop = e.clientY - disY
        console.log(moveLeft, moveTop)
        const { clientWidth, clientHeight } = el.parentNode
        // 确定移动边界
        const [minLeft, maxLeft] = [0, clientWidth - parseFloat(elementStyle.width)]
        const [minTop, maxTop] = [0, clientHeight - parseFloat(elementStyle.height)]

        const resultLeft = leftValue + moveLeft > maxLeft ? maxLeft : Math.max(...[minLeft, leftValue + moveLeft])
        const resultTop = topValue + moveTop > maxTop ? maxTop : Math.max(...[minTop, topValue + moveTop])

        // 移动当前元素
        headerElement.style.left = `${resultLeft}px`
        headerElement.style.top = `${resultTop}px`
        headerElement.style.transform = 'none'
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        //判断元素是否为点击事件
        lastTime = new Date().getTime();
        if( (lastTime - firstTime) < 200){
          el.setAttribute('data-flag', true)
        }
      }
    }
  },
  unmounted(el, binding, vnode, prevVNode) {
  }
}
export default drag