<template>
  <div class="create-post-page">
    <h4>新建文章</h4>

    <uploader
      action="/upload"
      :beforeUpload="uploadCheck"
      :uploaded="uploadedData"
      @file-uploaded="handleFileUploaded"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>

      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img
            :src="dataProps.uploadedData && dataProps.uploadedData.data.url"
          />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>

    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <editor
          v-model="contentVal"
          :options="editorOptions"
          @blur="checkEditor"
          :class="{ 'is-invalid': !editorStatus.isValid }"
          ref="editorRef"
        ></editor>

        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">
          {{ editorStatus.message }}
        </span>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? '更新文章' : '发表文章' }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { GlobalDataProps, ResponseType, ImageProps, PostProps } from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { beforeUploadCheck } from '../helper'
import createMessage from '@/components/createMessage'
import Uploader from '@/components/Uploader.vue'
import EasyMDE, { Options } from 'easymde'
import Editor from '@/components/Editor.vue'
interface EditorInstance {
  clear: () => void
  geMDEInstance: () => EasyMDE | null
}
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
    Editor
  },
  setup () {
    const uploadedData = ref()
    const titleVal = ref('')
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    const router = useRouter()
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const isEditMode = !!route.query.id
    const textArea = ref<null | HTMLTextAreaElement>(null)
    const editorRef = ref<null | EditorInstance>()
    let imageId = ''
    const editorOptions: Options = {
      spellChecker: false
    }
    const titleRules: RulesProp = [
      {
        type: 'required',
        message: '文章标题不能为空'
      }
    ]
    const contentVal = ref('')

    const checkEditor = () => {
      if (contentVal.value.trim() === '') {
        editorStatus.isValid = false
        editorStatus.message = '文章详情不能空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ''
      }
    }
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能空' }
    ]

    onMounted(() => {
      if (editorRef.value) {
        console.log(editorRef.value.geMDEInstance())
      }
      if (isEditMode) {
        store
          .dispatch('fetchPost', route.query.id)
          .then((rawData: ResponseType<PostProps>) => {
            const currentPost = rawData.data
            if (currentPost.image) {
              uploadedData.value = { data: currentPost.image }
            }
            titleVal.value = currentPost.title
            contentVal.value = currentPost.content || ''
          })
      }
    })

    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const clearInputs = () => {
      const list: HTMLInputElement[] = Array.from(
        document.getElementsByClassName('form-control')
      ) as HTMLInputElement[]
      for (let i = 0; i < list.length; i++) {
        list[i].value = ''
      }
      editorRef.value?.clear()
    }

    const onFormSubmit = (result: boolean) => {
      checkEditor()
      if (result && editorStatus.isValid) {
        clearInputs()
        const { column, _id } = store.state.user
        if (column) {
          const nwePost: PostProps = {
            _id: new Date().getTime().toString(),
            title: titleVal.value,
            content: contentVal.value,
            column,
            createdAt: new Date().toLocaleString(),
            author: _id?.toString()
          }
          if (imageId) {
            nwePost.image = imageId
          }

          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode
            ? {
                id: route.query.id,
                payload: nwePost
              }
            : nwePost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      } else {
        createMessage('输入内容有误，请重新输入', 'error')
      }
    }

    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      isEditMode,
      uploadedData,
      checkEditor,
      editorStatus,
      textArea,
      editorOptions,
      editorRef
    }
  }
})
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
