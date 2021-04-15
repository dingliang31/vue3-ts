<template>
	<div class="costom-component">
		<el-tabs type="border-card">
			<el-tab-pane label="model方式">
				<div class="tx-left">
					<el-button type="text">{{model}}</el-button>
					<model-input v-model="model"></model-input>
				</div>
			</el-tab-pane>
			<el-tab-pane label="update方式">
				<div class="tx-left">
					<el-button type="text">{{update}}</el-button>
					<update-input v-model:input="update"></update-input>
				</div>
			</el-tab-pane>
			<el-tab-pane label="其他方式">
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">

  import vue, { reactive, onMounted, toRefs, computed, defineComponent, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import * as pubMtd from '@/utils/publicMethods'
	import ModelInput from './model.vue'
	import UpdateInput from './update.vue'


  import { Ref } from '@vue/reactivity'

  export default defineComponent({
    name: 'costom-component',
    components: {
			'model-input': ModelInput, 'update-input': UpdateInput
    },
    setup() {
      const radioC: any = reactive({
        radio: 'model形式',
			})
			const model: any = reactive({
				model: 'model, 这种双向数据绑定好像被舍弃了'
			})
			const update: any = reactive({
				update: 'update'
			})
			const Radio: any = toRefs(radioC)
			const Model: any = toRefs(model)
			const Update: any = toRefs(update)
      return {
        ...Radio, ...Model, ...Update
			}
		}
  })
</script>

<style lang="stylus" scoped>
.costom-component {
	height 100%
	width 100%
}
</style>
