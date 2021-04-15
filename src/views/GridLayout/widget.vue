<template>
  <div class="widget" @mouseenter="onMouseenter" @mouseover="onMouseover" @mouseout="onMouseout">
    <div class="title" :title="data.name">{{ data.name }}</div>
  </div>
</template>

<script>

export default {
  name: 'Widget',
  props: {
    data: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    defaultTop: {
      type: Number,
      default: 0
    },
    scrollTop: {
      type: Number,
      default: 0
    }
  },
  methods: {
    setPosition (x, y, show) {
      const { offsetWidth, offsetHeight } = this.$el
      // this.updatePortletItemAddStyle({
      //   x,
      //   y,
      //   width: offsetWidth,
      //   height: offsetHeight,
      //   opacity: show ? 1 : 0
      // })
    },
    onMouseenter() {
      this.$emit('mouse-enter')
    },
    onMouseover () {
      if (this.disabled) return
      const { offsetLeft, offsetTop } = this.$el
      this.setPosition(offsetLeft, offsetTop + this.defaultTop - this.scrollTop, false)
    },
    onMouseout () {
      if (this.disabled) return
      this.$emit('drag-ready')
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
// @import '@/styles/element-variables.scss';

.widget {
  width: 100%;
  font-size: 14px;
  line-height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
