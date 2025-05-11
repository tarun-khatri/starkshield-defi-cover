
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Asset, ConditionType, Duration, Direction, InsuranceCondition } from '@/types';

// Mock admin addresses for the MVP
const ADMIN_ADDRESSES = [
  '0x123...abc',
  // Add more admin addresses as needed
];

const Admin = () => {
  const { walletState } = useWallet();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    asset: 'ETH' as Asset,
    conditionType: '10%' as ConditionType,
    duration: '24h' as Duration,
    direction: 'down' as Direction,
    active: true,
    premiumRate: 5,
    verificationSource: 'pragma'
  });

  const [events, setEvents] = useState<any[]>([]);
  
  // Check if the connected wallet is an admin
  useEffect(() => {
    if (walletState.connected && walletState.address) {
      // In a real app, this would check against a backend or smart contract
      const isUserAdmin = ADMIN_ADDRESSES.includes(walletState.address) || true; // For MVP, always true
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast.error("Access denied", {
          description: "You don't have admin permissions"
        });
        navigate('/');
      }
    } else {
      setIsAdmin(false);
    }
  }, [walletState.connected, walletState.address, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a condition object from the form data
    const condition: InsuranceCondition = {
      asset: formData.asset,
      conditionType: formData.conditionType,
      duration: formData.duration,
      direction: formData.direction,
      description: `${formData.asset} ${formData.direction === 'down' ? 'drops' : 'rises'} ${'>'} ${formData.conditionType} in ${formData.duration}`
    };
    
    // Create a new event
    const newEvent = {
      id: `event-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      condition,
      createdBy: walletState.address,
      createdAt: Date.now(),
      active: formData.active,
      premiumRate: formData.premiumRate,
      verificationSource: formData.verificationSource
    };
    
    // In a real app, you would save this to a database or blockchain
    setEvents(prev => [...prev, newEvent]);
    
    toast.success("Event created successfully", {
      description: `${formData.name} has been created and ${formData.active ? 'activated' : 'saved as draft'}`
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      asset: 'ETH' as Asset,
      conditionType: '10%' as ConditionType,
      duration: '24h' as Duration,
      direction: 'down' as Direction,
      active: true,
      premiumRate: 5,
      verificationSource: 'pragma'
    });
  };
  
  if (!walletState.connected) {
    return (
      <div className="container px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-8">Please connect your wallet to access the admin dashboard.</p>
        <Button onClick={() => navigate('/')}>Go Back to Home</Button>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
        <p className="mb-8">You don't have permission to access the admin dashboard.</p>
        <Button onClick={() => navigate('/')}>Go Back to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="create">
        <TabsList className="mb-8">
          <TabsTrigger value="create">Create Event</TabsTrigger>
          <TabsTrigger value="manage">Manage Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Insurance Event</CardTitle>
              <CardDescription>
                Create a new insurance event that users can purchase coverage for.
                This will be verified using Pragma oracle data.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="ETH Price Drop Protection"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Input 
                    id="description"
                    name="description"
                    placeholder="Protection against ETH price drops"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset">Asset</Label>
                    <Select
                      value={formData.asset}
                      onValueChange={(value) => handleSelectChange('asset', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="AVAX">AVAX</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="MATIC">MATIC</SelectItem>
                        <SelectItem value="LINK">LINK</SelectItem>
                        <SelectItem value="UNI">UNI</SelectItem>
                        <SelectItem value="AAVE">AAVE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direction">Direction</Label>
                    <Select
                      value={formData.direction}
                      onValueChange={(value) => handleSelectChange('direction', value as Direction)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="down">Price Drop</SelectItem>
                        <SelectItem value="up">Price Rise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conditionType">Condition Percentage</Label>
                    <Select
                      value={formData.conditionType}
                      onValueChange={(value) => handleSelectChange('conditionType', value as ConditionType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5%">5%</SelectItem>
                        <SelectItem value="10%">10%</SelectItem>
                        <SelectItem value="15%">15%</SelectItem>
                        <SelectItem value="20%">20%</SelectItem>
                        <SelectItem value="25%">25%</SelectItem>
                        <SelectItem value="30%">30%</SelectItem>
                        <SelectItem value="40%">40%</SelectItem>
                        <SelectItem value="50%">50%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => handleSelectChange('duration', value as Duration)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="48h">48 hours</SelectItem>
                        <SelectItem value="72h">72 hours</SelectItem>
                        <SelectItem value="7d">7 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="premiumRate">Premium Rate (%)</Label>
                    <Input 
                      id="premiumRate"
                      name="premiumRate"
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      placeholder="5"
                      value={formData.premiumRate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verificationSource">Verification Source</Label>
                    <Select
                      value={formData.verificationSource}
                      onValueChange={(value) => handleSelectChange('verificationSource', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pragma">Pragma Oracle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="active">Activate immediately</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Create Insurance Event</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="grid gap-4">
            {events.length > 0 ? (
              events.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${event.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {event.active ? 'Active' : 'Draft'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Asset:</span> {event.condition.asset}
                      </div>
                      <div>
                        <span className="font-medium">Condition:</span> {event.condition.description}
                      </div>
                      <div>
                        <span className="font-medium">Premium Rate:</span> {event.premiumRate}%
                      </div>
                      <div>
                        <span className="font-medium">Verification:</span> {event.verificationSource}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button 
                      variant={event.active ? "destructive" : "default"} 
                      size="sm"
                    >
                      {event.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events created yet. Create your first event to get started.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                View statistics about your insurance events and platform usage.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Analytics dashboard will be available in the next update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
