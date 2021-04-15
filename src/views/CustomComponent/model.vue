<template>
  <div class="model">
    <input class='my_input' type="text" ref='input' @input="handleInput($event)" placeholder="请输入内容" />
  </div>
</template>

<script lang="ts">

import vue, { reactive, onMounted, toRefs, computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as pubMtd from '@/utils/publicMethods'

export default defineComponent({
  name: 'model',
  modelValue: {
    prop: 'modelValue',
    event: 'valueChange'
  },
  props: {
    modelValue: String
  },
  components: {
  },
  data() {
    return { }
  },
  mounted() {
    const input: any = this.$refs.input
    input.value = this.modelValue || ''
  },
  methods: {
    handleInput($e: any) {
      console.log($e)
      this.$emit('valueChange', $e.target.value)
    }
  },
})
</script>

<style lang="stylus">
.model {

}
</style>
