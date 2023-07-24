<template>
  <div>
    <p>
      元素堆叠超过<input
        type="number"
        v-model.number="limitHeight"
      />px，共生成了{{ pageElement.length }}页
    </p>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
      />
      <Editor
        style="height: 400px"
        v-model="html"
        :defaultConfig="editorConfig"
        @onCreated="onCreated"
        @customAlert="customAlert"
        @onChange="onChange"
      />
      <mention-modal
        ref="mention"
        v-if="isShowModal"
        @hideMentionModal="hideMentionModal"
        @insertMention="insertMention"
      ></mention-modal>
    </div>
    <div style="margin-top: 10px">
      <textarea v-model="html" style="width: 100%; height: 300px"></textarea>
    </div>
  </div>
</template>

<script>
import { Boot, DomEditor, SlateTransforms } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import mentionModule from '@/plugin'
import MentionModal from './MentionModal'

// 注册插件
Boot.registerModule(mentionModule)

export default {
  name: 'MyEditorWithMention',
  components: { Editor, Toolbar, MentionModal },
  data() {
    return {
      limitHeight: 150,
      pageElement: [],
      editor: null,
      pageEditor: null,
      html: '<p>你好<span data-w-e-type="mention" data-w-e-is-void data-w-e-is-inline data-value="A张三" data-info="%7B%22id%22%3A%22a%22%7D">@A张三</span></p>',
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',

        EXTEND_CONF: {
          mentionConfig: {
            showModal: this.showMentionModal,
            hideModal: this.hideMentionModal
          }
        }
      },
      isShowModal: false,
      heightList: []
    }
  },
  methods: {
    onChange(editor) {
      this.$nextTick(() => {
        this.pagingOperation(editor)
      })
    },
    pagingOperation(editor) {
      let pageElement = []
      let height = 0
      let IElement = []
      editor.children.forEach((i, index) => {
        let dom = editor.toDOMNode(i)
        let domHeight = dom.offsetHeight
        height = domHeight + height //堆叠高度
        console.log(height)
        if (height < this.limitHeight + 20) {
          IElement.push({
            height: domHeight + getComputedStyle(dom, null).marginTop,
            dom,
            node: i
          })
        } else {
          pageElement.push(IElement)
          height = domHeight
          IElement = [{ height: domHeight + 16, dom, node: i }]
        }
        if (index + 1 == editor.children.length) {
          pageElement.push(IElement)
        }
      })
      this.$emit('changePage', pageElement)
      this.pageElement = pageElement
    },
    selectToKnowledge() {
      return this.editor.getFragment()
    },
    getSelectNode() {
      this.editor.restoreSelection()
      console.log(this.editor.getFragment())
    },
    installNodes(list = []) {
      this.editor.restoreSelection() //恢复选区
      this.editor.deleteFragment() //删除选区
      // this.editor.moveReverse(1)
      SlateTransforms.insertNodes(this.editor, list) //替换
      this.editor.move(1) //移动
    },
    customAlert(info, type) {
      window.alert(`customAlert in Vue demo\n${type}:\n${info}`)
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
    },
    /**
     * 显示下拉栏内容
     * @param {*} editor this.editor
     */
    showMentionModal(editor) {
      console.log(editor.getSelectionPosition(), '获取选区的定位')
      console.log(editor.getNodePosition(), '某个节点的定位')
      // 获取光标位置
      const domSelection = document.getSelection()
      const domRange = domSelection?.getRangeAt(0)
      if (domRange == null) return
      const rect = domRange.getBoundingClientRect()

      console.log(rect, '鼠标定位top', rect.top, 'left', rect.left)

      // 选过选中了 void 元素
      const elems = DomEditor.getSelectedElems(editor)
      let list = elems[1]?.list
      if (elems[1]?.list) {
        this.isShowModal = true
        this.$nextTick(() => {
          let rawList
          try {
            rawList = JSON.parse(list)
          } catch (ex) {
            rawList = list
          }
          this.$refs.mention.list = rawList
        })
      } else {
        list = [
          { id: 'a', name: 'A张三' },
          { id: 'b', name: 'B李四' },
          { id: 'c', name: 'C小明' },
          { id: 'd', name: 'D小李' },
          { id: 'e', name: 'E小红' }
        ]
        this.isShowModal = true
        setTimeout(() => {
          try {
            this.$refs.mention.list = list
          } catch (ex) {
            console.log(1)
          }
        }, 1000)
      }
    },
    hideMentionModal() {
      this.isShowModal = false
    },
    insertMention(id, name, list) {
      const mentionNode = {
        type: 'mention', // 必须是 'mention'
        value: name,
        info: { id },
        list,
        children: [{ text: '' }] // 必须有一个空 text 作为 children
      }
      console.log(mentionNode)
      const editor = this.editor
      if (editor) {
        editor.restoreSelection() // 恢复选区
        editor.deleteBackward('character') // 删除该选区
        editor.insertNode(mentionNode) // 插入 mention
        editor.move(1) // 移动光标
      }
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style rel="stylesheet/scss" lang="scss" scope>
.editor-box {
  display: flex;
}
</style>
