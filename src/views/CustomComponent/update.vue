<template>
  <div class="update">
    <input class='my_input' type="text" ref='input' @input="$emit('update:input', $event.target.value)" placeholder="请输入内容" />
  </div>
</template>

<script lang="ts">
import vue, { reactive, onMounted, toRefs, computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as pubMtd from '@/utils/publicMethods'

export default defineComponent({
  name: 'update',
  props: ['input'],
  components: {
  },
  data() {
    return { }
  },
  mounted() {
    const input: any = this.$refs.input
    input.value = this.input || ''
  },
  methods: {

  },
})
</script>

<style lang="stylus">
.update {
}
</style>
