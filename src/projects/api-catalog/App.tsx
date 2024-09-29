import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Code, Trophy, Zap, Search, Star, Clock, Sparkles, MessageSquare, Activity, ChevronDown, Filter, Gamepad, ArrowUpRight, Settings, Bell, HelpCircle } from 'lucide-react'

const apiData = [
  { id: 1, name: 'Payments', description: 'Securely process payments', tags: ['Financial', 'Security'], popularity: 95, isNew: false, score: 4.8, rating: 4.9, comments: 120, health: 'excellent' },
  { id: 2, name: 'Authentication', description: 'Easily authenticate users', tags: ['Security', 'Users'], popularity: 88, isNew: false, score: 4.6, rating: 4.7, comments: 95, health: 'good' },
  { id: 3, name: 'Notifications', description: 'Send real-time notifications', tags: ['Communication', 'Real-time'], popularity: 75, isNew: true, score: 4.2, rating: 4.5, comments: 60, health: 'good' },
  { id: 4, name: 'Analytics', description: 'Analyze application usage data', tags: ['Data', 'Reporting'], popularity: 82, isNew: false, score: 4.4, rating: 4.6, comments: 78, health: 'excellent' },
  { id: 5, name: 'Machine Learning', description: 'Integrate AI into your projects', tags: ['AI', 'Data'], popularity: 90, isNew: true, score: 4.7, rating: 4.8, comments: 110, health: 'good' },
  { id: 6, name: 'Storage', description: 'Store and retrieve data in the cloud', tags: ['Cloud', 'Data'], popularity: 78, isNew: false, score: 4.3, rating: 4.4, comments: 85, health: 'fair' },
]

const featuredApi = apiData[4] // Machine Learning API

