import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Users, Calendar, Target, Lightbulb, Award, Edit2, Save, X, Plus, Receipt, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for analytics
const salesData = [
  { day: 'Mon', sales: 15000, transactions: 45 },
  { day: 'Tue', sales: 18000, transactions: 52 },
  { day: 'Wed', sales: 22000, transactions: 61 },
  { day: 'Thu', sales: 19000, transactions: 48 },
  { day: 'Fri', sales: 25000, transactions: 67 },
  { day: 'Sat', sales: 32000, transactions: 89 },
  { day: 'Sun', sales: 28000, transactions: 76 }
];

const productCategories = [
  { name: 'Dairy Feed', value: 35, color: '#8884d8' },
  { name: 'Poultry Feed', value: 25, color: '#82ca9d' },
  { name: 'Swine Feed', value: 20, color: '#ffc658' },
  { name: 'Aquaculture', value: 12, color: '#ff7300' },
  { name: 'Others', value: 8, color: '#0088fe' }
];

const customerSegments = [
  { segment: 'Regular Farmers', count: 156, growth: 12, color: 'text-green-600' },
  { segment: 'New Farmers', count: 23, growth: 8, color: 'text-blue-600' },
  { segment: 'Large-Scale Farms', count: 67, growth: -3, color: 'text-orange-600' }
];

const defaultGoals = [
  { id: 1, title: 'Monthly Feed Sales Target', current: 450000, target: 600000, unit: 'KES' },
  { id: 2, title: 'New Farmer Customers', current: 23, target: 30, unit: 'farmers' },
  { id: 3, title: 'Feed Inventory Turnover', current: 2.3, target: 3.0, unit: 'times' }
];

