import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ScanIcon, MinusIcon, PlusIcon, TrashIcon, CreditCardIcon, ShoppingCartIcon, UserIcon, MoonIcon, SunIcon, MicIcon, GlobeIcon, GiftIcon, CameraIcon, BellIcon, TagIcon, TruckIcon, BarChart4Icon, HeartIcon, ShareIcon } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
  stock: number
  ar_model?: string
  rating: number
  discount?: number
}

interface Customer {
  id: string
  name: string
  loyaltyPoints: number
  preferences: string[]
  avatar: string
}

const products: Product[] = [
  { id: '1', name: 'Ultra HD 8K TV', price: 2999.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=8K+TV', category: 'TVs', stock: 15, ar_model: '/tv_ar_model.glb', rating: 4.8, discount: 10 },
  { id: '2', name: 'Quantum Laptop Pro', price: 1799.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=Laptop', category: 'Computers', stock: 23, rating: 4.5 },
  { id: '3', name: 'NextGen Gaming Console', price: 499.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=Console', category: 'Gaming', stock: 37, rating: 4.9, discount: 5 },
  { id: '4', name: 'Smart Home Hub', price: 199.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=Smart+Hub', category: 'Smart Home', stock: 42, rating: 4.2 },
  { id: '5', name: 'Professional Camera Set', price: 2499.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=Camera', category: 'Photography', stock: 8, ar_model: '/camera_ar_model.glb', rating: 4.7 },
  { id: '6', name: 'Wireless Noise-Canceling Headphones', price: 349.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=Headphones', category: 'Audio', stock: 50, rating: 4.6 },
  { id: '7', name: 'Smartphone X', price: 999.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=Smartphone', category: 'Phones', stock: 30, ar_model: '/phone_ar_model.glb', rating: 4.4, discount: 15 },
  { id: '8', name: 'Robotic Vacuum Cleaner', price: 399.99, quantity: 1, image: '/placeholder.svg?height=100&width=100&text=Vacuum', category: 'Smart Home', stock: 18, rating: 4.3 },
]

const customers: Customer[] = [
  { id: '1', name: 'John Doe', loyaltyPoints: 500, preferences: ['Gaming', 'Computers'], avatar: '/placeholder.svg?height=50&width=50&text=JD' },
  { id: '2', name: 'Jane Smith', loyaltyPoints: 750, preferences: ['Smart Home', 'Photography'], avatar: '/placeholder.svg?height=50&width=50&text=JS' },
  { id: '3', name: 'Bob Johnson', loyaltyPoints: 250, preferences: ['TVs', 'Gaming'], avatar: '/placeholder.svg?height=50&width=50&text=BJ' },
  { id: '4', name: 'Alice Brown', loyaltyPoints: 1000, preferences: ['Audio', 'Phones'], avatar: '/placeholder.svg?height=50&width=50&text=AB' },
]

export default function AdvancedElectronicsPOS() {
  const [cartProducts, setCartProducts] = useState<Product[]>([])
  const [scannedCode, setScannedCode] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [discount, setDiscount] = useState(0)
  const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState('en')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [giftWrap, setGiftWrap] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [arMode, setArMode] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.lang = language
      recognitionRef.current.onresult = handleSpeechResult
    }
  }, [language])

  const handleSpeechResult = (event: any) => {
    const last = event.results.length - 1
    const command = event.results[last][0].transcript.toLowerCase()

    if (command.includes('add') || command.includes('scan')) {
      const productName = command.replace('add', '').replace('scan', '').trim()
      const product = products.find(p => p.name.toLowerCase().includes(productName))
      if (product) addProduct(product.id)
    } else if (command.includes('remove') || command.includes('delete')) {
      const productName = command.replace('remove', '').replace('delete', '').trim()
      const product = cartProducts.find(p => p.name.toLowerCase().includes(productName))
      if (product) removeProduct(product.id)
    } else if (command.includes('checkout')) {
      handleCheckout()
    }
  }

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
    setIsListening(!isListening)
  }

  const addProduct = (code: string) => {
    setIsScanning(true)
    setTimeout(() => {
      const product = products.find(p => p.id === code)
      if (product) {
        const existingProduct = cartProducts.find(p => p.id === product.id)
        if (existingProduct) {
          setCartProducts(cartProducts.map(p => 
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          ))
        } else {
          setCartProducts([...cartProducts, { ...product, quantity: 1 }])
        }
        setLastScannedProduct(product)
        addNotification(`${product.name} added to cart`)
      }
      setScannedCode('')
      setIsScanning(false)
    }, 500)
  }

  const updateQuantity = (id: string, change: number) => {
    setCartProducts(cartProducts.map(product => 
      product.id === id ? { ...product, quantity: Math.max(0, product.quantity + change) } : product
    ).filter(product => product.quantity > 0))
  }

  const removeProduct = (id: string) => {
    const product = cartProducts.find(p => p.id === id)
    if (product) {
      setCartProducts(cartProducts.filter(p => p.id !== id))
      addNotification(`${product.name} removed from cart`)
    }
  }

  const calculateTotal = () => {
    const subtotal = cartProducts.reduce((sum, product) => {
      const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price
      return sum + discountedPrice * product.quantity
    }, 0)
    const loyaltyDiscount = selectedCustomer ? (selectedCustomer.loyaltyPoints * 0.01) : 0
    const giftWrapFee = giftWrap ? 5.99 : 0
    return subtotal - discount - loyaltyDiscount + giftWrapFee
  }

  const handleCheckout = () => {
    const total = calculateTotal()
    alert(`Checkout completed for ${selectedCustomer ? selectedCustomer.name : 'Guest'}. Total: ${formatCurrency(total)}`)
    if (selectedCustomer) {
      const newLoyaltyPoints = Math.floor(total)
      alert(`${selectedCustomer.name} earned ${newLoyaltyPoints} loyalty points!`)
    }
    setCartProducts([])
    setCustomerName('')
    setDiscount(0)
    setLastScannedProduct(null)
    setSelectedCustomer(null)
    setGiftWrap(false)
    addNotification('Checkout completed successfully')
  }

  const formatCurrency = (amount: number) => {
    const currencies = {
      USD: { symbol: '$', rate: 1 },
      EUR: { symbol: '€', rate: 0.84 },
      GBP: { symbol: '£', rate: 0.73 },
      JPY: { symbol: '¥', rate: 110.14 },
    }
    const { symbol, rate } = currencies[selectedCurrency as keyof typeof currencies]
    return `${symbol}${(amount * rate).toFixed(2)}`
  }

  const recommendedProducts = products
    .filter(p => !cartProducts.some(cp => cp.id === p.id) && selectedCustomer?.preferences.includes(p.category))
    .slice(0, 3)

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message))
    }, 5000)
  }

  return (
    <TooltipProvider>
      <div className={`container mx-auto p-4 max-w-7xl ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="mb-4 shadow-lg">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ScanIcon className="mr-2 h-6 w-6" />
                    {language === 'en' ? 'Product Scanner' : 'Escáner de Productos'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={toggleSpeechRecognition}>
                          <MicIcon className={`h-5 w-5 ${isListening ? 'text-red-500' : 'text-white'}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isListening ? 'Stop voice commands' : 'Start voice commands'}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
                          <GlobeIcon className="h-5 w-5 text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
                          {isDarkMode ? <SunIcon className="h-5 w-5 text-white" /> : <MoonIcon className="h-5 w-5 text-white" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder={language === 'en' ? "Scan or enter product code" : "Escanear o ingresar código de producto"}
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    className="flex-grow text-lg"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={() => addProduct(scannedCode)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={isScanning}
                      >
                        {isScanning ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <ScanIcon className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <>
                            <ScanIcon className="mr-2 h-5 w-5" /> {language === 'en' ? 'Add (F2)' : 'Agregar (F2)'}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {language === 'en' ? 'Add product to cart' : 'Agregar producto al carrito'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4 shadow-lg">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <ShoppingCartIcon className="mr-2 h-6 w-6" />
                  {language === 'en' ? 'Cart' : 'Carrito'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[calc(100vh-400px)] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Product' : 'Producto'}</TableHead>
                        <TableHead>{language === 'en' ? 'Price' : 'Precio'}</TableHead>
                        <TableHead>{language === 'en' ? 'Quantity' : 'Cantidad'}</TableHead>
                        <TableHead>{language === 'en' ? 'Total' : 'Total'}</TableHead>
                        <TableHead>{language === 'en' ? 'Actions' : 'Acciones'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {cartProducts.map((product) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                <span>{product.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.discount ? (
                                <div>
                                  <span className="line-through text-gray-500">{formatCurrency(product.price)}</span>
                                  <span className="ml-2 text-green-500">{formatCurrency(product.price * (1 - product.discount / 100))}</span>
                                </div>
                              ) : (
                                formatCurrency(product.price)
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(product.id, -1)}>
                                  <MinusIcon className="h-4 w-4" />
                                </Button>
                                <span className="font-bold">{product.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(product.id, 1)}>
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(product.price * product.quantity)}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="destructive" onClick={() => removeProduct(product.id)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4 shadow-lg">
              <CardHeader className="pb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-t-lg">
                <CardTitle>{language === 'en' ? 'Recommended Products' : 'Productos Recomendados'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="flex flex-col items-center">
                      <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg mb-2" />
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${
                              star <= product.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs">({product.rating})</span>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => addProduct(product.id)}>
                        {language === 'en' ? 'Add to Cart' : 'Agregar al Carrito'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-4 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <CardTitle>{language === 'en' ? 'Last Scanned Product' : 'Último Producto Escaneado'}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <AnimatePresence mode="wait">
                  {lastScannedProduct ? (
                    <motion.div
                      key={lastScannedProduct.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <img 
                        src={lastScannedProduct.image} 
                        alt={lastScannedProduct.name} 
                        className="w-32 h-32 object-cover mb-2 rounded-lg shadow-md"
                      />
                      <p className="font-semibold text-lg">{lastScannedProduct.name}</p>
                      <Badge variant="secondary" className="mt-1 text-lg">
                        {formatCurrency(lastScannedProduct.price)}
                      </Badge>
                      <div className="flex items-center mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${
                              star <= lastScannedProduct.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2">({lastScannedProduct.rating})</span>
                      </div>
                      {lastScannedProduct.ar_model && (
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => setArMode(true)}>
                          <CameraIcon className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'View in AR' : 'Ver en RA'}
                        </Button>
                      )}
                      <div className="mt-2 text-sm">
                        <span className="font-semibold">{language === 'en' ? 'In Stock:' : 'En Stock:'}</span> {lastScannedProduct.stock}
                      </div>
                      {lastScannedProduct.discount && (
                        <Badge variant="destructive" className="mt-2">
                          {language === 'en' ? 'SALE' : 'OFERTA'} {lastScannedProduct.discount}% OFF
                        </Badge>
                      )}
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground"
                    >
                      {language === 'en' ? 'No product scanned yet' : 'Aún no se ha escaneado ningún producto'}
                    </motion.p>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="shadow-lg overflow-hidden mb-4">
              <CardHeader className="pb-2 bg-gradient-to-r from-pink-500 to-red-500 text-white">
                <CardTitle className="flex items-center">
                  <CreditCardIcon className="mr-2 h-6 w-6" />
                  {language === 'en' ? 'Checkout' : 'Finalizar Compra'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="customer">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer">{language === 'en' ? 'Customer' : 'Cliente'}</TabsTrigger>
                    <TabsTrigger value="payment">{language === 'en' ? 'Payment' : 'Pago'}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="customer">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="customerSelect" className="text-lg">
                          {language === 'en' ? 'Select Customer' : 'Seleccionar Cliente'}
                        </Label>
                        <Select onValueChange={(value) => setSelectedCustomer(customers.find(c => c.id === value) || null)}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'en' ? "Select a customer" : "Seleccione un cliente"} />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                <div className="flex items-center">
                                  <img src={customer.avatar} alt={customer.name} className="w-6 h-6 rounded-full mr-2" />
                                  {customer.name} - {customer.loyaltyPoints} points
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedCustomer && (
                        <div>
                          <p className="font-semibold">{language === 'en' ? 'Loyalty Points:' : 'Puntos de Fidelidad:'} {selectedCustomer.loyaltyPoints}</p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? 'Discount:' : 'Descuento:'} {formatCurrency(selectedCustomer.loyaltyPoints * 0.01)}
                          </p>
                          <div className="mt-2">
                            <Label htmlFor="loyaltySlider" className="text-sm">
                              {language === 'en' ? 'Use Loyalty Points:' : 'Usar Puntos de Fidelidad:'}
                            </Label>
                            <Slider
                              id="loyaltySlider"
                              max={selectedCustomer.loyaltyPoints}
                              step={10}
                              value={[discount]}
                              onValueChange={(value) => setDiscount(value[0])}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Switch id="gift-wrap" checked={giftWrap} onCheckedChange={setGiftWrap} />
                        <Label htmlFor="gift-wrap">{language === 'en' ? 'Gift Wrap (+$5.99)' : 'Envolver para Regalo (+$5.99)'}</Label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="payment">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currencySelect" className="text-lg">
                          {language === 'en' ? 'Select Currency' : 'Seleccionar Moneda'}
                        </Label>
                        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'en' ? "Select currency" : "Seleccione moneda"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="discount" className="text-lg">{language === 'en' ? 'Additional Discount' : 'Descuento Adicional'}</Label>
                        <Input
                          id="discount"
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          placeholder={language === 'en' ? "Enter discount amount" : "Ingrese el monto del descuento"}
                          className="mt-1"
                        />
                      </div>
                      <motion.div
                        className="text-xl font-bold"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                      >
                        {language === 'en' ? 'Total:' : 'Total:'} {formatCurrency(calculateTotal())}
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="bg-gray-50">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-lg py-6"
                      onClick={handleCheckout}
                      disabled={cartProducts.length ===  0}
                    >
                      <CreditCardIcon className="mr-2 h-6 w-6" /> 
                      {language === 'en' ? 'Complete Payment (F3)' : 'Completar Pago (F3)'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {language === 'en' ? 'Finalize the transaction' : 'Finalizar la transacción'}
                  </TooltipContent>
                </Tooltip>
              </CardFooter>
            </Card>

            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle className="flex items-center">
                  <BarChart4Icon className="mr-2 h-6 w-6" />
                  {language === 'en' ? 'Sales Analytics' : 'Análisis de Ventas'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">{language === 'en' ? 'Daily Sales Target' : 'Objetivo de Ventas Diarias'}</Label>
                    <Progress value={75} className="mt-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">{language === 'en' ? 'Top Category' : 'Categoría Principal'}</Label>
                      <p className="font-semibold">Electronics</p>
                    </div>
                    <div>
                      <Label className="text-sm">{language === 'en' ? 'Customer Satisfaction' : 'Satisfacción del Cliente'}</Label>
                      <p className="font-semibold">4.8/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="bg-white p-2 rounded-lg shadow-lg flex items-center space-x-2"
            >
              <BellIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{notification}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}