import React from 'react'

export default function MenuBar({ editor }) {
  if (!editor) return null

  const editorState = {
    isBold: editor.isActive('bold'),
    canBold: editor.can().chain().toggleBold().run(),
    isItalic: editor.isActive('italic'),
    canItalic: editor.can().chain().toggleItalic().run(),
    isStrike: editor.isActive('strike'),
    canStrike: editor.can().chain().toggleStrike().run(),
    isCode: editor.isActive('code'),
    canCode: editor.can().chain().toggleCode().run(),
    isParagraph: editor.isActive('paragraph'),
    isHeading1: editor.isActive('heading', { level: 1 }),
    isHeading2: editor.isActive('heading', { level: 2 }),
    isBulletList: editor.isActive('bulletList'),
    isOrderedList: editor.isActive('orderedList'),
    isBlockquote: editor.isActive('blockquote'),
    canUndo: editor.can().chain().undo().run(),
    canRedo: editor.can().chain().redo().run(),
  }

  const colors = ['#000000', '#f5222d', '#fa8c16', '#faad14', '#52c41a', '#1890ff', '#722ed1']

  return (
    <div className="control-group">
      <div className="button-group">
        {/* 텍스트 스타일 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? 'is-active' : ''}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? 'is-active' : ''}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? 'is-active' : ''}
        >
          S
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? 'is-active' : ''}
        >
          {'</>'}
        </button>

        {/* 글자 색 */}
        {colors.map(color => (
          <button
            key={color}
            style={{ color }}
            onClick={() => editor.chain().focus().setColor(color).run()}
          >
            A
          </button>
        ))}

        {/* 헤딩 */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? 'is-active' : ''}
        >
          P
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState.isHeading1 ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState.isHeading2 ? 'is-active' : ''}
        >
          H2
        </button>

        {/* 리스트 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? 'is-active' : ''}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? 'is-active' : ''}
        >
          1. List
        </button>

        {/* 인용구 */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? 'is-active' : ''}
        >
          ❝ ❞
        </button>

        {/* 실행 취소 / 다시 실행 */}
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
          Redo
        </button>
      </div>
    </div>
  )
}
