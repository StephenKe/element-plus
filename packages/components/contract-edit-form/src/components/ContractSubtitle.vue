<template>
  <div :class="ns.b()">
    <div :class="ns.e('main')">
      <div v-if="slotTitle" :class="ns.e('text')">
        <slot name="title" />
      </div>
      <div v-else :class="ns.e('text')">
        {{ title }}
      </div>
      <div :class="ns.e('button')">
        <slot />
      </div>
    </div>
    <div :class="ns.e('border')" />
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent, useSlots } from 'vue'
import { useNamespace } from '@element-plus/hooks'

export default defineComponent({
  name: 'ContractSubtitle',
  props: {
    title: String,
  },
  setup() {
    const ns = useNamespace('contract-sub-title')
    const slotTitle = !!useSlots().title

    return { ns, slotTitle }
  },
})
</script>
