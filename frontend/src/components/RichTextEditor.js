// import React from 'react'
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import './styles/editor.css'
// import './styles.scss'
// import MenuBar from './MenuBar'

// export default function RichTextEditor() {
//   const editor = useEditor({
//     extensions: [StarterKit],
//      content: ``,
//   })

//   if (!editor) return null

//   return (
//     <div className="editor-container">
//       {/* <MenuBar editor={editor} /> */}
//       <EditorContent editor={editor} className="editor-content" />
//     </div>
//   )
// }



import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './styles/editor.css'
import './styles.scss'
import MenuBar from './MenuBar'

export default function RichTextEditor({ value = '', onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      // 내용이 바뀔 때마다 상위에 전달
      onChange && onChange(editor.getHTML())
    }
  })

  if (!editor) return null

  return (
    <div className="editor-container">
      {/* <MenuBar editor={editor} /> */}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
