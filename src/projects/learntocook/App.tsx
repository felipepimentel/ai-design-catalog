import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChefHat, Utensils, Clock, DollarSign, Award, Search, Home, Book, User, Heart, Share2, MessageCircle, TrendingUp, Coffee, Star, Calendar, Trophy, Brain, Zap, Lightbulb, Sparkles, Carrot, Leaf, AlertCircle } from 'lucide-react'

const defaultImage = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"

const AIAssistant = ({ message, isTyping }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed bottom-4 right-4 bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-lg shadow-lg max-w-sm z-50"
  >
    <div className="flex items-center mb-3">
      <Brain className="w-8 h-8 mr-2 text-yellow-300" />
      <h3 className="text-xl font-bold">AI Cooking Assistant</h3>
    </div>
    <p className="text-lg">{message}</p>
    {isTyping && (
      <div className="mt-2 flex items-center">
        <div className="typing-indicator"></div>
        <span className="ml-2">Thinking...</span>
      </div>
    )}
  </motion.div>
)

const RecipeCard = ({ recipe, onClick, onFavorite, isFavorite, aiScore }) => {
  if (!recipe) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-xl overflow-hidden cursor-pointer shadow-md transition-shadow duration-300 relative"
      onClick={onClick}
    >
      <div className="relative">
        <img src={recipe.image || defaultImage} alt={recipe.name || 'Unnamed recipe'} className="w-full h-48 object-cover" />
        <Badge className="absolute top-2 right-2 bg-green-500">{recipe.difficulty || 'N/A'}</Badge>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation()
            onFavorite(recipe.id)
          }}
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} />
          <span className="sr-only">Favorite recipe</span>
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{recipe.name || 'Unnamed recipe'}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Clock className="w-4 h-4 mr-1 text-blue-500" /> {recipe.time || 'Time not specified'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-1 text-green-500" /> {recipe.cost || 'Cost not specified'}
        </div>
        <div className="mt-2 flex items-center">
          <Zap className="w-4 h-4 mr-1 text-purple-500" />
          <span className="text-sm font-semibold text-purple-600">AI Score: {aiScore}%</span>
        </div>
      </div>
    </motion.div>
  )
}

