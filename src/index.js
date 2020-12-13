/**
 * @fileoverview Code for the font size plugin
 * @author Chow Jia Ying <chowjiaying211@gmail.com>
 *
 * This is a plugin to adjust the font size of a block of text.
 * The plugin introduces an input element for users to enter their desired font size.
 * When the user enters a numeric value, it should change the font size of the highlighted text.
 *
 * Additionally, there can be a dropdown list/menu list for users to click onto. When clicked, a list of common font sizes will be displayed (will be taken from Microsoft word).
 *
 * There should be validation, where only numbers are allowed values.
 */

/**
 * Retrieves the value of the input element and triggers the necessary changes
 * @param {Event} event - onChange event triggered when the font size input changes
 */
function handleFontSizeChange(event) {
  console.log(event.target.value)
}

/**
 * Renders the UI of the editor
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */
function initUI(editor) {
  const toolbar = editor.getUI().getToolbar()
  const fontSizeInput = document.createElement("input")

  toolbar.insertItem(-1, {
    type: "divider"
  })

  toolbar.insertItem(-2, {
    type: "button",
    options: {
      name: "fontSizePlugin",
      className: "tui-fontSize",
      // event: "showDropdown",
      tooltip: "Font Size",
      el: fontSizeInput,
      style:
        "width: 40px; margin: 5px 3px; line-height: 12px; font-size: 11px; min-height: 14px;"
    }
  })
  fontSizeInput.setAttribute("type", "number")
  fontSizeInput.addEventListener("change", handleFontSizeChange)
}

/**
 * Font size plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */

export default function fontSizePlugin(editor) {
  // editor.eventManager.addEventType("showDropdown")
  // editor.eventManager.listen("showDropdown", () =>
  //   alert("You are editing the size!")
  // )
  initUI(editor)
}
