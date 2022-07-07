<template>
  <el-row :gutter="16" :class="ns.b()">
    <el-col
      v-for="fieldItem of configItem.fields?.filter(
        (c) => !c.hidden && !['ZifWtyw', 'ZifWtywTxt'].includes(c.field)
      )"
      :key="fieldItem.field"
      :span="fieldItem.inputType === '60' ? 24 : 8"
    >
      <el-form-item
        :label="`${fieldItem.fieldName}:`"
        :prop="fieldItem.field"
        :class="[
          ns.e('form-item'),
          {
            [ns.em('form-item', 'mini-lineH')]: longLabels.includes(
              fieldItem.field
            ),
            [ns.em('form-item', 'view')]: pageType === 'view',
            [ns.em('form-item', 'edit')]: pageType !== 'view',
          },
        ]"
      >
        <template v-if="pageType !== 'view'">
          <el-select
            v-if="fieldItem.inputType === '20'"
            :ref="(el) => selectRefs.push(el)"
            v-model="currFormData[fieldItem.field]"
            :class="{
              'hidden-tag-close': ['ZconClassNo3', 'ZsReasonNo'].includes(
                fieldItem.field
              ),
            }"
            :placeholder="fieldItem.placeholder"
            :disabled="fieldItem.disabled"
            :multiple="fieldItem.selectMultiple"
            @change="(val) => handleFormInputChange(fieldItem.field, val)"
            @visible-change="
              (show) => handleFormSelectVisible(fieldItem.field, show)
            "
            @remove-tag="
              (val) => handleFormSelectRemoveTag(fieldItem.field, val)
            "
          >
            <el-option
              v-for="option in fieldItem.selectOptions"
              :key="option.value"
              :title="option.title"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            ></el-option>
          </el-select>
          <el-tree-select
            v-else-if="fieldItem.inputType === '30'"
            :ref="(el) => treeSelectRefs.push(el)"
            v-model="currFormData[fieldItem.field]"
            :data="fieldItem.selectOptions"
            :disabled="fieldItem.disabled"
            :multiple="fieldItem.selectMultiple"
            @change="(val) => handleFormInputChange(fieldItem.field, val)"
            @check="
              (currNode, checkedNode) =>
                handleFormTreeSelectCheck(
                  fieldItem.field,
                  currNode,
                  checkedNode
                )
            "
          ></el-tree-select>
          <el-input
            v-else-if="fieldItem.inputType === '40'"
            v-model="currFormData[fieldItem.field]"
            :readonly="pageType !== 'view'"
            :disabled="fieldItem.disabled"
            :placeholder="fieldItem.placeholder"
            @click="
              (e) => handleFormInputClick(fieldItem.field, fieldItem.inputType)
            "
            @change="(val) => handleFormInputChange(fieldItem.field, val)"
          >
            <template #suffix>
              <el-icon
                @click="
                  (e) =>
                    !fieldItem.disabled
                      ? handleFormInputClick(
                          fieldItem.field,
                          fieldItem.inputType
                        )
                      : null
                "
                ><search
              /></el-icon>
            </template>
          </el-input>
          <el-date-picker
            v-else-if="fieldItem.inputType === '50'"
            v-model="currFormData[fieldItem.field]"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="fieldItem.placeholder"
            :disabled="fieldItem.disabled"
            @change="(val) => handleFormInputChange(fieldItem.field, val)"
          >
          </el-date-picker>
          <el-input
            v-else-if="fieldItem.inputType === '60'"
            v-model="currFormData[fieldItem.field]"
            type="textarea"
            :placeholder="fieldItem.placeholder"
            :disabled="fieldItem.disabled"
            :show-word-limit="(fieldItem.maxlength || 0) > 0"
            :maxlength="fieldItem.maxlength || null"
            @change="(val) => handleFormInputChange(fieldItem.field, val)"
          />
          <el-checkbox
            v-else-if="fieldItem.inputType === '70'"
            v-model="currFormData[fieldItem.field]"
            :disabled="fieldItem.disabled"
            @change="(val) => handleFormInputChange(fieldItem.field, val)"
          ></el-checkbox>
          <el-input
            v-else
            v-model="currFormData[fieldItem.field]"
            :placeholder="fieldItem.placeholder"
            :disabled="fieldItem.disabled"
            :maxlength="fieldItem.maxlength || null"
            @change="(val) => handleFormInputChange(fieldItem.field, val)"
          />
        </template>
        <div v-else>{{ currFormData[fieldItem.field] }}</div>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import {
  ElRow,
  ElCol,
  ElFormItem,
  ElSelect,
  ElTreeSelect,
  ElOption,
  ElInput,
  ElDatePicker,
  ElCheckbox,
  ElIcon,
} from '@element-plus/components'
import { useNamespace } from '@element-plus/hooks'
import type { PropType } from 'vue'
import type { Config } from '../interface'
import type { ContractEditData } from '../interface/contractEdit'

