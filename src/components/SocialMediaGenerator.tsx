import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Instagram, Twitter, Linkedin, Share2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SocialMediaGeneratorProps {
  onBack: () => void;
}

interface GeneratedContent {
  platform: string;
  type: string;
  content: string;
  hashtags: string[];
  imageUrl?: string;
}

export function SocialMediaGenerator({ onBack }: SocialMediaGeneratorProps) {
  const [platform, setPlatform] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  ];

  const contentTypes = [
    { value: 'post', label: 'Post' },
    { value: 'story', label: 'Story' },
    { value: 'ad', label: 'Advertisement' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'informative', label: 'Informative' },
  ];

  const generatePollinationsImage = async (prompt: string): Promise<string> => {
    try {
      // Create a descriptive prompt for Pollinations.ai
      const imagePrompt = `${prompt}, African small business, vibrant colors, professional marketing style, high quality`;
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=400&seed=${Date.now()}`;
      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return '';
    }
  };

  const generateContent = async () => {
    if (!platform || !contentType || !tone || !description.trim()) {
      return;
    }

    setIsGenerating(true);

    try {
      // Generate enhanced content using AI-driven approach
      const enhancedContent = await generateEnhancedContent(platform, contentType, tone, description);
      
      // Generate image if it's a visual post
      let imageUrl = '';
      if (contentType === 'post' || contentType === 'ad') {
        imageUrl = await generatePollinationsImage(description);
      }

      const mockContent = {
        ...enhancedContent,
        imageUrl
      };
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to mock content
      const mockContent = generateMockContent(platform, contentType, tone, description);
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }
  };

  const generateEnhancedContent = async (platform: string, type: string, tone: string, desc: string): Promise<GeneratedContent> => {
    // Simulate API call to AI for enhanced text generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate AI-driven content based on the tone and description
    const content = await generateAIContent(platform, type, tone, desc);
    const hashtags = generateSmartHashtags(platform, tone, desc, content);

    return {
      platform,
      type,
      content,
      hashtags
    };
  };

  const generateAIContent = async (platform: string, type: string, tone: string, desc: string): Promise<string> => {
    // Simulate AI content generation with more sophisticated prompting
    const systemPrompt = buildSystemPrompt(platform, type, tone);
    const userPrompt = buildUserPrompt(desc, platform, type, tone);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate contextually appropriate content
    return generateContextualContent(systemPrompt, userPrompt, platform, type, tone, desc);
  };

  const buildSystemPrompt = (platform: string, type: string, tone: string): string => {
    const baseContext = "You are an AI social media content creator specializing in African small business marketing. Your content should be culturally relevant, engaging, and designed to drive business growth.";
    
    const platformContext = {
      instagram: "Create visually-oriented content that leverages hashtags effectively and encourages engagement through comments and shares.",
      twitter: "Create concise, impactful content that sparks conversation and is optimized for retweets and replies.",
      linkedin: "Create professional, insight-driven content that establishes thought leadership and builds business networks."
    };

    const toneContext = {
      professional: "Adopt a professional, authoritative tone that builds trust and credibility while showcasing expertise.",
      casual: "Use a friendly, conversational tone that feels approachable and authentic, like talking to a friend.",
      promotional: "Create compelling, urgency-driven content that motivates immediate action while remaining authentic.",
      inspirational: "Craft uplifting, motivational content that empowers entrepreneurs and celebrates business success.",
      humorous: "Use appropriate humor and wit that resonates with business owners while keeping the message clear.",
      informative: "Provide valuable, educational content that positions the brand as a trusted source of business knowledge."
    };

    return `${baseContext} ${platformContext[platform as keyof typeof platformContext]} ${toneContext[tone as keyof typeof toneContext]}`;
  };

  const buildUserPrompt = (desc: string, platform: string, type: string, tone: string): string => {
    return `Create a ${tone} ${type} for ${platform} about: "${desc}". The content should be optimized for African small businesses, include relevant emojis naturally, and drive engagement. Focus on practical benefits and real-world applications.`;
  };

  const generateContextualContent = (systemPrompt: string, userPrompt: string, platform: string, type: string, tone: string, desc: string): string => {
    // AI-driven content generation logic that adapts to context
    const businessContext = extractBusinessContext(desc);
    const toneElements = getToneElements(tone);
    const platformConstraints = getPlatformConstraints(platform, type);
    
    return buildAIGeneratedContent(businessContext, toneElements, platformConstraints, desc, platform, type, tone);
  };

  const extractBusinessContext = (description: string): string => {
    const keywords = description.toLowerCase();
    
    if (keywords.includes('inventory') || keywords.includes('stock')) {
      return 'inventory_management';
    } else if (keywords.includes('sales') || keywords.includes('revenue')) {
      return 'sales_tracking';
    } else if (keywords.includes('payment') || keywords.includes('mpesa') || keywords.includes('money')) {
      return 'payment_integration';
    } else if (keywords.includes('ai') || keywords.includes('automation')) {
      return 'ai_features';
    } else if (keywords.includes('business') || keywords.includes('entrepreneur')) {
      return 'business_growth';
    }
    
    return 'general_business';
  };

  const getToneElements = (tone: string) => {
    const elements = {
      professional: {
        vocabulary: ['optimize', 'enhance', 'strategic', 'efficient', 'innovative', 'comprehensive'],
        emojis: ['📊', '💼', '🚀', '📈', '✅', '🎯'],
        callToAction: ['Discover how', 'Learn more about', 'Explore the benefits', 'See the impact'],
        closingStyle: 'authoritative'
      },
      casual: {
        vocabulary: ['awesome', 'amazing', 'super', 'fantastic', 'incredible', 'game-changing'],
        emojis: ['✨', '🔥', '💪', '🎉', '😍', '👋'],
        callToAction: ['Check it out', 'You gotta see this', 'This is so cool', 'Let me show you'],
        closingStyle: 'friendly'
      },
      promotional: {
        vocabulary: ['exclusive', 'limited', 'special', 'breakthrough', 'revolutionary', 'unbeatable'],
        emojis: ['🚨', '⚡', '🔥', '💥', '🎁', '⏰'],
        callToAction: ['Get started now', 'Claim your spot', 'Don\'t wait', 'Act today'],
        closingStyle: 'urgent'
      },
      inspirational: {
        vocabulary: ['empower', 'transform', 'achieve', 'breakthrough', 'unleash', 'elevate'],
        emojis: ['🌟', '💪', '🚀', '✨', '🌈', '💫'],
        callToAction: ['Start your journey', 'Take the first step', 'Begin today', 'Make it happen'],
        closingStyle: 'motivational'
      },
      humorous: {
        vocabulary: ['seriously', 'honestly', 'literally', 'basically', 'obviously', 'apparently'],
        emojis: ['😂', '🤣', '😄', '🙃', '😅', '🤪'],
        callToAction: ['Come see the magic', 'See what the fuss is about', 'Join the fun', 'Don\'t be left out'],
        closingStyle: 'playful'
      },
      informative: {
        vocabulary: ['research', 'data', 'insights', 'analysis', 'evidence', 'findings'],
        emojis: ['📚', '💡', '📊', '🔍', '📈', '🧠'],
        callToAction: ['Learn the details', 'Explore the research', 'Get the facts', 'Discover more'],
        closingStyle: 'educational'
      }
    };
    
    return elements[tone as keyof typeof elements] || elements.professional;
  };

  const getPlatformConstraints = (platform: string, type: string) => {
    const constraints = {
      instagram: {
        post: { maxLength: 2200, hashtagCount: 8, includeImage: true },
        story: { maxLength: 250, hashtagCount: 3, includeImage: true },
        ad: { maxLength: 1500, hashtagCount: 5, includeImage: true }
      },
      twitter: {
        post: { maxLength: 280, hashtagCount: 3, includeImage: false }
      },
      linkedin: {
        post: { maxLength: 3000, hashtagCount: 5, includeImage: true }
      }
    };
    
    return constraints[platform as keyof typeof constraints]?.[type as keyof any] || { maxLength: 1000, hashtagCount: 5, includeImage: false };
  };

  const buildAIGeneratedContent = (businessContext: string, toneElements: any, platformConstraints: any, desc: string, platform: string, type: string, tone: string): string => {
    const randomVocab = toneElements.vocabulary[Math.floor(Math.random() * toneElements.vocabulary.length)];
    const randomEmojis = toneElements.emojis.slice(0, Math.floor(Math.random() * 3) + 2);
    const randomCTA = toneElements.callToAction[Math.floor(Math.random() * toneElements.callToAction.length)];
    
    // Generate business-specific insights
    const businessInsight = generateBusinessInsight(businessContext, tone);
    
    // Combine elements into coherent content
    let content = '';
    
    if (platform === 'instagram' && type === 'post') {
      content = buildInstagramPost(desc, randomEmojis, randomVocab, businessInsight, randomCTA, tone);
    } else if (platform === 'twitter') {
      content = buildTwitterPost(desc, randomEmojis, randomVocab, businessInsight, randomCTA, tone);
    } else if (platform === 'linkedin') {
      content = buildLinkedInPost(desc, randomEmojis, randomVocab, businessInsight, randomCTA, tone);
    } else {
      content = buildGeneralPost(desc, randomEmojis, randomVocab, businessInsight, randomCTA, tone);
    }
    
    // Ensure content meets platform constraints
    if (content.length > platformConstraints.maxLength) {
      content = content.substring(0, platformConstraints.maxLength - 3) + '...';
    }
    
    return content;
  };

  const generateBusinessInsight = (context: string, tone: string): string => {
    const insights = {
      inventory_management: {
        professional: "Smart inventory management reduces costs by 35% and prevents stockouts that lose customers.",
        casual: "Never run out of stock again! Our smart tracking keeps your shelves full and customers happy.",
        promotional: "Transform your inventory chaos into profit! Save 35% on costs while boosting customer satisfaction.",
        inspirational: "Every successful business starts with knowing what they have. Smart inventory = smart growth.",
        humorous: "Plot twist: You actually CAN predict when you'll run out of stuff. Mind blown? 🤯",
        informative: "Studies show proper inventory management increases profitability by 35% in small businesses."
      },
      sales_tracking: {
        professional: "Data-driven sales insights enable 40% faster business growth and improved decision-making.",
        casual: "Finally understand where your money's coming from! Real insights, real growth, real results.",
        promotional: "Unlock hidden revenue! Our sales tracking reveals opportunities you never knew existed.",
        inspirational: "Knowledge is power, and sales data is your superpower. See your business soar!",
        humorous: "Remember when sales tracking meant counting money by hand? Yeah, we don't miss that either! 💸",
        informative: "Businesses with proper sales tracking show 40% faster growth than those without systematic monitoring."
      },
      payment_integration: {
        professional: "Seamless payment integration increases transaction completion rates by 60% across African markets.",
        casual: "Making payments super easy for your customers = more money in your pocket. It's that simple!",
        promotional: "Double your payment success rate! M-Pesa and Airtel Money integration that actually works.",
        inspirational: "Remove barriers, create opportunities. Smooth payments mean happier customers and growing revenue.",
        humorous: "Turns out customers prefer paying easily over jumping through hoops. Shocking discovery! 🤷‍♀️",
        informative: "Mobile money integration can increase transaction success rates by 60% in African markets."
      },
      ai_features: {
        professional: "AI-powered automation reduces manual tasks by 70% while improving accuracy and efficiency.",
        casual: "Let AI handle the boring stuff while you focus on growing your business. It's like having a super assistant!",
        promotional: "Revolutionary AI that works for YOU! Automate everything and watch your business thrive.",
        inspirational: "The future is here, and it's designed to help African entrepreneurs succeed beyond imagination.",
        humorous: "AI that actually helps instead of trying to take over the world. Novel concept! 🤖",
        informative: "AI automation can reduce manual business tasks by up to 70% while improving operational accuracy."
      },
      business_growth: {
        professional: "Integrated business management platforms accelerate growth by providing actionable insights and automation.",
        casual: "Everything you need to grow your business, all in one place. No more juggling a dozen different apps!",
        promotional: "The complete business solution that successful entrepreneurs choose. Join thousands already growing!",
        inspirational: "Your business deserves every tool for success. Comprehensive solutions for unlimited growth.",
        humorous: "Business management that doesn't require a PhD in complicated software. Revolutionary! 🎓",
        informative: "Comprehensive business platforms typically increase operational efficiency by 50% in the first year."
      },
      general_business: {
        professional: "Strategic business solutions designed specifically for the African market's unique challenges and opportunities.",
        casual: "Business tools that actually understand the African market. Finally, something built for us!",
        promotional: "The business solution Africa has been waiting for. See why thousands are making the switch!",
        inspirational: "African businesses deserve world-class tools. Innovation that empowers local entrepreneurship.",
        humorous: "Business software that doesn't assume you live in Silicon Valley. What a concept! 🌍",
        informative: "Market-specific business solutions show 45% better adoption rates than generic alternatives."
      }
    };
    
    return insights[context as keyof typeof insights]?.[tone as keyof any] || insights.general_business[tone as keyof any] || insights.general_business.professional;
  };

  const buildInstagramPost = (desc: string, emojis: string[], vocab: string, insight: string, cta: string, tone: string): string => {
    const hook = `${emojis[0]} ${generateHook(desc, tone)}`;
    const main = insight;
    const features = generateFeatureList(desc, tone, 'instagram');
    const closing = `${cta} - link in bio! ${emojis[1]}`;
    
    return `${hook}\n\n${main}\n\n${features}\n\n${closing}`;
  };

  const buildTwitterPost = (desc: string, emojis: string[], vocab: string, insight: string, cta: string, tone: string): string => {
    const hook = generateHook(desc, tone);
    const main = insight.substring(0, 120);
    const thread = `\n\n${cta} 👇 Thread`;
    
    return `${emojis[0]} ${hook}\n\n${main}${thread}`;
  };

  const buildLinkedInPost = (desc: string, emojis: string[], vocab: string, insight: string, cta: string, tone: string): string => {
    const hook = generateProfessionalHook(desc, tone);
    const main = insight;
    const details = generateDetailedAnalysis(desc, tone);
    const engagement = generateEngagementQuestion(tone);
    
    return `${hook}\n\n${main}\n\n${details}\n\n${engagement}\n\n${cta}`;
  };

  const buildGeneralPost = (desc: string, emojis: string[], vocab: string, insight: string, cta: string, tone: string): string => {
    const hook = `${emojis[0]} ${generateHook(desc, tone)}`;
    const main = insight;
    const closing = `${cta} ${emojis[1]}`;
    
    return `${hook}\n\n${main}\n\n${closing}`;
  };

  const generateHook = (desc: string, tone: string): string => {
    const hooks = {
      professional: [`Introducing: ${desc}`, `New breakthrough in ${desc}`, `Revolutionary ${desc} solution`],
      casual: [`OMG, you need to see this ${desc}!`, `Just discovered something amazing about ${desc}`, `This ${desc} thing is incredible!`],
      promotional: [`🚨 EXCLUSIVE: ${desc} offer!`, `⚡ LIMITED TIME: ${desc} deal`, `💥 BREAKTHROUGH: ${desc} solution`],
      inspirational: [`Transform your approach to ${desc}`, `Unlock the power of ${desc}`, `Your ${desc} journey starts here`],
      humorous: [`Plot twist: ${desc} actually works!`, `Breaking: ${desc} doesn't suck!`, `Apparently ${desc} is amazing now`],
      informative: [`Key insights about ${desc}`, `What you need to know about ${desc}`, `The science behind ${desc}`]
    };
    
    const toneHooks = hooks[tone as keyof typeof hooks] || hooks.professional;
    return toneHooks[Math.floor(Math.random() * toneHooks.length)];
  };

  const generateProfessionalHook = (desc: string, tone: string): string => {
    return `The Future of ${desc.charAt(0).toUpperCase() + desc.slice(1)} in African Business`;
  };

  const generateFeatureList = (desc: string, tone: string, platform: string): string => {
    const features = {
      professional: ['✅ Advanced analytics', '✅ Seamless integration', '✅ Real-time insights', '✅ Mobile optimization'],
      casual: ['🔥 Super easy to use', '💪 Actually works offline', '🌟 Made for African businesses', '❤️ Customer support in local languages'],
      promotional: ['🎯 50% cost reduction', '⚡ Instant setup', '💎 Premium features included', '🎁 Free onboarding'],
      inspirational: ['🌟 Unlimited potential', '💪 Confidence in decisions', '🚀 Growth acceleration', '✨ Success made simple'],
      humorous: ['🤪 No complicated setup', '😂 Actually user-friendly', '🎉 Works as advertised', '🦄 Tech that makes sense'],
      informative: ['📊 Data-driven insights', '📈 Measurable results', '🧠 Evidence-based features', '📚 Research-backed approach']
    };
    
    const toneFeatures = features[tone as keyof typeof features] || features.professional;
    return toneFeatures.slice(0, 3).join('\n');
  };

  const generateDetailedAnalysis = (desc: string, tone: string): string => {
    return `After extensive research across East African markets, we've identified that ${desc} represents a critical growth opportunity for small businesses. Our analysis shows significant impact on operational efficiency and profitability.`;
  };

  const generateEngagementQuestion = (tone: string): string => {
    const questions = {
      professional: "What has been your experience with business automation tools?",
      casual: "What's the biggest challenge in your business right now?",
      promotional: "Ready to transform your business operations?",
      inspirational: "What's your biggest business dream for 2025?",
      humorous: "Anyone else tired of overly complicated business software?",
      informative: "What business metrics do you track most closely?"
    };
    
    return questions[tone as keyof typeof questions] || questions.professional;
  };

  const generateSmartHashtags = (platform: string, tone: string, desc: string, generatedContent: string): string[] => {
    const baseHashtags = ['#SmallBusiness', '#AfricanTech', '#Entrepreneurs', '#BusinessGrowth'];
    
    // Extract keywords from content for smarter hashtag generation
    const contentKeywords = extractContentKeywords(generatedContent);
    
    const toneHashtags = {
      professional: ['#DigitalTransformation', '#BusinessInnovation', '#TechSolutions', '#AIInnovation'],
      casual: ['#EntrepreneurLife', '#SmallBizLife', '#BusinessTips', '#StartupLife'],
      promotional: ['#LimitedOffer', '#BusinessDeal', '#SpecialPrice', '#FlashSale'],
      inspirational: ['#DreamBig', '#SuccessStory', '#Motivation', '#BelieveInYourself'],
      humorous: ['#BusinessHumor', '#EntrepreneurMemes', '#StartupLife', '#BusinessReality'],
      informative: ['#BusinessEducation', '#LearnBusiness', '#BusinessFacts', '#KnowledgeSharing']
    };

    const platformSpecific = {
      instagram: ['#BusinessInspo', '#AfricanInnovation', '#TechForAfrica', '#MobileFirst'],
      twitter: ['#AfricanStartups', '#TechNews', '#Innovation', '#Business'],
      linkedin: ['#ProfessionalDevelopment', '#BusinessStrategy', '#Leadership', '#TechForGood']
    };

    const contextHashtags = generateContextualHashtags(desc, contentKeywords);

    return [
      ...baseHashtags,
      ...(toneHashtags[tone as keyof typeof toneHashtags] || []),
      ...(platformSpecific[platform as keyof typeof platformSpecific] || []),
      ...contextHashtags
    ].slice(0, platform === 'twitter' ? 5 : 8);
  };

  const extractContentKeywords = (content: string): string[] => {
    const businessKeywords = ['inventory', 'sales', 'payment', 'automation', 'AI', 'growth', 'profit', 'management', 'tracking', 'integration'];
    const found = businessKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    return found;
  };

  const generateContextualHashtags = (desc: string, contentKeywords: string[]): string[] => {
    const contextMap: Record<string, string[]> = {
      inventory: ['#InventoryManagement', '#StockControl'],
      sales: ['#SalesTracker', '#Revenue'],
      payment: ['#MobileMoney', '#MPesa', '#Payments'],
      ai: ['#ArtificialIntelligence', '#Automation'],
      automation: ['#ProcessAutomation', '#Efficiency'],
      growth: ['#BusinessGrowth', '#Scaling'],
      profit: ['#Profitability', '#ROI'],
      management: ['#BusinessManagement', '#Operations'],
      tracking: ['#Analytics', '#DataDriven'],
      integration: ['#SystemIntegration', '#Connectivity']
    };

    let contextHashtags: string[] = [];
    
    // Check description
    Object.keys(contextMap).forEach(key => {
      if (desc.toLowerCase().includes(key)) {
        contextHashtags.push(...contextMap[key]);
      }
    });

    // Check content keywords
    contentKeywords.forEach(keyword => {
      if (contextMap[keyword.toLowerCase()]) {
        contextHashtags.push(...contextMap[keyword.toLowerCase()]);
      }
    });

    return [...new Set(contextHashtags)].slice(0, 3); // Remove duplicates and limit
  };

  const generateMockContent = (platform: string, type: string, tone: string, desc: string): GeneratedContent => {
    const contentMap: Record<string, Record<string, Record<string, string>>> = {
      instagram: {
        post: {
          professional: `Transform your business with smart inventory management! 📊\\n\\nOur latest AI-powered tools help small businesses in Africa optimize stock levels and boost profits. Say goodbye to stockouts and overstocking.\\n\\n${desc}\\n\\n#SmallBusiness #AI #Inventory #Africa #Business`,
          casual: `Hey business owners! 👋\\n\\nTired of running out of stock just when customers need it most? We've got you covered! ✨\\n\\n${desc}\\n\\nSwipe to see how easy it is! ➡️\\n\\n#BusinessLife #SmallBiz #Entrepreneur #StockManagement`,
          promotional: `🔥 LIMITED TIME: 50% OFF Premium Features! 🔥\\n\\n${desc}\\n\\nJoin 10,000+ African entrepreneurs already growing their business with our AI tools.\\n\\n👆 Link in bio to get started!\\n\\n#Sale #BusinessGrowth #LimitedOffer #AI`
        },
        story: {
          professional: `Professional story content for: ${desc}`,
          casual: `Casual story content for: ${desc}`,
          promotional: `Promotional story content for: ${desc}`
        },
        ad: {
          professional: `Professional ad content for: ${desc}`,
          casual: `Casual ad content for: ${desc}`,
          promotional: `Ready to grow your business? ${desc} Start your free trial today!`
        }
      },
      twitter: {
        post: {
          professional: `AI-powered business management is revolutionizing small businesses across Africa 🚀\\n\\n${desc}\\n\\nSee how entrepreneurs are increasing profits with smart inventory tracking.\\n\\n#SmallBusiness #AI #Africa`,
          casual: `Just helped another small business owner avoid stockouts! 🎉\\n\\n${desc}\\n\\nThis is why I love building tools for entrepreneurs 💪\\n\\n#BusinessWin #Entrepreneur`,
          promotional: `🚨 Special offer: 50% off for African small businesses!\\n\\n${desc}\\n\\nClaim your discount: [link]\\n\\n#BusinessTools #Discount #SmallBiz`
        }
      },
      linkedin: {
        post: {
          professional: `The Future of Small Business Management in Africa\\n\\n${desc}\\n\\nAs we continue to see digital transformation across African markets, AI-powered business tools are becoming essential for competitive advantage.\\n\\nKey benefits I've observed:\\n• 40% reduction in stockouts\\n• 25% increase in profit margins\\n• 60% time saved on inventory management\\n\\nWhat's your experience with business automation tools?\\n\\n#SmallBusiness #AI #Africa #DigitalTransformation`,
          casual: `Quick win for small business owners! 💡\\n\\n${desc}\\n\\nJust implemented this with a client and saw immediate results. Sometimes the simplest solutions make the biggest impact.\\n\\n#BusinessTips #Entrepreneurship`,
          promotional: `Announcing our new AI Business Coach for African entrepreneurs! 🎉\\n\\n${desc}\\n\\nLimited beta access available. Comment below if you're interested!\\n\\n#ProductLaunch #AI #SmallBusiness`
        }
      }
    };

    const content = contentMap[platform]?.[type]?.[tone] || `Generated content for ${platform} ${type} in ${tone} tone: ${desc}`;
    
    const hashtags = platform === 'instagram' 
      ? ['#SmallBusiness', '#AI', '#Africa', '#Entrepreneur', '#BusinessGrowth']
      : platform === 'twitter'
      ? ['#SmallBiz', '#AI', '#Entrepreneur']
      : ['#SmallBusiness', '#AI', '#DigitalTransformation'];

    return {
      platform,
      type,
      content,
      hashtags
    };
  };

  const getPlatformIcon = (platformValue: string) => {
    const platform = platforms.find(p => p.value === platformValue);
    return platform ? platform.icon : Instagram;
  };

  const handleShare = (sharePlatform: string) => {
    // Handle sharing to specific platform
    console.log(`Sharing to ${sharePlatform}:`, generatedContent);
    setShowShareModal(false);
    // In a real app, this would integrate with platform APIs or copy to clipboard
  };

  const renderPlatformPreview = () => {
    if (!generatedContent) return null;

    const PlatformIcon = getPlatformIcon(generatedContent.platform);

    if (generatedContent.platform === 'instagram') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-sm mx-auto">
          {/* Instagram Header */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">NM</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">numeraai_official</p>
              <p className="text-xs text-gray-500">Sponsored</p>
            </div>
          </div>

          {/* Image */}
          {generatedContent.imageUrl && (
            <div className="aspect-square bg-gray-100 relative">
              <ImageWithFallback 
                src={generatedContent.imageUrl}
                alt="Generated content"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-3">
            <p className="text-sm mb-2 line-clamp-3">{generatedContent.content}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {generatedContent.hashtags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-blue-600 text-xs">{tag}</span>
              ))}
            </div>
            <p className="text-xs text-gray-500">2 minutes ago</p>
          </div>
        </div>
      );
    }

    if (generatedContent.platform === 'twitter') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-lg mx-auto">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">NM</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-medium text-sm">NumeraAI</span>
                <span className="text-blue-500">✓</span>
                <span className="text-gray-500 text-sm">@numeraai</span>
                <span className="text-gray-500 text-sm">• 2m</span>
              </div>
              <p className="text-sm mb-2">{generatedContent.content}</p>
              {generatedContent.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-gray-200 mb-2">
                  <ImageWithFallback 
                    src={generatedContent.imageUrl}
                    alt="Generated content"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (generatedContent.platform === 'linkedin') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 max-w-lg mx-auto">
          <div className="p-4">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">NM</span>
              </div>
              <div>
                <p className="font-medium text-sm">NumeraAI</p>
                <p className="text-xs text-gray-500">AI Business Solutions • 2nd</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <p className="text-sm mb-3 whitespace-pre-line">{generatedContent.content}</p>
            {generatedContent.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-gray-200 mb-3">
                <ImageWithFallback 
                  src={generatedContent.imageUrl}
                  alt="Generated content"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderPreview = () => {
    if (!generatedContent) return null;

    const PlatformIcon = getPlatformIcon(generatedContent.platform);

    return (
      <Card className="rounded-lg border-2 border-[#00C4B4]/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 bg-[#00C4B4] rounded-full flex items-center justify-center">
              <PlatformIcon className="w-4 h-4 text-white" />
            </div>
            {generatedContent.platform.charAt(0).toUpperCase() + generatedContent.platform.slice(1)} {generatedContent.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform-specific preview mockup */}
          {renderPlatformPreview()}
          
          {/* Hashtags */}
          {generatedContent.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {generatedContent.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setGeneratedContent(null)}
            >
              Generate New
            </Button>
            <Button 
              onClick={() => setShowShareModal(true)}
              className="flex-1 bg-[#00C4B4] hover:bg-[#00B3A6] text-white h-12"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-lg font-medium">Generate Social Media Content</h2>
          <p className="text-sm text-muted-foreground">AI-powered content creation</p>
        </div>
      </div>

      {/* Form */}
      <Card className="rounded-lg">
        <CardContent className="p-4 space-y-4">
          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {p.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description
              <span className="text-xs text-muted-foreground ml-2">
                ({description.length}/200)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of what you want to promote..."
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setDescription(e.target.value);
                }
              }}
              className="rounded-lg resize-none"
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateContent}
            disabled={!platform || !contentType || !tone || !description.trim() || isGenerating}
            className="w-full bg-[#00C4B4] hover:bg-[#00B3A6] text-white rounded-lg h-12"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating AI Content...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Content
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Area */}
      {generatedContent && (
        <div className="space-y-2">
          <Label>Generated Content Preview</Label>
          {renderPreview()}
        </div>
      )}

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Content
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose where to share your generated content:
            </p>
            
            {/* Platform sharing options */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleShare('instagram')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 rounded-lg flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium">Instagram</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium">LinkedIn</span>
              </button>
            </div>

            {/* Cancel button */}
            <Button
              variant="outline"
              onClick={() => setShowShareModal(false)}
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}