/**
 * @description mention plugin
 * @author wenhao.yang
 */

import { DomEditor } from '@wangeditor/editor'
// import { SlateEditor, SlateElement } from '@wangeditor/editor'

function getMentionConfig(editor) {
  const { EXTEND_CONF } = editor.getConfig()
  const { mentionConfig } = EXTEND_CONF
  return mentionConfig
}

function withMention(editor) {
  const { insertText, isInline, isVoid, getFragment } = editor

  const newEditor = editor
  const { showModal, hideModal } = getMentionConfig(newEditor)

  newEditor.clickTag = () => {
    const node = getFragment()[0]
    console.log(node)
    setTimeout(() => {
      // 展示 modal （异步，以便准确获取光标位置）
      if (node?.children.length == 1) {
        const dom = node.children[0]
        console.log(dom)
        if (dom?.type == 'mention') {
          if (showModal) showModal(newEditor)

          // 监听，隐藏 modal（异步，等待 modal 渲染后再监听）
          setTimeout(() => {
            function _hide() {
              if (hideModal) hideModal(newEditor)
            }
            newEditor.once('fullScreen', _hide)
            newEditor.once('unFullScreen', _hide)
            newEditor.once('scroll', _hide)
            newEditor.once('modalOrPanelShow', _hide)
            newEditor.once('modalOrPanelHide', _hide)

            function hideOnChange() {
              if (newEditor.selection != null) {
                _hide()
                newEditor.off('change', hideOnChange) // 及时解绑
              }
            }
            newEditor.on('change', hideOnChange)
          })
        }
      }
    })
  }

  newEditor.insertText = t => {
    // 选过选中了 void 元素
    const elems = DomEditor.getSelectedElems(newEditor)
    const isSelectedVoidElem = elems.some(elem => newEditor.isVoid(elem))
    if (isSelectedVoidElem) {
      insertText(t)
      return
    }
    // mention 相关配置
    const { showModal, hideModal } = getMentionConfig(newEditor)

    if (t === '@') {
      setTimeout(() => {
        // 展示 modal （异步，以便准确获取光标位置）
        if (showModal) showModal(newEditor)

        // 监听，隐藏 modal（异步，等待 modal 渲染后再监听）
        setTimeout(() => {
          function _hide() {
            if (hideModal) hideModal(newEditor)
          }
          newEditor.once('fullScreen', _hide)
          newEditor.once('unFullScreen', _hide)
          newEditor.once('scroll', _hide)
          newEditor.once('modalOrPanelShow', _hide)
          newEditor.once('modalOrPanelHide', _hide)

          function hideOnChange() {
            if (newEditor.selection != null) {
              _hide()
              newEditor.off('change', hideOnChange) // 及时解绑
            }
          }
          newEditor.on('change', hideOnChange)
        })
      })
    }

    // 非 '@' 则执行默认行为
    insertText(t)
  }

  // 重写 isInline
  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'mention') {
      return true
    }

    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'mention') {
      return true
    }

    return isVoid(elem)
  }

  return newEditor
}

export default withMention
