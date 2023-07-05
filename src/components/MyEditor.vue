<template>
  <div>
    <!-- <div>
      <button @click="printEditorHtml">print html</button>
      <button @click="insertTextHandler">insert text</button>
      <button @click="disableHandler">disable</button>
    </div> -->
    <p>打印预览</p>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <!-- 工具栏 -->
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
      />
      <!-- 编辑器 -->
      <Editor
        style="height: 80%; overflow-y: hidden"
        :defaultConfig="editorConfig"
        v-model="html"
        @onChange="onChange"
        @onCreated="onCreated"
      />
    </div>
    <!-- <div style="margin-top: 10px">
      <textarea
        v-model="html"
        readonly
        style="width: 100%; height: 200px; outline: none"
      ></textarea>
    </div> -->
  </div>
</template>

<script>
import { Boot, SlateTransforms } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import mentionModule from '@/plugin'
Boot.registerModule(mentionModule)
export default {
  name: 'MyEditor',
  props: {},
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: '<p>hello&nbsp;world</p>',
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        // MENU_CONF: {}
        EXTEND_CONF: {
          mentionConfig: {
            showModal: this.showMentionModal,
            hideModal: this.hideMentionModal
          }
        }
      }
    }
  },
  methods: {
    installNodes(list = []) {
      this.editor.selectAll() //恢复选区
      this.editor.deleteFragment() //删除选区
      // this.editor.moveReverse(1)
      SlateTransforms.insertNodes(this.editor, list) //替换

      this.editor.move(1) //移动
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      console.log('onChange', editor.getHtml()) // onChange 时获取编辑器最新内容
    },
    insertTextHandler() {
      const editor = this.editor
      if (editor == null) return
      editor.insertText(' hello ')
    },
    printEditorHtml() {
      const editor = this.editor
      if (editor == null) return
      console.log(editor.getHtml())
    },
    disableHandler() {
      const editor = this.editor
      if (editor == null) return
      editor.disable()
    }
  },
  mounted() {
    this.disableHandler()
    // 模拟 ajax 请求，异步渲染编辑器
    // setTimeout(() => {
    //   // this.html = '<p>Ajax 异步设置内容 HTML</p>'
    //   this.disableHandler()
    // }, 1500)
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
