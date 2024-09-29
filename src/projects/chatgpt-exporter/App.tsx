'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Code, FileText, Download, Search, Sparkles, Sun, Moon, HelpCircle, AlertCircle, XCircle, Zap, ArrowRight, Settings, RotateCw, Bookmark, Share2 } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

// Mock data for simulating API calls
const mockChatData = {
  "66f7f694-8668-8003-920a-e5692fa8a019": {
    title: "Discussão sobre IA Generativa",
    messageCount: 15,
    createdAt: "2023-09-15T14:30:00Z"
  },
  "55e6e583-7557-7002-810b-d4581eb7b008": {
    title: "Explorando o Futuro da Tecnologia",
    messageCount: 23,
    createdAt: "2023-09-16T10:15:00Z"
  },
  "error-test-id": {
    error: true,
    message: "Erro ao carregar informações do chat. Por favor, tente novamente."
  }
}

// Function to simulate API call with mock data
const mockApiCall = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const chatId = url.split('/').pop()
      if (mockChatData[chatId]) {
        if (mockChatData[chatId].error) {
          reject(new Error(mockChatData[chatId].message))
        } else {
          resolve(mockChatData[chatId])
        }
      } else {
        reject(new Error('Chat não encontrado. Por favor, verifique a URL e tente novamente.'))
      }
    }, 1500) // Simulates a 1.5 second delay
  })
}

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [text])

  return <span>{displayText}</span>
}

const AnimatedBackground = ({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: isDarkMode
            ? "linear-gradient(45deg, #4A148C, #311B92, #1A237E, #0D47A1)"
            : "linear-gradient(45deg, #E1F5FE, #B3E5FC, #81D4FA, #4FC3F7)"
        }}
        animate={{
          background: isDarkMode
            ? ["linear-gradient(45deg, #4A148C, #311B92, #1A237E, #0D47A1)", "linear-gradient(45deg, #311B92, #1A237E, #0D47A1, #4A148C)"]
            : ["linear-gradient(45deg, #E1F5FE, #B3E5FC, #81D4FA, #4FC3F7)", "linear-gradient(45deg, #B3E5FC, #81D4FA, #4FC3F7, #E1F5FE)"]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  )
}

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500 opacity-10 blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-green-500 opacity-10 blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  )
}

const FadeInWhenVisible = ({ children }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
    >
      {children}
    </motion.div>
  )
}

const PulseAnimation = ({ children }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {children}
    </motion.div>
  )
}

