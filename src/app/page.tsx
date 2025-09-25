"use client"

import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, Search, Filter, Heart, History, Star, MapPin, Clock, DollarSign, Truck, Shield, X, ChevronDown, ChevronUp, Eye, ExternalLink, Crop } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  shipping: number
  deliveryDays: number
  rating: number
  reviews: number
  store: string
  storeRating: number
  image: string
  url: string
  location: string
  freeShipping: boolean
  trusted: boolean
}

interface SearchHistory {
  id: string
  image: string
  query: string
  date: string
  resultsCount: number
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Tênis Esportivo Masculino Confortável - Corrida e Caminhada',
    price: 89.90,
    originalPrice: 129.90,
    shipping: 0,
    deliveryDays: 3,
    rating: 4.5,
    reviews: 1247,
    store: 'SportMax',
    storeRating: 4.8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    url: '#',
    location: 'São Paulo, SP',
    freeShipping: true,
    trusted: true
  },
  {
    id: '2',
    title: 'Sneaker Premium Couro Legítimo - Edição Limitada',
    price: 159.90,
    shipping: 15.90,
    deliveryDays: 5,
    rating: 4.7,
    reviews: 892,
    store: 'MegaShoes',
    storeRating: 4.6,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    url: '#',
    location: 'Rio de Janeiro, RJ',
    freeShipping: false,
    trusted: true
  },
  {
    id: '3',
    title: 'Tênis Casual Unissex - Várias Cores Disponíveis',
    price: 67.50,
    originalPrice: 95.00,
    shipping: 0,
    deliveryDays: 7,
    rating: 4.2,
    reviews: 2156,
    store: 'FastFeet',
    storeRating: 4.4,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop',
    url: '#',
    location: 'Belo Horizonte, MG',
    freeShipping: true,
    trusted: false
  },
  {
    id: '4',
    title: 'Tênis Running Profissional - Tecnologia Avançada',
    price: 199.90,
    shipping: 0,
    deliveryDays: 2,
    rating: 4.9,
    reviews: 567,
    store: 'ProRunner',
    storeRating: 4.9,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    url: '#',
    location: 'São Paulo, SP',
    freeShipping: true,
    trusted: true
  }
]

const mockHistory: SearchHistory[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    query: 'Tênis esportivo azul',
    date: '15/01/2024',
    resultsCount: 24
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop',
    query: 'Relógio smartwatch',
    date: '14/01/2024',
    resultsCount: 18
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
    query: 'Fone de ouvido wireless',
    date: '13/01/2024',
    resultsCount: 31
  }
]

