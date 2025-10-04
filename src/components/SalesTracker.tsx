import React, { useState } from 'react';
import { RotateCcw, DollarSign, Clock, TrendingUp, Users, Package, CheckCircle, Plus, ShoppingCart, Trash2, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Sale {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: string;
  timestamp: Date;
  customer?: string;
}

interface OrderItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  notes?: string;
}

const mockSales: Sale[] = [
  {
    id: '1',
    product: 'Chick Mash 50kg',
    quantity: 3,
    unitPrice: 2800,
    total: 8400,
    paymentMethod: 'M-Pesa',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    customer: 'Grace Wanjiku'
  },
  {
    id: '2',
    product: 'Layers Mash 50kg',
    quantity: 2,
    unitPrice: 2200,
    total: 4400,
    paymentMethod: 'Cash',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    customer: 'John Mwangi'
  },
  {
    id: '3',
    product: 'Growers Mash 50kg',
    quantity: 1,
    unitPrice: 2400,
    total: 2400,
    paymentMethod: 'Airtel Money',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
  }
];

// Mock M-Pesa transactions that would be fetched from statements
const mockMpesaTransactions = [
  {
    id: 'MPT' + Date.now(),
    product: 'Chick Mash 50kg',
    quantity: 2,
    unitPrice: 2800,
    total: 5600,
    paymentMethod: 'M-Pesa',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    customer: 'Mary Njeri'
  },
  {
    id: 'MPT' + (Date.now() + 1),
    product: 'Layers Mash 50kg',
    quantity: 3,
    unitPrice: 2200,
    total: 6600,
    paymentMethod: 'M-Pesa',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    customer: 'Peter Kimani'
  },
  {
    id: 'MPT' + (Date.now() + 2),
    product: 'Growers Mash 50kg',
    quantity: 4,
    unitPrice: 2400,
    total: 9600,
    paymentMethod: 'M-Pesa',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    customer: 'Sarah Waweru'
  }
];

export function SalesTracker() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    notes: ''
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [newItem, setNewItem] = useState({
    product: 'Chick Mash 50kg', 
    quantity: 1,
    unitPrice: 2800 
  });

  // Main products dropdown options with their prices
  const mainProducts = [
    { name: 'Chick Mash 50kg', price: 2800 },
    { name: 'Layers Mash 50kg', price: 2200 },
    { name: 'Growers Mash 50kg', price: 2400 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-KE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const todaysSales = sales.filter(sale => {
    const today = new Date();
    return sale.timestamp.toDateString() === today.toDateString();
  });

  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0);
  const avgTransactionValue = todaysSales.length > 0 ? todaysRevenue / todaysSales.length : 0;

  const handleRefreshSales = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to fetch M-Pesa statements
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new transactions from M-Pesa statements that aren't already in sales
    const existingIds = new Set(sales.map(sale => sale.id));
    const newTransactions = mockMpesaTransactions.filter(transaction => 
      !existingIds.has(transaction.id)
    );
    
    if (newTransactions.length > 0) {
      setSales(prevSales => [...newTransactions, ...prevSales]);
    }
    
    setLastRefreshTime(new Date());
    setIsRefreshing(false);
  };

  const addItemToOrder = () => {
    if (newItem.product && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const item: OrderItem = {
        id: Date.now().toString(),
        product: newItem.product,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        total: newItem.quantity * newItem.unitPrice
      };
      setOrderItems(prev => [...prev, item]);
      // Reset to defaults
      setNewItem({
        product: 'Chick Mash 50kg',
        quantity: 1,
        unitPrice: 2800
      });
    }
  };

  const removeItemFromOrder = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateOrderTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const createOrder = () => {
    if (newOrder.customerName && newOrder.customerPhone && orderItems.length > 0) {
      const order: Order = {
        id: Date.now().toString(),
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        items: orderItems,
        totalAmount: calculateOrderTotal(),
        status: 'pending',
        createdAt: new Date(),
        notes: newOrder.notes
      };
      setOrders(prev => [order, ...prev]);
      
      // Reset form
      setNewOrder({ customerName: '', customerPhone: '', notes: '' });
      setOrderItems([]);
      setIsOrderDialogOpen(false);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2>Sales Tracker</h2>
        <p className="text-muted-foreground text-sm">Umuuzaji wa leo / Today's sales & orders</p>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {/* Sales Header */}
          <div className="flex justify-between items-center">
            <div>
              {lastRefreshTime && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" />
                  Last sync: {lastRefreshTime.toLocaleTimeString('en-KE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              )}
            </div>
            <Button 
              onClick={handleRefreshSales}
              size="sm"
              className="flex items-center gap-2"
              disabled={isRefreshing}
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Refresh Sales'}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm font-medium">{formatCurrency(todaysRevenue)}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium">{todaysSales.length}</p>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm font-medium">{formatCurrency(avgTransactionValue)}</p>
                <p className="text-xs text-muted-foreground">Avg Value</p>
              </CardContent>
            </Card>
          </div>

          {/* Refresh Status */}
          {isRefreshing && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-medium text-blue-900">Syncing with M-Pesa statements...</p>
                    <p className="text-sm text-blue-700">Fetching latest transactions from your mobile money account</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Sales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysSales.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No sales recorded today
                </p>
              ) : (
                todaysSales.map((sale) => (
                  <div key={sale.id} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{sale.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.quantity} × {formatCurrency(sale.unitPrice)}
                      </p>
                      {sale.customer && (
                        <p className="text-xs text-muted-foreground">{sale.customer}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(sale.total)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {sale.paymentMethod}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(sale.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {/* Orders Header */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Manage customer orders</p>
            </div>
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>
                    Add customer details and order items.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Customer Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Customer Information</h4>
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        placeholder="Enter customer name"
                        value={newOrder.customerName}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, customerName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
                        id="customerPhone"
                        placeholder="+254712345678"
                        value={newOrder.customerPhone}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderNotes">Notes (Optional)</Label>
                      <Input
                        id="orderNotes"
                        placeholder="Special instructions"
                        value={newOrder.notes}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Add Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Order Items</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="itemProduct">Product</Label>
                        <Select 
                          value={newItem.product} 
                          onValueChange={(value) => {
                            const selectedProduct = mainProducts.find(p => p.name === value);
                            setNewItem(prev => ({ 
                              ...prev, 
                              product: value,
                              unitPrice: selectedProduct ? selectedProduct.price : prev.unitPrice
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {mainProducts.map((product) => (
                              <SelectItem key={product.name} value={product.name}>
                                {product.name} - {formatCurrency(product.price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="itemQuantity">Qty</Label>
                        <Input
                          id="itemQuantity"
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="itemPrice">Unit Price (KES)</Label>
                        <Input
                          id="itemPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.unitPrice || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={addItemToOrder} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  {orderItems.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Items in Order</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.product}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} × {formatCurrency(item.unitPrice)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{formatCurrency(item.total)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemFromOrder(item.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total:</span>
                          <span className="font-medium text-lg">{formatCurrency(calculateOrderTotal())}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={createOrder} 
                      className="flex-1"
                      disabled={!newOrder.customerName || !newOrder.customerPhone || orderItems.length === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Create Order
                    </Button>
                    <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <p className="text-sm text-muted-foreground">Create your first order to get started</p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.createdAt.toLocaleDateString()} • {order.createdAt.toLocaleTimeString('en-KE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">{formatCurrency(order.totalAmount)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.product} × {item.quantity}</span>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-xs text-muted-foreground mb-3 italic">
                        Note: {order.notes}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="flex-1"
                          >
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="flex-1"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}