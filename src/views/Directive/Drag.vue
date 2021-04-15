<template>
	<div class="out-drag" v-drag>
		<div class='drag'></div>
	</div>
</template>

<script lang="ts">

  import vue, { defineComponent, ref, toRefs, reactive, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import * as pubMtd from '@/utils/publicMethods'
	import drag from '@/components/drag'

  export default {
    name: 'drag',
    components: {
    },
		directives: {
      'drag': drag
		},
    mounted() {
      const _this: any = this
      console.log(_this.$axios)
    }
  }
</script>

<style lang="stylus">
.out-drag {
  height 500px
  width 100%
  position relative
  .drag {
    width 120px
    height 90px
    background gray
    position absolute
    cursor move
    left 0
    top 0
  }
}
</style>