export default function APIcatalog() {
  const [xp, setXp] = useState(750)
  const [level, setLevel] = useState(5)
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false)
  const [dailyChallengeProgress, setDailyChallengeProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAISearch, setIsAISearch] = useState(false)
  const [advancedSearch, setAdvancedSearch] = useState({
    tags: [],
    minRating: 0,
    healthStatus: 'all'
  })
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [selectedApi, setSelectedApi] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const completeDailyChallenge = () => {
    setXp(xp + 100)
    setDailyChallengeCompleted(true)
    setDailyChallengeProgress(100)
    if (xp + 100 >= 1000) {
      setLevel(level + 1)
      setXp((xp + 100) % 1000)
    }
  }

  const incrementDailyChallengeProgress = () => {
    if (dailyChallengeProgress < 100) {
      setDailyChallengeProgress(prev => Math.min(prev + 25, 100))
    }
    if (dailyChallengeProgress + 25 >= 100) {
      completeDailyChallenge()
    }
  }

  const filteredApis = apiData.filter(api => 
    (api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (advancedSearch.tags.length === 0 || advancedSearch.tags.some(tag => api.tags.includes(tag))) &&
    api.rating >= advancedSearch.minRating &&
    (advancedSearch.healthStatus === 'all' || api.health === advancedSearch.healthStatus)
  )

  const trendingApis = [...apiData].sort((a, b) => b.popularity - a.popularity).slice(0, 3)
  const newApis = apiData.filter(api => api.isNew)

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'fair': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const handleApiClick = (api) => {
    setSelectedApi(api)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100 p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-4 sm:mb-0">API Catalog</h1>
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="text-base sm:text-lg py-1 px-2 sm:px-3 bg-gray-800 text-gray-100">Level {level}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current developer level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Progress value={xp / 10} className="w-32 sm:w-40 h-2 sm:h-3 bg-gray-700" />
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-violet-500">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="@devuser" />
            <AvatarFallback>DU</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="mb-6 sm:mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search APIs by name, description, or tag..."
            className="pl-10 pr-24 py-2 text-base sm:text-lg rounded-full bg-gray-800 border-2 border-gray-700 focus:border-violet-500 transition-all text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className={`absolute right-0 top-0 bottom-0 rounded-r-full transition-all ${
              isAISearch ? 'bg-violet-600 hover:bg-violet-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setIsAISearch(!isAISearch)}
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            AI
          </Button>
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-100"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            Advanced Search
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        {showAdvancedSearch && (
          <Card className="mt-2 bg-gray-800 border border-gray-700">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-300">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['Financial', 'Security', 'Data', 'AI', 'Cloud'].map((tag) => (
                      <Checkbox
                        key={tag}
                        id={tag}
                        checked={advancedSearch.tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          setAdvancedSearch(prev => ({
                            ...prev,
                            tags: checked
                              ? [...prev.tags, tag]
                              : prev.tags.filter(t => t !== tag)
                          }))
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="minRating" className="text-sm font-medium text-gray-300">Minimum Rating</Label>
                  <Select
                    value={advancedSearch.minRating.toString()}
                    onValueChange={(value) => setAdvancedSearch(prev => ({ ...prev, minRating: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select minimum rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>{rating}+ Stars</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="healthStatus" className="text-sm font-medium text-gray-300">Health Status</Label>
                  <Select
                    value={advancedSearch.healthStatus}
                    onValueChange={(value) => setAdvancedSearch(prev => ({ ...prev, healthStatus: value }))}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4 sm:mb-6 bg-gray-800 p-1 rounded-full">
              <TabsTrigger value="all" className={`w-1/3 py-2 rounded-full text-gray-100 transition-all ${activeTab === 'all' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}>All</TabsTrigger>
              <TabsTrigger value="trending" className={`w-1/3 py-2 rounded-full text-gray-100 transition-all ${activeTab === 'trending' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}>Trending</TabsTrigger>
              <TabsTrigger value="new" className={`w-1/3 py-2 rounded-full text-gray-100 transition-all ${activeTab === 'new' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}>New</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredApis.map((api) => (
                  <Card key={api.id} className="bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 cursor-pointer group" onClick={() => handleApiClick(api)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center text-gray-100 text-lg">
                        <span>{api.name}</span>
                        {api.isNew && <Badge className="bg-green-600 text-gray-100">New</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-2">{api.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {api.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {api.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {api.comments}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${getHealthColor(api.health)}`}>
                          {api.health.charAt(0).toUpperCase() + api.health.slice(1)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 p-0">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Docs
                      </Button>
                      <span className="text-gray-400 text-xs">Score: {api.score.toFixed(1)}</span>
                    </CardFooter>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-5 w-5 text-violet-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="trending">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {trendingApis.map((api) => (
                  <Card key={api.id} className="bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 cursor-pointer group" onClick={() => handleApiClick(api)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center text-gray-100 text-lg">
                        <span>{api.name}</span>
                        <Star className="h-5 w-5 text-yellow-500" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-2">{api.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {api.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {api.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {api.comments}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${getHealthColor(api.health)}`}>
                          {api.health.charAt(0).toUpperCase() + api.health.slice(1)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 p-0">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Docs
                      </Button>
                      <span className="text-gray-400 text-xs">Score: {api.score.toFixed(1)}</span>
                    </CardFooter>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-5 w-5 text-violet-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="new">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {newApis.map((api) => (
                  <Card key={api.id} className="bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700 cursor-pointer group" onClick={() => handleApiClick(api)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center text-gray-100 text-lg">
                        <span>{api.name}</span>
                        <Clock className="h-5 w-5 text-green-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-2">{api.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {api.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {api.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {api.comments}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${getHealthColor(api.health)}`}>
                          {api.health.charAt(0).toUpperCase() + api.health.slice(1)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 p-0">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Docs
                      </Button>
                      <span className="text-gray-400 text-xs">Score: {api.score.toFixed(1)}</span>
                    </CardFooter>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-5 w-5 text-violet-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-100 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Featured API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-1 text-gray-100">{featuredApi.name}</h3>
              <p className="text-sm text-gray-300 mb-3">{featuredApi.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {featuredApi.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  {featuredApi.rating.toFixed(1)}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {featuredApi.comments}
                </span>
                <span className={`px-2 py-0.5 rounded-full ${getHealthColor(featuredApi.health)}`}>
                  {featuredApi.health.charAt(0).toUpperCase() + featuredApi.health.slice(1)}
                </span>
              </div>
              <div className="flex items-center mb-1">
                <Activity className="h-4 w-4 text-violet-400 mr-2" />
                <span className="text-sm text-gray-300">API Score</span>
              </div>
              <Progress value={featuredApi.score * 20} className="h-2 mb-1" />
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Poor</span>
                <span className="font-semibold">{featuredApi.score.toFixed(1)}/5.0</span>
                <span>Excellent</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-gray-100">
                Explore API
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-100">Daily Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">Implement an authentication function using our API</p>
              <Progress value={dailyChallengeProgress} className="h-2 mb-2" />
              <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                <span>Progress: {dailyChallengeProgress}%</span>
                <span>{dailyChallengeCompleted ? 'Completed!' : 'In Progress'}</span>
              </div>
              <Button 
                onClick={incrementDailyChallengeProgress} 
                disabled={dailyChallengeCompleted}
                className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-gray-100"
              >
                {dailyChallengeCompleted ? 'Challenge Completed!' : 'Make Progress'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-100">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {['Alice', 'Bob', 'Charlie', 'David', 'Eve'].map((name, index) => (
                  <li key={name} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg text-sm">
                    <span className="flex items-center text-gray-100">
                      <span className="text-lg font-bold mr-2">{index + 1}.</span>
                      {name}
                    </span>
                    <Badge variant="secondary" className="bg-violet-600 text-gray-100">{1000 - index * 50} XP</Badge>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-8 flex justify-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100 hover:bg-gray-700">
          <BookOpen className="mr-1 h-4 w-4" />
          Docs
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100 hover:bg-gray-700">
          <Zap className="mr-1 h-4 w-4" />
          Playground
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100 hover:bg-gray-700">
          <Trophy className="mr-1 h-4 w-4" />
          Achievements
        </Button>
      </footer>

      {/* Quick Access Toolbar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full shadow-lg p-2 flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5 text-gray-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5 text-gray-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <HelpCircle className="h-5 w-5 text-gray-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {selectedApi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-100">{selectedApi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{selectedApi.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedApi.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300">{tag}</Badge>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rating:</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {selectedApi.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Health:</span>
                  <span className={`px-2 py-0.5 rounded-full ${getHealthColor(selectedApi.health)}`}>
                    {selectedApi.health.charAt(0).toUpperCase() + selectedApi.health.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Comments:</span>
                  <span>{selectedApi.comments}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedApi(null)}>Close</Button>
              <Button className="bg-violet-600 hover:bg-violet-700 text-gray-100">
                Try It Out
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}