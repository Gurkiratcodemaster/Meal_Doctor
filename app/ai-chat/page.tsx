"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, ArrowLeft, Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AIChatPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load chat history
    const stored = localStorage.getItem("meal_doctor_ai_chat");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      // Welcome message
      const welcomeMsg: Message = {
        id: "welcome",
        role: "assistant",
        content: `Hello ${user?.firstName}! 👋 I'm your AI Diet Assistant. I can help you with nutrition advice, meal planning, dietary recommendations, and answer your health-related questions. How can I assist you today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, [isAuthenticated, router, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem("meal_doctor_ai_chat", JSON.stringify(msgs));
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Weight loss keywords
    if (lowerMessage.includes("weight loss") || lowerMessage.includes("lose weight")) {
      return "For healthy weight loss, I recommend:\n\n1. **Caloric Deficit**: Aim for 300-500 calories below your maintenance level\n2. **High Protein**: 1.6-2.2g per kg body weight to preserve muscle\n3. **Whole Foods**: Focus on vegetables, lean proteins, and complex carbs\n4. **Hydration**: Drink 2-3 liters of water daily\n5. **Sleep**: 7-9 hours for optimal metabolism\n\nWould you like a personalized meal plan?";
    }

    // Protein keywords
    if (lowerMessage.includes("protein") || lowerMessage.includes("muscle")) {
      return "Great question about protein! Here's what you need to know:\n\n**Protein Requirements:**\n- Sedentary: 0.8g per kg body weight\n- Active: 1.2-1.6g per kg\n- Strength training: 1.6-2.2g per kg\n\n**Best Sources:**\n- Chicken breast (31g per 100g)\n- Greek yogurt (10g per 100g)\n- Eggs (6g per egg)\n- Lentils (9g per 100g cooked)\n- Paneer (18g per 100g)\n\nSpread protein intake throughout the day for best results!";
    }

    // Diet plan keywords
    if (lowerMessage.includes("diet plan") || lowerMessage.includes("meal plan")) {
      return "I'd be happy to help create a meal plan! To personalize it, I need to know:\n\n1. Your goal (weight loss/gain/maintenance)\n2. Any dietary restrictions\n3. Food preferences\n4. Daily activity level\n\nFor now, here's a balanced day:\n\n**Breakfast**: Oatmeal with fruits & nuts\n**Lunch**: Grilled chicken with quinoa & vegetables\n**Snack**: Greek yogurt with berries\n**Dinner**: Salmon with sweet potato & greens\n\nWould you like me to customize this further?";
    }

    // Diabetes keywords
    if (lowerMessage.includes("diabetes") || lowerMessage.includes("blood sugar")) {
      return "Managing diabetes through diet is crucial. Key principles:\n\n1. **Low Glycemic Index**: Choose whole grains, legumes, non-starchy vegetables\n2. **Portion Control**: Use the plate method (1/2 vegetables, 1/4 protein, 1/4 carbs)\n3. **Regular Meals**: Eat every 3-4 hours to stabilize blood sugar\n4. **Fiber**: 25-30g daily from vegetables, fruits, whole grains\n5. **Limit**: Refined sugars, white bread, sugary drinks\n\nAlways consult with your healthcare provider for personalized advice!";
    }

    // Vegetarian/vegan keywords
    if (lowerMessage.includes("vegetarian") || lowerMessage.includes("vegan") || lowerMessage.includes("plant-based")) {
      return "Plant-based nutrition can be very healthy! Important considerations:\n\n**Key Nutrients:**\n- **Protein**: Lentils, chickpeas, tofu, quinoa\n- **Iron**: Spinach, fortified cereals (pair with vitamin C)\n- **B12**: Fortified foods or supplements\n- **Omega-3**: Flaxseeds, chia seeds, walnuts\n- **Calcium**: Leafy greens, fortified plant milk\n\n**Sample Meal:**\n- Buddha bowl with quinoa, roasted chickpeas, mixed vegetables, tahini dressing\n\nNeed specific recipe ideas?";
    }

    // Workout/fitness keywords
    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise") || lowerMessage.includes("gym")) {
      return "Nutrition is crucial for fitness! Here's what to focus on:\n\n**Pre-Workout** (1-2 hours before):\n- Complex carbs + moderate protein\n- Example: Banana with peanut butter\n\n**Post-Workout** (within 30-60 min):\n- Protein + quick carbs (3:1 or 4:1 ratio)\n- Example: Protein shake with fruit\n\n**Daily Nutrition:**\n- Carbs: 45-65% of calories (energy)\n- Protein: 15-25% (muscle repair)\n- Fats: 20-35% (hormones)\n\nStay hydrated and time your meals around workouts!";
    }

    // Water/hydration keywords
    if (lowerMessage.includes("water") || lowerMessage.includes("hydrat")) {
      return "Hydration is essential for health! Here's what you need:\n\n**Daily Intake:**\n- General: 2-3 liters (8-12 cups)\n- Active individuals: 3-4 liters\n- Hot climate: Add 0.5-1 liter\n\n**Signs of Dehydration:**\n- Dark yellow urine\n- Fatigue\n- Dry mouth\n- Headaches\n\n**Hydration Tips:**\n- Drink a glass upon waking\n- Have water before each meal\n- Carry a reusable bottle\n- Eat water-rich foods (cucumber, watermelon)\n\nCoffee and tea count, but water is best!";
    }

    // Calories keywords
    if (lowerMessage.includes("calorie") || lowerMessage.includes("calories")) {
      return "Understanding calories is key to managing weight:\n\n**Basic Formula:**\n- Weight Loss: Deficit of 300-500 cal/day\n- Maintenance: Eat at your TDEE\n- Weight Gain: Surplus of 300-500 cal/day\n\n**Rough TDEE Calculation:**\n- Women: Body weight (kg) × 22-24\n- Men: Body weight (kg) × 26-28\n- Add 200-400 for activity level\n\n**Quality Matters:**\n- 200 cal of vegetables ≠ 200 cal of chips\n- Focus on nutrient-dense whole foods\n\nWould you like help calculating your needs?";
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! Based on current nutrition science, I'd recommend consulting with one of our professional nutritionists for personalized advice. In the meantime, focus on:\n\n- Eating whole, unprocessed foods\n- Staying hydrated\n- Getting adequate sleep\n- Regular physical activity\n\nWhat specific aspect would you like to know more about?",
      "I'm here to help! For the best personalized advice on that topic, I recommend:\n\n1. Consulting with a professional on our platform\n2. Keeping a food diary for 3-7 days\n3. Noting your energy levels and how you feel\n\nThis information will help create a truly customized plan for you. Is there anything else I can clarify?",
      "Great question! While I can provide general guidance, nutrition is highly individual. Consider factors like:\n\n- Your current health status\n- Activity level\n- Personal goals\n- Any medical conditions\n\nFor specific recommendations, I suggest booking a consultation with one of our verified professionals. They can create a tailored plan just for you!",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg_${Date.now()}_ai`,
        role: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/30 via-black to-black text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                AI Diet Assistant
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </h1>
              <p className="text-xs text-gray-400">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-green-500 to-green-700"
                      : "bg-gradient-to-br from-blue-500 to-blue-700"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "assistant"
                        ? "bg-white/5 border border-white/10"
                        : "bg-green-500 text-black"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about nutrition..."
              className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-green-500 text-black rounded-full hover:bg-green-600 transition disabled:opacity-50 disabled:hover:bg-green-500"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-2">
            AI responses are for general guidance only. Consult professionals for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
}