const WelcomeModal = ({ isOpen, onClose, onCompleteProfile }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Welcome to Learn to Cook with AI!</DialogTitle>
        <DialogDescription>
          We're excited to have you here! To get started, how about setting up your profile? This will help us personalize your experience and recommend recipes that suit you best.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onCompleteProfile}>Set Up Profile</Button>
        <Button variant="outline" onClick={onClose}>Maybe Later</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

const ProfileCompletionBanner = ({ onCompleteProfile }) => (
  <Alert className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Complete your profile</AlertTitle>
    <AlertDescription>
      Complete your profile to receive personalized recommendations.
      <Button variant="link" onClick={onCompleteProfile} className="p-0 h-auto font-normal">
        Complete now
      </Button>
    </AlertDescription>
  </Alert>
)

export default function Component() {
  const [assistantMessage, setAssistantMessage] = useState('')
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const [recommendedRecipes, setRecommendedRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [isNewUser, setIsNewUser] = useState(true)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    if (isNewUser) {
      setShowWelcomeModal(true)
    }
    setAssistantMessage("Hello! I'm your AI cooking assistant. How can I help you today?")
    
    // Simulate AI-based recipe recommendations
    setRecommendedRecipes([
      { id: 1, name: "Quinoa and Roasted Vegetable Bowl", difficulty: "Easy", time: "30 min", cost: "Medium", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", aiScore: 95 },
      { id: 2, name: "Energizing Green Smoothie", difficulty: "Easy", time: "10 min", cost: "Low", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", aiScore: 88 },
      { id: 3, name: "Chickpea and Spinach Curry", difficulty: "Medium", time: "40 min", cost: "Medium", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", aiScore: 92 },
      { id: 4, name: "Kale and Avocado Salad with Nuts", difficulty: "Easy", time: "15 min", cost: "Medium", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", aiScore: 90 },
    ])
  }, [isNewUser])

  const toggleFavorite = (id) => {
    setFavorites(prevFavorites => 
      prevFavorites.includes(id)
        ? prevFavorites.filter(favId => favId !== id)
        : [...prevFavorites, id]
    )
  }

  const handleCompleteProfile = () => {
    // Here you would redirect to the profile configuration page or open a profile setup modal
    console.log("Redirecting to profile configuration page")
    setIsProfileComplete(true)
    setShowWelcomeModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ChefHat className="w-8 h-8 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">Learn to Cook with AI</h1>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input type="search" placeholder="Search for healthy, vegetarian, or vegan recipes..." className="pl-10 pr-4 py-2 w-full" />
            </div>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Button variant="ghost"><Home className="mr-2 h-4 w-4" /> Home</Button></li>
              <li><Button variant="ghost"><Book className="mr-2 h-4 w-4" /> Recipes</Button></li>
              <li>
                <Button variant="ghost" className="relative">
                  <User className="mr-2 h-4 w-4" /> Profile
                  {!isProfileComplete && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isProfileComplete && <ProfileCompletionBanner onCompleteProfile={handleCompleteProfile} />}

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Healthy Recipes Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedRecipes.map((recipe) => (
              <Dialog key={recipe.id}>
                <DialogTrigger asChild>
                  <div>
                    <RecipeCard 
                      recipe={recipe} 
                      onFavorite={toggleFavorite}
                      isFavorite={favorites.includes(recipe.id)}
                      aiScore={recipe.aiScore}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-800">{recipe.name}</DialogTitle>
                    <DialogDescription>
                      <span className="flex items-center text-gray-600"><Utensils className="w-4 h-4 mr-1 text-blue-500" /> Difficulty: {recipe.difficulty}</span>
                      <span className="flex items-center mt-1 text-gray-600"><Clock className="w-4 h-4 mr-1 text-green-500" /> Preparation Time: {recipe.time}</span>
                      <span className="flex items-center mt-1 text-gray-600"><DollarSign className="w-4 h-4 mr-1 text-yellow-500" /> Estimated Cost: {recipe.cost}</span>
                      <span className="flex items-center mt-1 text-purple-600"><Zap className="w-4 h-4 mr-1" /> AI Score: {recipe.aiScore}%</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-6">
                    <img src={recipe.image || defaultImage} alt={recipe.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    <Tabs defaultValue="ingredients" className="mt-6">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                        <TabsTrigger value="instructions">Cooking Instructions</TabsTrigger>
                      </TabsList>
                      <TabsContent value="ingredients">
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>200g quinoa</li>
                          <li>1 medium zucchini</li>
                          <li>1 medium eggplant</li>
                          <li>1 red bell pepper</li>
                          <li>2 tablespoons extra virgin olive oil</li>
                          <li>Juice of 1 lemon</li>
                          <li>Salt and pepper to taste</li>
                          <li>Fresh mint leaves for garnish</li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="instructions">
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                          <li>Preheat the oven to 200°C (400°F).</li>
                          <li>Rinse the quinoa and cook according to package instructions.</li>
                          <li>Cut the vegetables into medium-sized cubes and arrange them on a baking sheet.</li>
                          <li>Drizzle the vegetables with olive oil, season with salt and pepper, and roast for 20-25 minutes.</li>
                          <li>Mix the cooked quinoa with the roasted vegetables.</li>
                          <li>Season with lemon juice, additional salt, and pepper if needed.</li>
                          <li>Serve in bowls and garn ish with fresh mint leaves.</li>
                        </ol>
                      </TabsContent>
                    </Tabs>
                    <div className="mt-6">
                      <h4 className="font-semibold text-lg mb-2">AI Assistant Tip</h4>
                      <p className="text-gray-700">This recipe is rich in fiber and plant-based proteins, perfect for a nutritious and healthy meal. Try adding pumpkin or sunflower seeds for an extra crunchy texture!</p>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold text-lg mb-2">Comments</h4>
                      <div className="space-y-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="font-semibold">Anna L.</p>
                          <p className="text-sm text-gray-600">Loved this recipe! It's easy to make and super tasty.</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="font-semibold">Carlos M.</p>
                          <p className="text-sm text-gray-600">Great option for a light and nutritious meal. Highly recommend!</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Textarea placeholder="Leave your comment..." className="w-full" />
                        <Button className="mt-2">Submit Comment</Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">Learn to Cook with AI is your intelligent platform for discovering the joy of healthy and plant-based cooking, with personalized recipes and expert tips powered by artificial intelligence.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Recommended Recipes</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Learning Plan</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
                <a href="#" className="text-gray-300 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg></a>
                <a href="#" className="text-gray-300 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2024 Learn to Cook with AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {assistantMessage && (
          <AIAssistant message={assistantMessage} isTyping={isAssistantTyping} />
        )}
      </AnimatePresence>

      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
        onCompleteProfile={handleCompleteProfile}
      />
    </div>
  )
}