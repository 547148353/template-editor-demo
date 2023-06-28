/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
const clickOutside = {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 如果是元素本体则返回
      if (el.contains(e.target)) return false
      if (binding.expression) {
        // 有绑定函数，则执行\
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = documentHandler
    document.addEventListener('mousedown', documentHandler)
  },

  unbind(el) {
    document.removeEventListener('mousedown', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
}
export default clickOutside