interface Goal {
  id: number;
  title: string;
  current: number;
  target: number;
  unit: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

const recommendations = [
  {
    type: 'Revenue',
    title: 'Increase Weekend Farmer Promotions',
    description: 'Your Saturday sales are 40% higher. Consider special weekend offers for farmers.',
    impact: 'High',
    effort: 'Low'
  },
  {
    type: 'Inventory',
    title: 'Expand Poultry Feed Products',
    description: 'Poultry feed represents 35% of sales but only 25% of inventory space.',
    impact: 'Medium',
    effort: 'Medium'
  },
  {
    type: 'Customer',
    title: 'Farmer Loyalty Program',
    description: 'Implement a simple loyalty card system to improve farmer retention.',
    impact: 'High',
    effort: 'High'
  }
];

export function BusinessInsights() {
  const [goals, setGoals] = useState(() => {
    // Load goals from localStorage or use defaults
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('numeraai_goals');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error loading goals:', e);
        }
      }
    }
    return defaultGoals;
  });
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // Load expenses from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('numeraai_expenses');
      if (saved) {
        try {
          const parsedExpenses = JSON.parse(saved);
          return parsedExpenses.map((exp: any) => ({
            ...exp,
            date: new Date(exp.date)
          }));
        } catch (e) {
          console.error('Error loading expenses:', e);
        }
      }
    }
    return [];
  });
  
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ target: 0, current: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    current: 0,
    target: 0,
    unit: 'KES'
  });
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'Supplies'
  });

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('numeraai_goals', JSON.stringify(goals));
    }
  }, [goals]);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('numeraai_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  const handleEditGoal = (goalId: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setEditingGoal(goalId);
      setEditValues({ target: goal.target, current: goal.current });
      setIsDialogOpen(true);
    }
  };

  const handleSaveGoal = () => {
    if (editingGoal !== null) {
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === editingGoal 
            ? { ...goal, target: editValues.target, current: editValues.current }
            : goal
        )
      );
      setEditingGoal(null);
      setIsDialogOpen(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setIsDialogOpen(false);
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: Goal = {
        id: Date.now(), // Use timestamp as unique ID
        title: newGoal.title,
        current: newGoal.current,
        target: newGoal.target,
        unit: newGoal.unit
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({ title: '', current: 0, target: 0, unit: 'KES' });
      setIsGoalDialogOpen(false);
    }
  };

  const handleCancelAddGoal = () => {
    setNewGoal({ title: '', current: 0, target: 0, unit: 'KES' });
    setIsGoalDialogOpen(false);
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: newExpense.amount,
        category: newExpense.category,
        date: new Date()
      };
      setExpenses(prev => [expense, ...prev]);
      setNewExpense({ description: '', amount: 0, category: 'Supplies' });
      setIsExpenseDialogOpen(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const downloadFinancialReport = () => {
    // Mock PDF generation - in real app would use jsPDF or similar
    const salesData = [
      { product: 'Maize Flour 2kg', revenue: 4500, cost: 3000, profit: 1500 },
      { product: 'Rice 1kg', revenue: 3600, cost: 2400, profit: 1200 },
      { product: 'Cooking Oil 500ml', revenue: 2000, cost: 1300, profit: 700 }
    ];
    
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    // Create a simple text report (in real app this would be a PDF)
    const reportContent = `
NUMERA AI - FINANCIAL REPORT
============================

Sales Summary:
${salesData.map(item => `${item.product}: Revenue ${formatCurrency(item.revenue)}, Profit ${formatCurrency(item.profit)}`).join('\n')}

Total Revenue: ${formatCurrency(totalRevenue)}
Total Expenses: ${formatCurrency(totalExpenses)}
Net Profit: ${formatCurrency(totalProfit)}

Expenses Breakdown:
${expenses.map(exp => `${exp.date.toLocaleDateString()}: ${exp.description} - ${formatCurrency(exp.amount)} (${exp.category})`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    // Download as text file (in real app would be PDF)
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2>Business Insights</h2>
        <p className="text-muted-foreground text-sm">
          Uchambuzi wa biashara / Analytics & performance insights
        </p>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Monthly Goals
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                    <DialogDescription>
                      Create a custom monthly goal to track your progress.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goalTitle">Goal Title</Label>
                      <Input
                        id="goalTitle"
                        placeholder="e.g., Daily Sales Target"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="goalCurrent">Current Value</Label>
                        <Input
                          id="goalCurrent"
                          type="number"
                          placeholder="0"
                          value={newGoal.current || ''}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, current: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goalTarget">Target Value</Label>
                        <Input
                          id="goalTarget"
                          type="number"
                          placeholder="0"
                          value={newGoal.target || ''}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goalUnit">Unit</Label>
                      <Select value={newGoal.unit} onValueChange={(value) => setNewGoal(prev => ({ ...prev, unit: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KES">KES (Currency)</SelectItem>
                          <SelectItem value="customers">Customers</SelectItem>
                          <SelectItem value="farmers">Farmers</SelectItem>
                          <SelectItem value="times">Times</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="units">Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddGoal} className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Goal
                      </Button>
                      <Button variant="outline" onClick={handleCancelAddGoal}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center justify-center h-8 w-8 p-0 rounded-md border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                    <DialogDescription>
                      Update your monthly goal targets and current progress.
                    </DialogDescription>
                  </DialogHeader>
                  {editingGoal && (
                    <div className="space-y-4">
                      {(() => {
                        const goal = goals.find(g => g.id === editingGoal);
                        return goal ? (
                          <>
                            <div>
                              <h4 className="font-medium mb-2">{goal.title}</h4>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Current Value</label>
                              <Input
                                type="number"
                                value={editValues.current}
                                onChange={(e) => setEditValues(prev => ({ 
                                  ...prev, 
                                  current: parseFloat(e.target.value) || 0 
                                }))}
                                placeholder={`Current ${goal.unit}`}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Target Value</label>
                              <Input
                                type="number"
                                value={editValues.target}
                                onChange={(e) => setEditValues(prev => ({ 
                                  ...prev, 
                                  target: parseFloat(e.target.value) || 0 
                                }))}
                                placeholder={`Target ${goal.unit}`}
                              />
                            </div>
                            <div className="flex gap-2 pt-4">
                              <button 
                                onClick={handleSaveGoal} 
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </button>
                              <button 
                                onClick={handleCancelEdit} 
                                className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md inline-flex items-center justify-center"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{goal.title}</span>
                    <button
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100 flex items-center justify-center rounded-sm hover:bg-accent"
                      onClick={() => handleEditGoal(goal.id)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {goal.unit === 'KES' ? formatCurrency(goal.current) : `${goal.current} ${goal.unit}`} / {' '}
                    {goal.unit === 'KES' ? formatCurrency(goal.target) : `${goal.target} ${goal.unit}`}
                  </span>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {percentage.toFixed(1)}% complete
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Sales Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Weekly Sales Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Best Day</p>
              <p className="font-medium">Saturday - {formatCurrency(32000)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth</p>
              <p className="font-medium text-green-600">+18.5% vs last week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Product Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {productCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1">
              {productCategories.map((category, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <span>{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Customer Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{segment.segment}</p>
                    <p className="text-xs text-muted-foreground">{segment.count} customers</p>
                  </div>
                  <div className={`flex items-center gap-1 ${segment.color}`}>
                    {segment.growth > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {segment.growth > 0 ? '+' : ''}{segment.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline" className={getImpactColor(rec.impact)}>
                    {rec.impact} Impact
                  </Badge>
                  <Badge variant="outline">
                    {rec.effort} Effort
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {rec.description}
              </p>
              <Badge variant="secondary" className="text-xs">
                {rec.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Expenses Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Business Expenses
            </div>
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Record a business expense to track your costs.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenseDescription">Description</Label>
                    <Input
                      id="expenseDescription"
                      placeholder="e.g., Office supplies, Rent, Fuel"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenseAmount">Amount (KES)</Label>
                    <Input
                      id="expenseAmount"
                      type="number"
                      placeholder="0"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenseCategory">Category</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Supplies">Supplies</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Food & Drinks">Food & Drinks</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddExpense} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense
                    </Button>
                    <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses recorded yet
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {expense.date.toLocaleDateString()} • {expense.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-600">
                      -{formatCurrency(expense.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {expenses.length > 5 && (
                <p className="text-xs text-center text-muted-foreground">
                  And {expenses.length - 5} more expenses...
                </p>
              )}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Monthly Expenses:</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              This Week's Performance
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={downloadFinancialReport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-lg font-medium text-green-600">
                {formatCurrency(159000)}
              </p>
              <p className="text-xs text-green-600">+18.5% vs last week</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-lg font-medium text-blue-600">438</p>
              <p className="text-xs text-blue-600">+12.3% vs last week</p>
            </div>
          </div>
          <div className="mt-4 p-2 bg-white/50 rounded-lg">
            <p className="text-xs text-center">
              🎉 Great job! You're on track to exceed your monthly target by 15%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}