export default function EnhancedExportPage() {
  const [url, setUrl] = useState('')
  const [chatInfo, setChatInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    includeQuestions: true,
    includeAnswers: true,
    onlyCode: false,
    format: 'markdown'
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
  }, [])

  const validateUrl = (url: string) => {
    const regex = /^https:\/\/chat\.openai\.com\/share\/[a-f0-9-]{36}$/
    return regex.test(url)
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim() === '') return

    if (!validateUrl(url)) {
      setError('Formato de URL inválido. Por favor, use um link de compartilhamento válido do ChatGPT.')
      toast.error('Formato de URL inválido. Por favor, use um link de compartilhamento válido do ChatGPT.')
      return
    }

    setIsLoading(true)
    setError('')
    setChatInfo(null)

    try {
      const data = await mockApiCall(url)
      setChatInfo(data)
      toast.success('Informações do chat carregadas com sucesso!')
    } catch (error) {
      console.error('Erro ao buscar informações do chat:', error)
      setError(error.message || 'Falha ao carregar informações do chat. Por favor, tente novamente.')
      toast.error(error.message || 'Falha ao carregar informações do chat. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionChange = (option: string, value: boolean | string) => {
    setExportOptions(prev => ({ ...prev, [option]: value }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulating export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Exportando com opções:', exportOptions)
      toast.success('Exportação concluída com sucesso!')
    } catch (error) {
      console.error('Falha na exportação:', error)
      toast.error('Falha na exportação. Por favor, tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      <FloatingShapes />
      <Toaster position="top-center" />
      
      <motion.div 
        className="absolute top-4 right-4 flex items-center space-x-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className={`rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-all duration-300 hover:scale-110`}>
              <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogTrigger>
          <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} max-w-md`}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2">Como usar o ChatGPT Export Pro</DialogTitle>
              <DialogDescription className="text-lg">
                Siga estes passos para exportar suas conversas do ChatGPT:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                <p>Abra sua conversa do ChatGPT em um navegador web.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                <p>Clique no botão "Compartilhar" para gerar um link compartilhável.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                <div>
                  <p>Copie a URL gerada. Ela deve se parecer com:</p>
                  <code className="block p-2 bg-gray-100 dark:bg-gray-700 rounded mt-2 text-sm">https://chat.openai.com/share/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                <p>Cole esta URL no campo de entrada em nossa página.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">5</div>
                <p>Clique no ícone de pesquisa para buscar informações básicas sobre a conversa.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">6</div>
                <p>Personalize suas opções de exportação conforme necessário.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">7</div>
                <p>Clique no botão "Exportar" para baixar sua conversa.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleDarkMode} 
          className={`rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-all duration-300 hover:scale-110`}
        >
          {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </motion.div>

      <motion.div 
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-7xl font-extrabold mb-6 ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'}`}>
          <TypewriterText text="ChatGPT Export Pro" />
        </h1>
        <p className={`text-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Simplifique suas exportações de conversas com estilo</p>
        <PulseAnimation>
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}`}>
            <Zap className="w-6 h-6 mr-2" />
            Potencializado por IA avançada
          </div>
        </PulseAnimation>
      </motion.div>
      
      <FadeInWhenVisible>
        <motion.div 
          className="w-full max-w-3xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl rounded-3xl overflow-hidden border-t-4 ${isDarkMode ? 'border-purple-500' : 'border-purple-600'}`}>
            <CardContent className="p-8">
              <form onSubmit={handleUrlSubmit} className="relative mb-8">
                <Input
                  type="text"
                  placeholder="Cole aqui o link de compartilhamento do ChatGPT"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`pr-16 h-16 text-lg rounded-full shadow-lg ${isDarkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} transition-all duration-300 focus:ring-2 focus:ring-purple-500`}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className={`absolute right-2 top-2 rounded-full w-12 h-12 ${isDarkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} transition-all duration-300 hover:scale-110`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCw className="h-6 w-6 text-white" />
                    </motion.div>
                  ) : (
                    <Search className="h-6 w-6" />
                  )}
                  <span className="sr-only">Carregar Informações do Chat</span>
                </Button>
              </form>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 flex items-start"
                  >
                    <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-semibold text-lg">Erro</p>
                      <p>{error}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setError('')}
                      className="ml-2 -mr-2 -mt-2 h-8 w-8 rounded-full transition-all duration-300 hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      <XCircle className="h-5 w-5" />
                      <span className="sr-only">Dispensar</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {chatInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 p-6 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg"
                  >
                    <h3 className="text-2xl font-bold mb-4">Informações do Chat</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                        <p className="text-sm opacity-75">Título</p>
                        <p className="font-medium text-lg">{chatInfo.title}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                        <p className="text-sm opacity-75">Mensagens</p>
                        <p className="font-medium text-lg">{chatInfo.messageCount}</p>
                      </div>
                      <div className="col-span-2 bg-white bg-opacity-20 p-3 rounded-lg">
                        <p className="text-sm opacity-75">Criado em</p>
                        <p className="font-medium text-lg">{new Date(chatInfo.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {chatInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      {['includeQuestions', 'includeAnswers', 'onlyCode'].map((option) => (
                        <div key={option} className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Label htmlFor={option} className={`flex items-center space-x-3 text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                  {option === 'includeQuestions' && <MessageSquare className="w-6 h-6" />}
                                  {option === 'includeAnswers' && <MessageSquare className="w-6 h-6" />}
                                  {option === 'onlyCode' && <Code className="w-6 h-6" />}
                                  <span>{option.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                                </Label>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{`Alternar para ${exportOptions[option] ? 'excluir' : 'incluir'} ${option.replace(/([A-Z])/g, ' $1').toLowerCase()} na exportação`}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Switch
                            id={option}
                            checked={exportOptions[option]}
                            onCheckedChange={(checked) => handleOptionChange(option, checked)}
                            className="scale-125"
                          />
                        </div>
                      ))}
                    </div>
                    <Tabs value={exportOptions.format} onValueChange={(value) => handleOptionChange('format', value)} className="w-full">
                      <TabsList className={`grid w-full grid-cols-4 rounded-full p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {['markdown', 'txt', 'html', 'json'].map((format) => (
                          <TabsTrigger 
                            key={format} 
                            value={format} 
                            className={`rounded-full transition-all duration-300 ${isDarkMode ? 'data-[state=active]:bg-purple-500 data-[state=active]:text-white' : 'data-[state=active]:bg-white'}`}
                          >
                            <FileText className="w-5 h-5 mr-2" />
                            {format.toUpperCase()}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    <div className="flex flex-col space-y-4">
                      <Button 
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        variant="outline"
                        className={`w-full justify-between ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <span className="flex items-center">
                          <Settings className="w-5 h-5 mr-2" />
                          Opções Avançadas
                        </span>
                        <ArrowRight className={`w-5 h-5 transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} />
                      </Button>
                      <AnimatePresence>
                        {showAdvancedOptions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 overflow-hidden"
                          >
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <Label htmlFor="dateRange" className="block mb-2">Intervalo de Datas</Label>
                              <Input
                                id="dateRange"
                                type="text"
                                placeholder="ex: 01/01/2023 - 31/12/2023"
                                className={`w-full ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                              />
                            </div>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <Label htmlFor="keywords" className="block mb-2">Palavras-chave</Label>
                              <Input
                                id="keywords"
                                type="text"
                                placeholder="Separadas por vírgula"
                                className={`w-full ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                              />
                            </div>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <Label className="block mb-2">Opções Adicionais</Label>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <Switch id="includeTimestamps" />
                                  <Label htmlFor="includeTimestamps" className="ml-2">Incluir Timestamps</Label>
                                </div>
                                <div className="flex items-center">
                                  <Switch id="includeMetadata" />
                                  <Label htmlFor="includeMetadata" className="ml-2">Incluir Metadados</Label>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleExport} 
                        className={`flex-1 h-16 text-xl font-bold rounded-full ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'} text-white transition-all duration-300 transform hover:scale-105 active:scale-95`}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <motion.div
                            className="flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <RotateCw className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" />
                            Exportando...
                          </motion.div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Download className="mr-3 h-6 w-6" /> 
                            Exportar Conversa
                          </div>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-16 w-16 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <Bookmark className="h-6 w-6" />
                        <span className="sr-only">Salvar Template</span>
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-16 w-16 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <Share2 className="h-6 w-6" />
                        <span className="sr-only">Compartilhar</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </FadeInWhenVisible>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className={`flex items-center justify-center text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Sparkles className="w-6 h-6 mr-2" />
          Desenvolvido com tecnologia avançada de IA
        </p>
      </motion.div>
    </div>
  )
}