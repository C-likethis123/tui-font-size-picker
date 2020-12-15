import "./index.css"
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
 * Apply CSS styling to text to give the impression of the text being selected
 * @param {Editor} editor - instance of Editor
 * @param {boolean} toHighlight - indicates if the highlight style is to be added or removed
 */
function applyHighlightStyle(editor, toHighlight) {
  const sq = editor.getSquire()
  const range = sq.getSelection()
  const highlightStyle = {
    tag: "SPAN",
    attributes: {
      class: "highlighted",
    },
  }

  if (toHighlight) {
    sq.changeFormat(highlightStyle, null, range)
  } else {
    sq.changeFormat(null, highlightStyle, range)
  }
}

/**
 * Renders the font dropdown options
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * Renders a dropdown of font sizes. On click, it updates the font size and closes the dropdown.
 * It also has an input field. When updated, it also updates the font size.
 * Create a dropdown using select and option elements. The value will be used to update the input. When the input is updated, it also changes the dropdown elements. If the dropdown does not have that input, it does not select any of the dropdowns.
 */
function initDropdown(editor) {
  const dropdownContainer = document.createElement("div")
  const dropdown = document.createElement("ul")

  dropdown.classList.add("font-dropdown")
  const fontSizeValues = [
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    36,
    48,
    72,
  ]

  fontSizeValues.forEach((fontSize) => {
    const option = document.createElement("li")

    option.classList.add("font-dropdown-option")

    option.textContent = fontSize
    option.value = fontSize
    option.addEventListener("click", (event) => {
      const fontSizeValue = event.target.value
      const toolbar = editor.getUI().getToolbar()
      const inputButtonIndex = toolbar.indexOfItem("fontSizePlugin")
      const { el } = toolbar.getItem(inputButtonIndex)

      el.value = fontSizeValue
      editor.exec("changeFontSize", fontSizeValue)
      editor.eventManager.emit("hideDropdown")
    })
    dropdown.appendChild(option)
  })
  dropdownContainer.appendChild(dropdown)
  const popup = editor.getUI().createPopup({
    header: false,
    title: null,
    content: dropdownContainer,
    className: "fontDropdownContainer",
    target: editor.getUI().getToolbar().el,
  })

  editor.eventManager.listen("showDropdown", () => {
    if (popup.isShow()) {
      popup.hide()
      return
    }
    const toolbar = editor.getUI().getToolbar()
    const inputButtonIndex = toolbar.indexOfItem("fontSizePlugin")
    const { el } = toolbar.getItem(inputButtonIndex)
    const { offsetLeft, offsetTop, offsetHeight } = el

    popup.el.setAttribute(
      "style",
      `top: ${offsetTop + offsetHeight}px; left: ${offsetLeft}px`,
    )
    popup.show()
    applyHighlightStyle(editor, true)
  })

  editor.eventManager.listen("hideDropdown", () => {
    popup.hide()
  })
}

function initFontSizeInput(editor) {
  const toolbar = editor.getUI().getToolbar()
  const fontSizeInput = document.createElement("input")

  fontSizeInput.classList.add("tui-font-size")
  toolbar.insertItem(-1, {
    type: "divider",
  })

  toolbar.insertItem(-2, {
    type: "button",
    options: {
      name: "fontSizePlugin",
      event: "showDropdown",
      tooltip: "Font Size",
      el: fontSizeInput,
    },
  })
  fontSizeInput.setAttribute("type", "number")
  fontSizeInput.setAttribute("value", "12")
  fontSizeInput.addEventListener("change", (event) => {
    const fontSize = parseInt(event.target.value, 10)

    if (isNaN(fontSize) || fontSize <= 0) {
      return
    }
    editor.exec("changeFontSize", fontSize)
    editor.eventManager.emit("hideDropdown")
  })
}

/**
 * Renders the UI of the editor
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */
function initUI(editor) {
  editor.eventManager.addEventType("showDropdown")
  editor.eventManager.addEventType("hideDropdown")

  initFontSizeInput(editor)
  initDropdown(editor)
}

/**
 * Font size plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */

export default function fontSizePlugin(editor) {
  editor.addCommand("wysiwyg", {
    name: "changeFontSize",
    exec(wwe, fontSize) {
      const sq = wwe.getEditor()

      sq.setFontSize(`${fontSize}px`)
      applyHighlightStyle(editor, false)
    },
  })
  initUI(editor)
}
