'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Resizable } from 're-resizable'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { PlusIcon, FolderIcon, FileIcon, SearchIcon, BoldIcon, ItalicIcon, ListIcon, LinkIcon, MoonIcon, SunIcon, TagIcon, DownloadIcon, TrashIcon, PencilIcon, SaveIcon, ImageIcon, CodeIcon, TableIcon, LayoutIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { v4 as uuidv4 } from 'uuid'

// Fake data
const initialFiles = [
  {
    id: uuidv4(),
    name: 'Welcome Note',
    content: `# Welcome to EnhancedMarkdownNoteApp!

This is your first note. Feel free to edit it or create new ones.

## Features:
- **Markdown Support**: Write in Markdown and see the preview in real-time
- **Syntax Highlighting**: Code blocks are automatically highlighted
- **File Organization**: Create folders to organize your notes
- **Dark Mode**: Toggle between light and dark themes
- **Tags**: Add tags to your notes for easy categorization
- **Search**: Quickly find your notes with the search feature

## Markdown Examples:

### Lists
1. Ordered item 1
2. Ordered item 2
   - Unordered sub-item
   - Another sub-item
3. Ordered item 3

### Code Block
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('Markdown Enthusiast');
\`\`\`

### Table
| Feature | Description |
|---------|-------------|
| Markdown | Full support |
| Preview | Real-time |
| Themes | Light & Dark |

### Image
![Markdown Logo](https://markdown-here.com/img/icon256.png)

Enjoy taking notes!`,
    path: '/',
    tags: ['welcome', 'tutorial'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Meeting Notes',
    content: `# Team Meeting - 2023-09-28

## Attendees
- John Doe
- Jane Smith
- Bob Johnson

## Agenda
1. Project updates
2. Budget review
3. Upcoming deadlines

## Action Items
- [ ] John: Prepare Q4 projections
- [ ] Jane: Schedule client meeting
- [ ] Bob: Update project timeline

Next meeting: 2023-10-05`,
    path: '/',
    tags: ['meeting', 'work'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
]

const initialFolders = [
  {
    id: uuidv4(),
    name: 'Work',
    path: '/'
  },
  {
    id: uuidv4(),
    name: 'Personal',
    path: '/'
  }
]

type File = {
  id: string
  name: string
  content: string
  path: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

type Folder = {
  id: string
  name: string
  path: string
}

export default function EnhancedMarkdownNoteApp() {
  const [files, setFiles] = useState<File[]>(initialFiles)
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [activeFile, setActiveFile] = useState<File | null>(initialFiles[0])
  const [activeTab, setActiveTab] = useState<string | null>(initialFiles[0].id)
  const [searchTerm, setSearchTerm] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<File | null>(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [previewMode, setPreviewMode] = useState<'side-by-side' | 'full-page'>('full-page')
  const { toast } = useToast()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.body.className = theme
  }, [theme])

  const handleFileSelect = (file: File) => {
    setActiveFile(file)
    setActiveTab(file.id)
  }

  const handleNewFile = () => {
    const newFile: File = {
      id: uuidv4(),
      name: 'New Note',
      content: '# New Note\n\nStart writing here...',
      path: '/',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setFiles([...files, newFile])
    handleFileSelect(newFile)
    toast({
      title: "New note created",
      description: "Your new note has been created successfully.",
    })
  }

  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:')
    if (folderName) {
      const newFolder: Folder = {
        id: uuidv4(),
        name: folderName,
        path: '/'
      }
      setFolders([...folders, newFolder])
      toast({
        title: "New folder created",
        description: `Folder "${folderName}" has been created successfully.`,
      })
    }
  }

  const handleContentChange = (value: string) => {
    if (activeFile) {
      const updatedFiles = files.map(file =>
        file.id === activeFile.id ? { ...file, content: value, updatedAt: new Date().toISOString() } : file
      )
      setFiles(updatedFiles)
      setActiveFile({ ...activeFile, content: value, updatedAt: new Date().toISOString() })
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const insertMarkdown = useCallback((markdown: string) => {
    if (activeFile) {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const content = activeFile.content
        const newContent = content.substring(0, start) + markdown + content.substring(end)
        handleContentChange(newContent)
        
        // Set cursor position after inserted markdown
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + markdown.length, start + markdown.length)
        }, 0)
      }
    }
  }, [activeFile])

  const handleExport = () => {
    if (activeFile) {
      const blob = new Blob([activeFile.content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activeFile.name}.md`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Note exported",
        description: `"${activeFile.name}" has been exported successfully.`,
      })
    }
  }

  const handleDeleteFile = (file: File) => {
    setFileToDelete(file)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteFile = () => {
    if (fileToDelete) {
      const updatedFiles = files.filter(f => f.id !== fileToDelete.id)
      setFiles(updatedFiles)
      if (activeFile && activeFile.id === fileToDelete.id) {
        setActiveFile(updatedFiles[0] || null)
        setActiveTab(updatedFiles[0]?.id || null)
      }
      setIsDeleteDialogOpen(false)
      setFileToDelete(null)
      toast({
        title: "Note deleted",
        description: `"${fileToDelete.name}" has been deleted successfully.`,
        variant: "destructive",
      })
    }
  }

  const handleAddTag = () => {
    if (activeFile) {
      const tag = prompt('Enter a new tag:')
      if (tag && !activeFile.tags.includes(tag)) {
        const updatedFile = { ...activeFile, tags: [...activeFile.tags, tag], updatedAt: new Date().toISOString() }
        const updatedFiles = files.map(f => f.id === activeFile.id ? updatedFile : f)
        setFiles(updatedFiles)
        setActiveFile(updatedFile)
        toast({
          title: "Tag added",
          description: `Tag "${tag}" has been added to "${activeFile.name}".`,
        })
      }
    }
  }

  const handleRenameFile = () => {
    if (activeFile) {
      setNewFileName(activeFile.name)
      setIsRenameDialogOpen(true)
    }
  }

  const confirmRenameFile = () => {
    if (activeFile && newFileName) {
      const updatedFile = { ...activeFile, name: newFileName, updatedAt: new Date().toISOString() }
      const updatedFiles = files.map(f => f.id === activeFile.id ? updatedFile : f)
      setFiles(updatedFiles)
      setActiveFile(updatedFile)
      setIsRenameDialogOpen(false)
      toast({
        title: "Note renamed",
        description: `"${activeFile.name}" has been renamed to "${newFileName}".`,
      })
    }
  }

  const handleSave = () => {
    if (activeFile) {
      const updatedFile = { ...activeFile, updatedAt: new Date().toISOString() }
      const updatedFiles = files.map(f => f.id === activeFile.id ? updatedFile : f)
      setFiles(updatedFiles)
      setActiveFile(updatedFile)
      toast({
        title: "Changes saved",
        description: `"${activeFile.name}" has been saved successfully.`,
      })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            handleSave()
            break
          case 'b':
            e.preventDefault()
            insertMarkdown('**Bold**')
            break
          case 'i':
            e.preventDefault()
            insertMarkdown('*Italic*')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [insertMarkdown])

  return (
    <div className={`flex h-screen bg-gradient-to-br from-teal-100 to-purple-100 text-gray-800 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <style jsx global>{`
        .dark {
          background: linear-gradient(to bottom right, #1a202c, #2d3748);
          color: #e2e8f0;
        }
        .dark .bg-white {
          background-color: #2d3748;
        }
        .dark .text-gray-800 {
          color: #e2e8f0;
        }
        .dark .border-gray-200 {
          border-color: #4a5568;
        }
        .dark .hover\:bg-gray-100:hover {
          background-color: #4a5568;
        }
        .markdown-body {
          font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
          font-size: 16px;
          line-height: 1.5;
          word-wrap: break-word;
        }
        .markdown-body h1 {
          font-size: 2em;
          border-bottom: 1px solid #eaecef;
          margin-bottom: 16px;
          padding-bottom: 0.3em;
        }
        .markdown-body h2 {
          font-size: 1.5em;
          border-bottom: 1px solid #eaecef;
          margin-bottom: 16px;
          padding-bottom: 0.3em;
        }
        .markdown-body h3 {
          font-size: 1.25em;
          margin-bottom: 16px;
        }
        .markdown-body p {
          margin-bottom: 16px;
        }
        .markdown-body ul, .markdown-body ol {
          padding-left: 2em;
          margin-bottom: 16px;
        }
        .markdown-body li {
          margin-bottom: 0.25em;
        }
        .markdown-body code {
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 85%;
          background-color: rgba(27,31,35,0.05);
          border-radius: 3px;
        }
        .markdown-body pre {
          padding: 16px;
          overflow: auto;
          font-size: 85%;
          line-height: 1.45;
          background-color: #f6f8fa;
          border-radius: 3px;
          margin-bottom: 16px;
        }
        .markdown-body blockquote {
          padding: 0 1em;
          color: #6a737d;
          border-left: 0.25em solid #dfe2e5;
          margin-bottom: 16px;
        }
        .markdown-body table {
          display: block;
          width: 100%;
          overflow: auto;
          margin-bottom: 16px;
        }
        .markdown-body table th, .markdown-body table td {
          padding: 6px 13px;
          border: 1px solid #dfe2e5;
        }
        .markdown-body table tr {
          background-color: #fff;
          border-top: 1px solid #c6cbd1;
        }
        .markdown-body table tr:nth-child(2n) {
          background-color: #f6f8fa;
        }
        .markdown-body img {
          max-width: 100%;
          box-sizing: content-box;
        }
        .dark .markdown-body {
          color: #e2e8f0;
        }
        .dark .markdown-body h1, .dark .markdown-body h2 {
          border-bottom-color: #4a5568;
        }
        .dark .markdown-body code {
          background-color: rgba(200,200,200,0.15);
        }
        .dark .markdown-body pre {
          background-color: #2d3748;
        }
        .dark .markdown-body blockquote {
          color: #9fa6b2;
          border-left-color: #4a5568;
        }
        .dark .markdown-body table th, .dark .markdown-body table td {
          border-color: #4a5568;
        }
        .dark .markdown-body table tr {
          background-color: #2d3748;
          border-top-color: #4a5568;
        }
        .dark .markdown-body table tr:nth-child(2n) {
          background-color: #283141;
        }
      `}</style>
      <Resizable
        defaultSize={{ width: '20%', height: '100%' }}
        minWidth="200px"
        maxWidth="50%"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full border-r border-gray-200 overflow-auto bg-white shadow-lg"
        >
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-teal-600">EnhancedMarkdownNoteApp</h2>
            <div className="flex space-x-2 mb-4">
              <Button size="icon" variant="outline" onClick={handleNewFile} className="bg-teal-500 hover:bg-teal-600 text-white">
                <PlusIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={handleNewFolder} className="bg-purple-500 hover:bg-purple-600 text-white">
                <FolderIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <AnimatePresence>
              {folders.map(folder => (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <FolderIcon className="h-5 w-5 text-yellow-500" />
                  <span>{folder.name}</span>
                </motion.div>
              ))}
              {filteredFiles.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer ${activeFile?.id === file.id ? 'bg-gray-100' : ''}`}
                  onClick={() => handleFileSelect(file)}
                >
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-5 w-5 text-blue-500" />
                    <span>{file.name}</span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteFile(file); }}>
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </Resizable>
      <div className="flex flex-col flex-grow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between p-2 border-b border-gray-200 bg-white"
        >
          <Tabs value={activeTab || undefined} className="w-full">
            <TabsList>
              {files.map(file => (
                <TabsTrigger
                  key={file.id}
                  value={file.id}
                  onClick={() => handleFileSelect(file)}
                  className="px-4 py-2 rounded-t-lg hover:bg-gray-100"
                >
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" onClick={handleNewFile} className="text-teal-500 hover:text-teal-600">
              <PlusIcon className="h-5 w-5" />
            </Button>
            <Select
              value={theme}
              onValueChange={(value: 'light' | 'dark') => setTheme(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2 p-2 border-b border-gray-200 bg-white"
        >
          <Button size="icon" variant="ghost" onClick={() => insertMarkdown('**Bold**')} className="text-purple-500 hover:text-purple-600">
            <BoldIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => insertMarkdown('*Italic*')} className="text-purple-500 hover:text-purple-600">
            <ItalicIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => insertMarkdown('- List item\n')} className="text-purple-500 hover:text-purple-600">
            <ListIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => insertMarkdown('[Link](https://example.com)')} className="text-purple-500 hover:text-purple-600">
            <LinkIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => insertMarkdown('```\ncode block\n```')} className="text-purple-500 hover:text-purple-600">
            <CodeIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => insertMarkdown('| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |')} className="text-purple-500 hover:text-purple-600">
            <TableIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => insertMarkdown('![Alt text](https://example.com/image.jpg)')} className="text-purple-500 hover:text-purple-600">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleAddTag} className="text-yellow-500 hover:text-yellow-600">
            <TagIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleExport} className="text-green-500 hover:text-green-600">
            <DownloadIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleRenameFile} className="text-blue-500 hover:text-blue-600">
            <PencilIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleSave} className="text-teal-500 hover:text-teal-600">
            <SaveIcon className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setPreviewMode(previewMode === 'full-page' ? 'side-by-side' : 'full-page')} className="text-orange-500 hover:text-orange-600">
            <LayoutIcon className="h-5 w-5" />
          </Button>
        </motion.div>
        <div className="flex-grow overflow-auto bg-white">
          {activeFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full flex"
            >
              {previewMode === 'side-by-side' && (
                <div className="w-1/2 h-full overflow-auto p-4">
                  <div className="mb-2 flex flex-wrap">
                    {activeFile.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="mr-2 mb-2 bg-yellow-100 text-yellow-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <textarea
                    value={activeFile.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full h-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              )}
              <div className={`${previewMode === 'side-by-side' ? 'w-1/2' : 'w-full'} h-full overflow-auto p-4 border-l border-gray-200`}>
                <div className="mb-2 flex flex-wrap">
                  {activeFile.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="mr-2 mb-2 bg-yellow-100 text-yellow-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  className="markdown-body prose max-w-none dark:prose-invert"
                >
                  {activeFile.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteFile}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Note</DialogTitle>
            <DialogDescription>
              Enter a new name for "{activeFile?.name}".
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="New file name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmRenameFile}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}