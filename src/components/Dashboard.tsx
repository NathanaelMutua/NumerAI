import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface UserData {
  firstName: string;
  lastName: string;
  businessName: string;
  phone: string;
  businessType: string;
  yearsInBusiness: string;
}

interface DashboardProps {
  userData?: UserData;
}

// Mock data for demonstration
const mockData = {
  dailySales: 45000, // KES
  cashIn: 52000,
  cashOut: 7000,
  inventoryAlerts: 3,
  weeklyGrowth: 12.5,
  topProducts: [
    { name: 'Dairy Meal 50kg', sold: 24, revenue: 12000 },
    { name: 'Layers Mash 50kg', sold: 18, revenue: 9000 },
    { name: 'Pig Finisher 50kg', sold: 15, revenue: 15000 },
  ],
  lowStockItems: [
    { name: 'Broiler Starter 50kg', stock: 5, threshold: 20 },
    { name: 'Fish Meal 25kg', stock: 8, threshold: 25 },
    { name: 'Calf Milk Replacer 20kg', stock: 12, threshold: 30 },
  ]
};

export function Dashboard({ userData }: DashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Use user's first name or fallback to "there" if no user data
  const firstName = userData?.firstName || "there";

  return (
    <div className="p-4 space-y-4">
      {/* Welcome Message */}
      <div className="text-center py-2">
        <h2>Good morning, {firstName}!</h2>
        <p className="text-muted-foreground text-sm">Here's your business overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today's Sales</p>
                <p className="font-medium">{formatCurrency(mockData.dailySales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cash In</p>
                <p className="font-medium">{formatCurrency(mockData.cashIn)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cash Out</p>
                <p className="font-medium">{formatCurrency(mockData.cashOut)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Inventory Alerts</p>
                <p className="font-medium">{mockData.inventoryAlerts} items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Growth */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Weekly Growth</span>
            <Badge variant="default" className="bg-green-100 text-green-700">
              +{mockData.weeklyGrowth}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={mockData.weeklyGrowth * 2} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Your sales have increased by {mockData.weeklyGrowth}% this week
          </p>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Top Products Today
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockData.topProducts.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sold} units sold</p>
              </div>
              <p className="font-medium">{formatCurrency(product.revenue)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600" />
            Low Stock Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockData.lowStockItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.stock} left (min: {item.threshold})
                </p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">AI</span>
            </div>
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            📊 <strong>Demand Prediction:</strong> Get AI-powered demand forecasts for all your animal feed products
          </p>
          <p className="text-sm mt-2">
            💰 <strong>Pricing Suggestions:</strong> Optimize your prices for maximum profit with intelligent recommendations
          </p>
          <p className="text-sm mt-2">
            📈 Check the <strong>Business Insights</strong> page for detailed AI recommendations for each product
          </p>
        </CardContent>
      </Card>
    </div>
  );
}