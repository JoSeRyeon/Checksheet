import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './styles/editor.css'
import './styles.scss'

export default function RichTextEditor({ value = '', onChange, editable = true }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: editable,
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
