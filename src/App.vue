<template>
  <div id="app">
    <button @click="addKnowledge">选区新增一行知识库</button>
    <!-- <button @click="dialogVisible = !dialogVisible">show/hide</button>
    <hr> -->

    <!-- <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog
      title="editor"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <my-editor></my-editor>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <my-editor></my-editor>
    </el-card> -->

    <!-- <my-editor></my-editor> -->
    <!-- <MyEditorWithFormula></MyEditorWithFormula> -->
    <my-editor-with-mention ref="editor"></my-editor-with-mention>
  </div>
</template>

<script>
// import MyEditor from './components/MyEditor.vue'
// import MyEditorWithFormula from './components/MyEditorWithFormula'
import MyEditorWithMention from './components/MyEditorWithMention'
import { SlateTransforms } from '@wangeditor/editor'
export default {
  name: 'App',
  components: {
    // MyEditor,
    // MyEditorWithFormula,
    MyEditorWithMention
  },
  methods: {
    addKnowledge() {
      let node1 = { text: '脑切面质形态结构异常，回声分布不均，在' }
      let node2 = {
        type: 'mention',
        value: '左',
        info: { id: 'a' },
        list: [
          { id: 'a', name: '左' },
          { id: 'b', name: '右' },
          { id: 'c', name: '双' }
        ],
        children: [{ text: '' }]
      }
      let node3 = {
        text: '侧尾状核头体部处可见异常回声，大小约  ×  mm，形状呈团块样，内部为'
      }

      let node4 = {
        type: 'mention',
        value: '强回声',
        info: { id: 'e' },
        list: [
          { id: 'e', name: '强回声' },
          { id: 'f', name: '无回声暗区' }
        ],
        children: [{ text: '' }]
      }
      let node5 = {
        text: '，周边清楚，局部隆起上凸,侧脑室受压，脑中线结构尚居中。'
      }

      let list = [node1, node2, node3, node4, node5]
      this.$refs.editor.editor.restoreSelection() //恢复选区
      this.$refs.editor.editor.deleteFragment() //删除选区
      SlateTransforms.insertNodes(this.$refs.editor.editor, list) //替换
      this.$refs.editor.editor.move(1) //移动

      console.log(this.$refs.editor.editor.getHtml())
    }
  }
}
</script>

<style>
.box-card {
  width: 800px;
}
</style>
