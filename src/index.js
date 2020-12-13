/**
 * @fileoverview Code for the font size plugin
 * @author Chow Jia Ying <chowjiaying211@gmail.com>
 */

/**
 * Renders the UI of the editor
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */
function initUI(editor) {
  const toolbar = editor.getUI().getToolbar()

  toolbar.insertItem(4, {
    type: "button",
    options: {
      event: "showDropdown",
      text: "Size"
    }
  })
}

/**
 * Color syntax plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */

export default function fontSizePlugin(editor) {
  editor.eventManager.addEventType("showDropdown")
  editor.eventManager.listen("showDropdown", () =>
    alert("You are editing the size!")
  )
  initUI(editor)
}
