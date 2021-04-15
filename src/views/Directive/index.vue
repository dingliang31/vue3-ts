<template>
	<div class="directive">
		<el-tabs type="border-card">
			<el-tab-pane label="click-outside">
				<click-outside></click-outside>
			</el-tab-pane>
			<el-tab-pane label="drag">
				<drag></drag>
			</el-tab-pane>
			<el-tab-pane label="其他好用的自定义指令">
				<el-link  href="https://zhuanlan.zhihu.com/p/108308393" target="_blank">https://zhuanlan.zhihu.com/p/108308393</el-link>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">

  import vue, { reactive, onMounted, toRefs, computed, defineComponent, ref, getCurrentInstance, inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import * as pubMtd from '@/utils/publicMethods'
	import ClickOutside from '@/views/Directive/ClickOutside.vue';
	import Drag from '@/views/Directive/Drag.vue';

  import { Ref } from '@vue/reactivity'

  export default defineComponent({
    name: 'directive',
		inheritAttrs: false, // 继承除props以外的其他属性 v-bind='$attr'
    components: {
      ClickOutside, Drag
    },
    setup() {
			const { ctx } = (getCurrentInstance() as any)
			const _: any = inject('_')
			console.log(ctx.axios, _.map, '_')
      const radioC: any = reactive({
        radio: 'click-outside'
			})
			const Radio: any = toRefs(radioC)
      return {
        ...Radio
			}
		}
  })
</script>

<style lang="stylus" scoped>
.directive {
	height 100%
	width 100%
}
</style>
