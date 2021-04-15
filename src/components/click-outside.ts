import { ObjectDirective } from 'vue'

let handleClick: any = (el: any, binding: any, vnode?: any) => {
  return ($evt: any) => {
    // 火狐支持
    // if (el.compareDocumentPosition) {
    //   console.log(el.compareDocumentPosition($evt.target)&16)
    // }

    const bool: boolean | number | null = el.contains ? el.contains($evt.target) : el.compareDocumentPosition ? el.compareDocumentPosition($evt.target) : null
    if (Boolean(bool)) return
    if (binding.value) { // 假如是function
      binding.value()
    } else {
      binding.instance.show = false
    }
  }
}
let rtFn: any
const clickOutside: ObjectDirective = {
  /**
  * @param el 绑定指令的 dom
  * @param binding vue 实例
  * @param vnode
  */
  beforeMount(el, binding, vnode) {
    rtFn = handleClick(el, binding, vnode)
    window.addEventListener('click', rtFn)
  },
  unmounted(el, binding, vnode, prevVNode) {
    window.removeEventListener('click', rtFn)
  }
}
export default clickOutside
