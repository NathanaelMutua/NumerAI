import React, { useState } from 'react';
import { Package, Plus, Search, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumThreshold: number;
  maximumCapacity: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: Date;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Chick Mash 50kg',
    category: 'Poultry Feed',
    currentStock: 45,
    minimumThreshold: 20,
    maximumCapacity: 100,
    unitPrice: 2800,
    supplier: 'Kenchic Ltd',
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  },
  {
    id: '2',
    name: 'Layers Mash 50kg',
    category: 'Poultry Feed',
    currentStock: 8,
    minimumThreshold: 25,
    maximumCapacity: 80,
    unitPrice: 2200,
    supplier: 'Kenchic Ltd',
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  },
  {
    id: '3',
    name: 'Growers Mash 50kg',
    category: 'Poultry Feed',
    currentStock: 25,
    minimumThreshold: 15,
    maximumCapacity: 60,
    unitPrice: 2400,
    supplier: 'Kenchic Ltd',
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: '4',
    name: 'Dairy Meal 50kg',
    category: 'Dairy Feed',
    currentStock: 35,
    minimumThreshold: 20,
    maximumCapacity: 100,
    unitPrice: 2500,
    supplier: 'Coopers Kenya Ltd',
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  },
  {
    id: '5',
    name: 'Pig Finisher 50kg',
    category: 'Swine Feed',
    currentStock: 25,
    minimumThreshold: 15,
    maximumCapacity: 60,
    unitPrice: 2800,
    supplier: 'Farmer\'s Choice',
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: '6',
    name: 'Broiler Starter 50kg',
    category: 'Poultry Feed',
    currentStock: 35,
    minimumThreshold: 20,
    maximumCapacity: 80,
    unitPrice: 2600,
    supplier: 'Kenchic Ltd',
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  },
  {
    id: '7',
    name: 'Fish Meal 25kg',
    category: 'Aquaculture',
    currentStock: 12,
    minimumThreshold: 30,
    maximumCapacity: 50,
    unitPrice: 1800,
    supplier: 'Victory Farms',
    lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  {
    id: '8',
    name: 'Calf Milk Replacer 20kg',
    category: 'Dairy Feed',
    currentStock: 18,
    minimumThreshold: 25,
    maximumCapacity: 40,
    unitPrice: 3200,
    supplier: 'Coopers Kenya Ltd',
    lastRestocked: new Date()
  }
];

export function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    currentStock: 0,
    minimumThreshold: 0,
    maximumCapacity: 0,
    unitPrice: 0,
    supplier: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (item: InventoryItem) => {
    const stockPercentage = (item.currentStock / item.maximumCapacity) * 100;
    const isLowStock = item.currentStock <= item.minimumThreshold;
    
    if (isLowStock) {
      return { status: 'low', color: 'bg-red-500', label: 'Low Stock', textColor: 'text-red-600' };
    } else if (stockPercentage <= 50) {
      return { status: 'medium', color: 'bg-yellow-500', label: 'Medium Stock', textColor: 'text-yellow-600' };
    } else {
      return { status: 'good', color: 'bg-green-500', label: 'Good Stock', textColor: 'text-green-600' };
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minimumThreshold);
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const totalItems = inventory.reduce((sum, item) => sum + item.currentStock, 0);

  const handleAddItem = () => {
    // Validation
    if (!newItem.name || !newItem.category || !newItem.supplier) {
      alert('Please fill in all required fields (Name, Category, Supplier)');
      return;
    }

    if (newItem.currentStock < 0 || newItem.minimumThreshold < 0 || newItem.maximumCapacity <= 0 || newItem.unitPrice < 0) {
      alert('Please enter valid numbers (Stock levels cannot be negative, maximum capacity must be greater than 0)');
      return;
    }

    if (newItem.currentStock > newItem.maximumCapacity) {
      alert('Current stock cannot exceed maximum capacity');
      return;
    }

    if (newItem.minimumThreshold > newItem.maximumCapacity) {
      alert('Minimum threshold cannot exceed maximum capacity');
      return;
    }

    // Create new item
    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      currentStock: newItem.currentStock,
      minimumThreshold: newItem.minimumThreshold,
      maximumCapacity: newItem.maximumCapacity,
      unitPrice: newItem.unitPrice,
      supplier: newItem.supplier,
      lastRestocked: new Date()
    };

    setInventory(prev => [...prev, item]);

    // Reset form
    setNewItem({
      name: '',
      category: '',
      currentStock: 0,
      minimumThreshold: 0,
      maximumCapacity: 0,
      unitPrice: 0,
      supplier: ''
    });

    setShowAddItem(false);
  };

  const handleCancelAdd = () => {
    setNewItem({
      name: '',
      category: '',
      currentStock: 0,
      minimumThreshold: 0,
      maximumCapacity: 0,
      unitPrice: 0,
      supplier: ''
    });
    setShowAddItem(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Inventory Manager</h2>
          <p className="text-muted-foreground text-sm">Mfumo wa kuhifadhi bidhaa / Stock management</p>
        </div>
        <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Product Name *</Label>
                <Input
                  id="itemName"
                  placeholder="e.g., Dairy Meal 50kg"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemCategory">Category *</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy Feed">Dairy Feed</SelectItem>
                    <SelectItem value="Poultry Feed">Poultry Feed</SelectItem>
                    <SelectItem value="Swine Feed">Swine Feed</SelectItem>
                    <SelectItem value="Aquaculture">Aquaculture</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItem.currentStock || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (KES)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={newItem.unitPrice || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="minThreshold">Minimum Threshold</Label>
                  <Input
                    id="minThreshold"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItem.minimumThreshold || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, minimumThreshold: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    min="1"
                    placeholder="0"
                    value={newItem.maximumCapacity || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, maximumCapacity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  placeholder="e.g., Coopers Kenya Ltd"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddItem} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="outline" onClick={handleCancelAdd} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-medium">{totalItems}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm font-medium">{formatCurrency(totalValue)}</p>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-sm font-medium">{lowStockItems.length}</p>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              Stock Alert - {lowStockItems.length} items need attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-red-600">
                    {item.currentStock} left (min: {item.minimumThreshold})
                  </span>
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <p className="text-xs text-muted-foreground mt-1">
                  +{lowStockItems.length - 3} more items need restocking
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Items */}
      <div className="space-y-3">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item);
          const stockPercentage = (item.currentStock / item.maximumCapacity) * 100;
          
          return (
            <Card key={item.id} className="relative">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Supplier: {item.supplier}
                    </p>
                    <p className="text-sm">
                      Unit Price: {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                      <span className={`text-sm font-medium ${stockStatus.textColor}`}>
                        {item.currentStock}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of {item.maximumCapacity}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stock Level</span>
                    <span>{stockStatus.label}</span>
                  </div>
                  <Progress 
                    value={stockPercentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {item.minimumThreshold}</span>
                    <span>Value: {formatCurrency(item.currentStock * item.unitPrice)}</span>
                  </div>
                </div>

                {/* AI Prediction */}
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    🤖 AI Prediction: Based on sales trends, restock in{' '}
                    {Math.max(1, Math.floor(item.currentStock / 3))} days
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No items found matching your search' : 'No inventory items found'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}