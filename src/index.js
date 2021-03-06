import "./index.css"
import { setAttributes } from "./helpers.js"
/**
 * @fileoverview Code for the font size plugin
 * @author Chow Jia Ying <chowjiaying211@gmail.com>
 *
 * This is a plugin to adjust the font size of a block of text in both the Markdown and WYSIWYG versions.
 *
 */

const fontStyleRegex = /style="font-size: \d+px"/g

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
 * Renders a list of font sizes for users to choose from
 * @param {Editor} editor - instance of Editor or Viewer
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
    // program what happens when option is clicked
    option.addEventListener("click", () => {
      editor.exec("changeFontSize", fontSize) // emit change font size event
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

  return popup
}

/**
 * Renders an input for users to change font sizes
 * @param {Editor} editor
 */
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
  setAttributes(fontSizeInput, {
    type: "number",
    value: "12",
  })
  return fontSizeInput
}

/**
 * Initialise UI rendering logic
 * @param {Editor} editor - instance of editor
 * @param {HTMLInputElement} fontSizeInput - HTMLInputElement to enter font sizes
 * @param {HTMLDivElement} dropdown - dropdown of font sizes
 */
function initUIEvents(editor, fontSizeInput, dropdown) {
  fontSizeInput.addEventListener("change", (event) => {
    const fontSize = parseInt(event.target.value, 10)

    if (isNaN(fontSize) || fontSize <= 0) {
      return
    }
    editor.exec("changeFontSize", fontSize)
  })

  editor.eventManager.addEventType("showDropdown")
  editor.eventManager.addEventType("hideDropdown")
  editor.eventManager.listen("showDropdown", () => {
    if (dropdown.isShow()) {
      dropdown.hide()
      return
    }

    const { offsetLeft, offsetTop, offsetHeight } = fontSizeInput

    dropdown.el.setAttribute(
      "style",
      `top: ${offsetTop + offsetHeight}px; left: ${offsetLeft}px`,
    )
    dropdown.show()
    applyHighlightStyle(editor, true)
  })

  editor.eventManager.listen("hideDropdown", () => {
    dropdown.hide()
  })
}

/**
 * Renders the UI of the editor
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */
function initUI(editor) {
  return {
    fontSizeInput: initFontSizeInput(editor),
    dropdown: initDropdown(editor),
  }
}

/**
 * Apply <span> tags around text to style text in Markdown mode
 * @param {string} text - text to add HTML tags to
 */
function applyFontSizeHTMLTag(text, fontSize) {
  const fontStyleApplied = text.match(fontStyleRegex)

  if (fontStyleApplied) {
    const result = text.replace(
      fontStyleRegex,
      `style="font-size: ${fontSize}px"`,
    )

    return {
      result,
      to: result.length,
    }
  }
  const result = `<span class="size" style="font-size: ${fontSize}px">${text}</span>`

  return {
    result,
    to: result.length,
  }
}

/**
 * Font size plugin
 * Some code was modified from https://github.com/nhn/tui.editor/blob/master/plugins/color-syntax/src/js/index.js to learn how to make use of the TUI Editor's API to create the plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */

export default function fontSizePlugin(editor) {
  const { fontSizeInput, dropdown } = initUI(editor)

  initUIEvents(editor, fontSizeInput, dropdown)

  // add commands for editor
  editor.addCommand("markdown", {
    name: "changeFontSize",
    exec(md, fontSize) {
      // replace selected text
      const cm = md.getEditor()
      const rangeFrom = md.getCursor("from")
      const rangeTo = md.getCursor("to")
      const selectedText = cm.getSelection()
      const { result, to } = applyFontSizeHTMLTag(selectedText, fontSize)

      cm.replaceSelection(result)

      // move cursor
      const newStart = { line: rangeFrom.line, ch: rangeFrom.ch }
      const newEnd = {
        line: rangeTo.line,
        ch: rangeFrom.line === rangeTo.line ? rangeTo.ch + to : to,
      }

      cm.setSelection(newStart, newEnd)
      fontSizeInput.value = fontSize
      editor.eventManager.emit("hideDropdown")
      md.focus()
    },
  })

  editor.addCommand("wysiwyg", {
    name: "changeFontSize",
    // sets font size and applies highlighting style
    exec(wwe, fontSize) {
      const sq = wwe.getEditor()
      const tableSelectionManager = wwe.componentManager.getManager(
        "tableSelection",
      )

      if (
        sq.hasFormat("table") &&
        tableSelectionManager.getSelectedCells().length
      ) {
        tableSelectionManager.styleToSelectedCells((squire, fontSizeValue) => {
          squire.setFontSize(`${fontSizeValue}px`)
        }, fontSize)

        const range = sq.getSelection()

        range.collapse(true)
        sq.setSelection(range)
      } else {
        sq.setFontSize(`${fontSize}px`)
      }
      fontSizeInput.value = fontSize
      applyHighlightStyle(editor, false)
      editor.eventManager.emit("hideDropdown")
    },
  })
}
