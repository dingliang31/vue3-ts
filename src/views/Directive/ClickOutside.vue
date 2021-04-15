<template>
	<div class="click-outside" v-click-outside="otClick">
		<span class="pointer" @click="handleClick">click-outside</span>
		<div v-show="show">
			todo 消失、打开动画
		</div>
	</div>
</template>

<script lang="ts">

  import vue, { defineComponent, ref, toRefs, reactive, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import * as pubMtd from '@/utils/publicMethods.ts'
	import cOutside from '@/components/click-outside'

  export default defineComponent({
    name: 'click-outside',
    components: {
    },
		setup() {
      const cl: any = reactive({
				show: true,
        handleClick: () => {
          cl.show = true
				},
        otClick: () => {
          cl.show = false
				}
			})
      const clRef = toRefs(cl)
			return {
        ...clRef
			}
		},
		directives: {
      'click-outside': cOutside
		}
  })
</script>

<style lang="stylus">
.click-outside {

}
</style>
