/* eslint-disable no-unused-vars */
/**
 * @description parse elem html
 * @author wangfupeng
 */

function parseHtml(elem, children, editor) {
  // elem HTML 结构 <span data-w-e-type="mention" data-w-e-is-void data-w-e-is-inline data-value="张三" data-info="xxx">@张三</span>

  const value = elem.getAttribute('data-value') || ''
  const rawInfo = decodeURIComponent(elem.getAttribute('data-info') || '')
  let info
  try {
    info = JSON.parse(rawInfo)
  } catch (ex) {
    info = rawInfo
  }

  return {
    type: 'mention',
    value,
    info,
    children: [{ text: '' }] // void node 必须有一个空白 text
  }
}

const parseHtmlConf = {
  selector: 'span[data-w-e-type="mention"]',
  parseElemHtml: parseHtml
}

export default parseHtmlConf
