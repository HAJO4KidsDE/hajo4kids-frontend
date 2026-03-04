<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline'
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full'
      }
    })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// Watch for external changes
watch(() => props.modelValue, (value) => {
  if (!editor.value) return
  const html = editor.value.getHTML()
  if (value !== html) {
    editor.value.commands.setContent(value, false)
  }
})

// Toolbar actions
const setLink = () => {
  if (!editor.value) return
  const url = window.prompt('URL eingeben:')
  if (url) {
    editor.value.chain().focus().setLink({ href: url }).run()
  }
}

const unsetLink = () => {
  if (!editor.value) return
  editor.value.chain().focus().unsetLink().run()
}

const setImage = () => {
  if (!editor.value) return
  const url = window.prompt('Bild-URL eingeben:')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="border rounded-md bg-background">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'bg-primary text-primary-foreground': editor?.isActive('bold') }"
        class="p-2 rounded hover:bg-accent"
        title="Fett"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
        </svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'bg-primary text-primary-foreground': editor?.isActive('italic') }"
        class="p-2 rounded hover:bg-accent"
        title="Kursiv"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-primary text-primary-foreground': editor?.isActive('heading', { level: 2 }) }"
        class="p-2 rounded hover:bg-accent"
        title="Überschrift"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M4 12h8M4 18V6M4 6h8M14 12h6M14 6v12"></path>
        </svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-primary text-primary-foreground': editor?.isActive('bulletList') }"
        class="p-2 rounded hover:bg-accent"
        title="Liste"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-primary text-primary-foreground': editor?.isActive('blockquote') }"
        class="p-2 rounded hover:bg-accent"
        title="Zitat"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </button>
      <div class="w-px bg-border mx-1"></div>
      <button
        type="button"
        @click="setLink"
        :class="{ 'bg-primary text-primary-foreground': editor?.isActive('link') }"
        class="p-2 rounded hover:bg-accent"
        title="Link"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
      <button
        type="button"
        v-if="editor?.isActive('link')"
        @click="unsetLink"
        class="p-2 rounded hover:bg-accent"
        title="Link entfernen"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
          <line x1="12" y1="2" x2="12" y2="12"></line>
        </svg>
      </button>
      <button
        type="button"
        @click="setImage"
        class="p-2 rounded hover:bg-accent"
        title="Bild"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </button>
    </div>
    
    <!-- Editor -->
    <EditorContent 
      :editor="editor" 
      class="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] focus:outline-none"
    />
  </div>
</template>

<style>
.tiptap {
  outline: none;
}
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.tiptap ul,
.tiptap ol {
  padding-left: 1rem;
}
.tiptap blockquote {
  padding-left: 1rem;
  border-left: 3px solid var(--border);
}
</style>