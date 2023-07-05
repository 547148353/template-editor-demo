<template>
  <div id="app">
    <button @click="addKnowledge">兼容xml-选区新增一行知识库</button>
    <button @click="appendNode(node1)">新版json-选区新增一行内容</button>
    <button @click="getSelectNode">获取选中区域内容JSON</button>
    <button @click="selectToKnowledge">将该选区形成新的知识库</button>
    <button
      v-for="(item, index) in knowledgeList"
      :key="index"
      @click="appendNode(item)"
    >
      知识库{{ index }}
    </button>
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

    <!-- <MyEditorWithFormula></MyEditorWithFormula> -->
    <el-row>
      <el-col :span="12">
        <my-editor-with-mention
          ref="editor"
          @changePage="changePage"
        ></my-editor-with-mention>
      </el-col>
      <el-col :span="12">
        <my-editor ref="page" :html="pageHtml"></my-editor>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyEditor from './components/MyEditor.vue'
// import MyEditorWithFormula from './components/MyEditorWithFormula'
import MyEditorWithMention from './components/MyEditorWithMention'

export default {
  name: 'App',
  components: {
    MyEditor,
    // MyEditorWithFormula,
    MyEditorWithMention
  },
  data() {
    return {
      knowledgeList: [],
      headHtml: {
        type: 'header2',
        children: [{ text: '报告表头', bold: true }]
      },
      footerHtml: {
        type: 'header2',
        children: [{ text: '报告表尾', bold: true }]
      },
      pageHtml: '',
      node1: [
        { text: '脑切面质形态结构异常，回声分布不均，在' },
        {
          type: 'mention',
          value: '左',
          info: { id: 'a' },
          list: [
            { id: 'a', name: '左' },
            { id: 'b', name: '右' },
            { id: 'c', name: '双' }
          ],
          children: [{ text: '' }]
        },
        {
          text: '侧尾状核头体部处可见异常回声，大小约  ×  mm，形状呈团块样，内部为'
        },
        {
          type: 'mention',
          value: '强回声',
          info: { id: 'e' },
          list: [
            { id: 'e', name: '强回声' },
            { id: 'f', name: '无回声暗区' }
          ],
          children: [{ text: '' }]
        },
        {
          text: '，周边清楚，局部隆起上凸,侧脑室受压，脑中线结构尚居中。'
        }
      ]
    }
  },
  methods: {
    changePage(el) {
      let ele = []
      el.forEach(page => {
        ele.push(this.headHtml)
        page.forEach(child => {
          console.log(child.node)
          ele.push(child.node)
        })
        ele.push(this.footerHtml)
      })
      console.log(ele, el)
      // this.pageHtml = ele
      this.$refs.page.installNodes(JSON.parse(JSON.stringify(ele)))
    },
    selectToKnowledge() {
      let knowledge = this.$refs.editor.selectToKnowledge() //形成知识库
      this.knowledgeList.push(knowledge)
    },
    getSelectNode() {
      return this.$refs.editor.getSelectNode() //获取节点
    },
    appendNode(node) {
      this.$refs.editor.installNodes(JSON.parse(JSON.stringify(node))) //添加节点
    },
    addKnowledge() {
      // 肠壁不均匀强化，内见不规则更低密度区。直肠与周围间隙分界欠清。膀胱充盈佳，壁薄均匀，未见占位病变，增强扫描未见异常强化灶。</span><select><option>前列腺大小、形态及密度正常，未见异常占位。</option><option>子宫大小、形态及密度正常，未见异常占位。</option></select><span>盆腔软组织间隙清晰，淋巴结无肿大，盆腔未见积液。
      let text =
        '肠壁不均匀强化，内见不规则更低密度区。直肠与周围间隙分界欠清。膀胱充盈佳，壁薄均匀，未见占位病变，增强扫描未见异常强化灶。<select><option>前列腺大小、形态及密度正常，未见异常占位。</option><option>子宫大小、形态及密度正常，未见异常占位。</option></select>盆腔软组织间隙清晰，淋巴结无肿大，盆腔未见积液。'
      let arr = text.split(/<select>|<\/select>/g)
      let node = arr.map(t => {
        let span = document.createElement('span')
        span.innerHTML = t
        let select = span.getElementsByTagName('option')
        let node
        if (select.length > 0) {
          const map = list => {
            let ret = []
            for (let i = 0; i < list.length; ++i) {
              let name = list[i].innerHTML
              ret[i] = { id: i + '', name: name }
            }
            return ret
          }
          let option = map(select)

          node = {
            type: 'mention',
            value: option.length > 0 ? option[0].name : '',
            info: { id: '1' },
            list: option,
            children: [{ text: '' }]
          }
        } else {
          node = { text: t }
        }
        return node
      })
      this.appendNode(node)
    }
  }
}
</script>

<style>
.box-card {
  width: 800px;
}
button + button {
  margin-left: 12px;
}
</style>
