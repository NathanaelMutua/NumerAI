import React, { useState } from 'react';
import { Bot, Send, User, Lightbulb, TrendingUp, Globe, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  language?: 'en' | 'sw';
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Habari! I\'m your AI business coach. I can help you in English or Kiswahili. How can I assist your business today?',
    isBot: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    language: 'en'
  },
  {
    id: '2',
    content: 'Naomba ushauri kuhusu bei za bidhaa zangu. Ni vipi niweze kuongeza faida?',
    isBot: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    language: 'sw'
  },
  {
    id: '3',
    content: 'Hii ni swali nzuri! Kuongeza faida, unaweza: 1) Kuchunguza bei za washindani 2) Kuongeza thamani kwa bidhaa zako 3) Kupunguza gharama za uongozaji. Kwa mfano, kama unamuuza unga, unaweza kuwa na mfuko wa plastic wa kibinafsi au kutoa delivery bure.',
    isBot: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    language: 'sw'
  }
];

const quickActions = [
  { id: '1', label: 'Pricing Help', icon: TrendingUp, query: 'Help me optimize my product pricing' },
  { id: '2', label: 'Marketing Tips', icon: Lightbulb, query: 'Give me marketing ideas for my business' },
  { id: '3', label: 'Inventory Advice', icon: MessageCircle, query: 'How can I manage my inventory better?' },
  { id: '4', label: 'M-Pesa Setup', icon: Globe, query: 'Help me set up M-Pesa for my business' },
];

const businessInsights = [
  {
    title: 'Peak Sales Hours',
    insight: 'Your best sales are between 6-8 PM. Consider extending hours or promoting during this time.',
    action: 'Extend evening hours'
  },
  {
    title: 'Product Opportunity',
    insight: 'Customers often ask for milk when buying tea. Consider stocking UHT milk.',
    action: 'Add dairy products'
  },
  {
    title: 'Payment Trends',
    insight: '70% of your customers prefer M-Pesa. Promote this payment method.',
    action: 'Display M-Pesa prominently'
  }
];

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-KE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const generateBotResponse = async (userMessage: string) => {
    // Simple response generation based on keywords
    const message = userMessage.toLowerCase();
    try {
      const response = await fetch(`https://unwarned-nonspheric-georgeanna.ngrok-free.dev/ask`, {method: `POST`, headers: { 'Content-Type': 'application/json',
    },
    body: JSON.stringify({"question": message})
  })
  const data = await response.json()
  console.log(data.answer!)
  return data.answer!
  } catch (e) {
    console.log(e)
  }
 
  };

  const generateQuickBotRepsonse = (userMessage: string) => {
    const message = userMessage.toLowerCase()
      if (message.includes('pricing') || message.includes('bei')) {
      return language === 'sw' 
        ? 'Kuhusu bei: 1) Chunguza bei za washindani 2) Hesabu gharama zako + faida 20-30% 3) Zingatia ubora wa bidhaa yako. Je, unahitaji msaada zaidi?'
        : 'For pricing: 1) Research competitor prices 2) Calculate your costs + 20-30% profit 3) Consider your product quality. Need more specific help?';
    }
    
    if (message.includes('marketing') || message.includes('masoko')) {
      return language === 'sw'
        ? 'Mikakati ya masoko: 1) Tumia WhatsApp kwa wateja 2) Andika kwa mlango wako "M-Pesa Inakubaliwa" 3) Toa punguzo kwa wateja wa kawaida 4) Shiriki picha za bidhaa za ubora social media.'
        : 'Marketing strategies: 1) Use WhatsApp for customers 2) Put "M-Pesa Accepted" sign 3) Offer loyalty discounts 4) Share quality product photos on social media.';
    }
    
    if (message.includes('inventory') || message.includes('stock')) {
      return language === 'sw'
        ? 'Usimamizi wa stock: 1) Fuatilia bidhaa zinazoishe haraka 2) Weka alama za kumbuka kwa bidhaa za muhimu 3) Unda uhusiano mzuri na wasambazaji 4) Chunguza data ya mauzo ya wiki zilizopita.'
        : 'Inventory management: 1) Track fast-moving items 2) Set reminders for essential products 3) Build good supplier relationships 4) Analyze past weeks\' sales data.';
    }
    
    if (message.includes('mpesa') || message.includes('malipo')) {
      return language === 'sw'
        ? 'M-Pesa kwa biashara: 1) Fungua akaunti ya Paybill au Till Number 2) Weka nembo ya M-Pesa mahali paonekanapo 3) Fundisha watumishi jinsi ya kutumia 4) Fuatilia malipo yote kwa ukaguzi.'
        : 'M-Pesa for business: 1) Open Paybill or Till Number account 2) Display M-Pesa logo prominently 3) Train staff on usage 4) Track all payments for accounting.';
    }
    
    return language === 'sw'
      ? 'Nimeelewi swali lako. Je, unaweza kunieleza zaidi ili nikupe msaada wa kina zaidi?'
      : 'I understand your question. Could you tell me more so I can give you more detailed help?';

  }

  const handleSendMessage = async() => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    const resp = await generateBotResponse(inputMessage)

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: resp,
        isBot: true,
        timestamp: new Date(),
        language
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickAction = (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      isBot: false,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateQuickBotRepsonse(query),
        isBot: true,
        timestamp: new Date(),
        language
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2>AI Business Coach</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Mshauri wa biashara / Your intelligent business advisor
        </p>
        
        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mt-3">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
          <Button
            variant={language === 'sw' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('sw')}
          >
            Kiswahili
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center gap-2 h-auto p-2"
                    >
                      <Icon className="w-3 h-3" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="h-96">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isBot && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {!message.isBot && (
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={language === 'sw' ? 'Andika ujumbe wako...' : 'Type your message...'}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-3">
            {businessInsights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{insight.title}</h3>
                    <Badge variant="secondary">AI Insight</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.insight}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    {insight.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}