/* eslint-disable no-unused-vars */
/**
 * @description parse elem html
 * @author wenhao.yang
 */

function parseHtml(elem, children, editor) {
  // elem HTML 结构 <span data-w-e-type="mention" data-w-e-is-void data-w-e-is-inline data-value="张三" data-info="xxx">@张三</span>

  const value = elem.getAttribute('data-value') || ''
  const rawInfo = decodeURIComponent(elem.getAttribute('data-info') || '')
  const rawList = decodeURIComponent(elem.getAttribute('data-list') || '')
  let info
  let list
  try {
    info = JSON.parse(rawInfo)
    list = JSON.parse(rawList)
  } catch (ex) {
    info = rawInfo
    list = rawList
  }

  return {
    type: 'mention',
    value,
    info,
    list,
    children: [{ text: '' }] // void node 必须有一个空白 text
  }
}

const parseHtmlConf = {
  selector: 'span[data-w-e-type="mention"]',
  parseElemHtml: parseHtml
}

export default parseHtmlConf