export default defineComponent({
  name: 'ContractEditForm',
  components: {
    ElRow,
    ElCol,
    ElFormItem,
    ElInput,
    ElSelect,
    ElTreeSelect,
    ElOption,
    ElDatePicker,
    ElCheckbox,
    ElIcon,
    Search,
  },
  props: {
    configItem: {
      type: Object as PropType<Config>,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
    formData: {
      type: Object as PropType<ContractEditData>,
      required: true,
    },
    longLabels: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    wrapScrollTop: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'update:formData',
    'handleFormSelectVisible',
    'handleFormInputClick',
    'handleFormInputChange',
    'handleFormTreeSelectCheck',
    'handleFormSelectRemoveTag',
  ],
  setup(props: any, { emit }) {
    const ns = useNamespace('contract-edit-form')
    const currFormData = computed<any>({
      get() {
        return props.formData
      },
      set(v) {
        emit('update:formData', v)
      },
    })

    const handleFormSelectVisible = (targetKey: string, show: boolean) => {
      emit('handleFormSelectVisible', targetKey, show)
    }
    const handleFormSelectRemoveTag = (targetKey: string, value: string) => {
      emit('handleFormSelectRemoveTag', targetKey, value)
    }
    const handleFormInputClick = (targetKey: string, inputType: string) => {
      emit('handleFormInputClick', targetKey, inputType)
    }
    const handleFormInputChange = (targetKey: string, value: any) => {
      emit('handleFormInputChange', targetKey, value)
    }
    const handleFormTreeSelectCheck = (
      targetKey: string,
      currNode: any,
      checkedNode: any
    ) => {
      emit('handleFormTreeSelectCheck', targetKey, currNode, checkedNode)
    }

    const selectRefs: any = []
    const treeSelectRefs: any = []
    const hideDropMenu = () => {
      const selectRef = selectRefs.find((d) => d?.dropMenuVisible)
      const treeSelectRef = treeSelectRefs.find((d) => d?.dropMenuVisible)
      if (selectRef) selectRef.handleClose()
      if (treeSelectRef) treeSelectRef.handleClose()
    }
    let timeStamp = new Date().valueOf()
    watch(
      () => props.wrapScrollTop,
      () => {
        const currTimeStamp = new Date().valueOf()
        const diff = (currTimeStamp - timeStamp) / 1000
        timeStamp = currTimeStamp
        // 每次wrapScrollTop改变在0.8秒内认为是同一次滚动，只执行一次方法
        if (diff > 0.8) {
          hideDropMenu()
        }
      }
    )

    return {
      ns,
      selectRefs,
      treeSelectRefs,
      currFormData,

      handleFormSelectVisible,
      handleFormInputClick,
      handleFormInputChange,
      handleFormTreeSelectCheck,
      handleFormSelectRemoveTag,
    }
  },
})
</script>