export default function SnapFind() {
  const [activeTab, setActiveTab] = useState('home')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [searchHistory] = useState<SearchHistory[]>(mockHistory)
  const [detectedProduct, setDetectedProduct] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [freeShippingOnly, setFreeShippingOnly] = useState(false)
  const [trustedOnly, setTrustedOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [location, setLocation] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        // Simular detecção de produto por IA
        setTimeout(() => {
          setDetectedProduct('Tênis esportivo masculino')
        }, 1000)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleSearch = useCallback(async () => {
    if (!uploadedImage) return
    
    setIsSearching(true)
    setActiveTab('results')
    
    // Simular busca com delay
    setTimeout(() => {
      let filteredResults = [...mockProducts]
      
      // Aplicar filtros
      if (freeShippingOnly) {
        filteredResults = filteredResults.filter(p => p.freeShipping)
      }
      
      if (trustedOnly) {
        filteredResults = filteredResults.filter(p => p.trusted)
      }
      
      if (minRating > 0) {
        filteredResults = filteredResults.filter(p => p.rating >= minRating)
      }
      
      filteredResults = filteredResults.filter(p => {
        const totalPrice = p.price + p.shipping
        return totalPrice >= priceRange[0] && totalPrice <= priceRange[1]
      })
      
      // Aplicar ordenação
      switch (sortBy) {
        case 'price-low':
          filteredResults.sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping))
          break
        case 'price-high':
          filteredResults.sort((a, b) => (b.price + b.shipping) - (a.price + a.shipping))
          break
        case 'rating':
          filteredResults.sort((a, b) => b.rating - a.rating)
          break
        case 'delivery':
          filteredResults.sort((a, b) => a.deliveryDays - b.deliveryDays)
          break
      }
      
      setSearchResults(filteredResults)
      setIsSearching(false)
    }, 2000)
  }, [uploadedImage, freeShippingOnly, trustedOnly, minRating, priceRange, sortBy])

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }, [])

  const resetSearch = useCallback(() => {
    setUploadedImage(null)
    setSearchResults([])
    setDetectedProduct('')
    setActiveTab('home')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  SnapFind
                </h1>
                <p className="text-xs text-gray-500">Encontre produtos por imagem</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Versão Beta
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-12">
              <TabsTrigger 
                value="home" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Resultados</span>
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favoritos</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Home Tab - Upload */}
          <TabsContent value="home" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Encontre produtos por imagem
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Faça upload de uma foto ou tire uma nova para encontrar produtos similares em centenas de lojas online
              </p>
            </div>

            {/* Upload Area */}
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                {!uploadedImage ? (
                  <div className="space-y-6">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            Clique para fazer upload
                          </p>
                          <p className="text-sm text-gray-500">
                            ou arraste uma imagem aqui
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          Suporta JPG, PNG, JPEG até 10MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Separator className="flex-1" />
                      <span className="text-sm text-gray-500">ou</span>
                      <Separator className="flex-1" />
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full h-12"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Tirar foto com a câmera
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      capture="environment"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Imagem enviada"
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={resetSearch}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {detectedProduct && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">Produto detectado:</span>
                        </div>
                        <Input
                          value={detectedProduct}
                          onChange={(e) => setDetectedProduct(e.target.value)}
                          className="mt-2 bg-white"
                          placeholder="Edite a descrição se necessário"
                        />
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                      >
                        {isSearching ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Buscando...
                          </>
                        ) : (
                          <>
                            <Search className="w-5 h-5 mr-2" />
                            Buscar produtos
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="icon" className="h-12 w-12">
                        <Crop className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Pesquisas recentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {searchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.query}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.query}</p>
                          <p className="text-xs text-gray-500">
                            {item.resultsCount} resultados • {item.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {searchResults.length > 0 && (
              <>
                {/* Filters and Sort */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold">
                      {searchResults.length} produtos encontrados
                    </h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {detectedProduct}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Mais relevante</SelectItem>
                        <SelectItem value="price-low">Menor preço</SelectItem>
                        <SelectItem value="price-high">Maior preço</SelectItem>
                        <SelectItem value="rating">Melhor avaliação</SelectItem>
                        <SelectItem value="delivery">Entrega mais rápida</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-2"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filtros</span>
                      {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Faixa de preço</Label>
                          <div className="px-2">
                            <Slider
                              value={priceRange}
                              onValueChange={setPriceRange}
                              max={500}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{formatPrice(priceRange[0])}</span>
                              <span>{formatPrice(priceRange[1])}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Avaliação mínima</Label>
                          <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Qualquer avaliação</SelectItem>
                              <SelectItem value="3">3+ estrelas</SelectItem>
                              <SelectItem value="4">4+ estrelas</SelectItem>
                              <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="free-shipping"
                              checked={freeShippingOnly}
                              onCheckedChange={setFreeShippingOnly}
                            />
                            <Label htmlFor="free-shipping" className="text-sm">
                              Apenas frete grátis
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="trusted-only"
                              checked={trustedOnly}
                              onCheckedChange={setTrustedOnly}
                            />
                            <Label htmlFor="trusted-only" className="text-sm">
                              Apenas lojas confiáveis
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Localização</Label>
                          <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas as regiões</SelectItem>
                              <SelectItem value="national">Nacional</SelectItem>
                              <SelectItem value="international">Internacional</SelectItem>
                              <SelectItem value="sp">São Paulo</SelectItem>
                              <SelectItem value="rj">Rio de Janeiro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => toggleFavorite(product.id)}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                              }`}
                            />
                          </Button>
                          
                          {product.trusted && (
                            <Badge className="absolute top-2 left-2 bg-green-100 text-green-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Confiável
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                            {product.title}
                          </h4>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(product.rating)}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.reviews})
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-green-600">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Truck className="w-3 h-3" />
                                <span>
                                  {product.freeShipping ? 'Frete grátis' : formatPrice(product.shipping)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{product.deliveryDays} dias</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-500">{product.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-gray-600">{product.storeRating}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">
                                {product.store}
                              </span>
                              <Button size="sm" className="h-8 text-xs">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Ver produto
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {searchResults.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Faça upload de uma imagem para começar a busca
                </p>
                <Button onClick={() => setActiveTab('home')}>
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer upload
                </Button>
              </div>
            )}

            {isSearching && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Buscando produtos...
                </h3>
                <p className="text-gray-500">
                  Analisando sua imagem e pesquisando em centenas de lojas
                </p>
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Seus produtos favoritos
                </h2>
                <p className="text-gray-600">
                  Produtos que você salvou para comprar depois
                </p>
              </div>

              {favorites.size > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockProducts
                    .filter(product => favorites.has(product.id))
                    .map((product) => (
                      <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="relative mb-4">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                              {product.title}
                            </h4>

                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {renderStars(product.rating)}
                              </div>
                              <span className="text-xs text-gray-500">
                                ({product.reviews})
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(product.price)}
                              </span>
                              <Button size="sm" className="h-8 text-xs">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Ver produto
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum favorito ainda
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Salve produtos interessantes para encontrá-los facilmente depois
                  </p>
                  <Button onClick={() => setActiveTab('home')}>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar produtos
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>• Busca em 50+ lojas online</span>
              <span>• IA avançada de reconhecimento</span>
              <span>• Comparação de preços em tempo real</span>
            </div>
            <p className="text-xs text-gray-400">
              SnapFind v1.0 Beta - Encontre qualquer produto por imagem
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}