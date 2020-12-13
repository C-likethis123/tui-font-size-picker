/**
 * @fileoverview Code for the font size plugin
 * @author Chow Jia Ying <chowjiaying211@gmail.com>
 */

/**
 * Renders the UI of the editor
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} options - options for plugin
 */
function initUI(editor, options = {}) {
  const toolbar = editor.getUI().getToolbar();
  toolbar.insertItem(4, {
    type: 'button',
    options: {
      event: 'showDropdown',
      text: 'Size'
    }
  })
}

/**
 * Color syntax plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */

export default function fontSizePlugin(editor, options = {}) {
  editor.eventManager.addEventType('showDropdown');
  editor.eventManager.listen('showDropdown', () => alert('You are editing the size!'))
  initUI(editor, options)
}
