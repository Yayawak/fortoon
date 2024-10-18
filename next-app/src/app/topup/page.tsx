'use client'

import React, { useState } from 'react';
import { CreditCard, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

const coinPackages = [
  { coins: 100, price: 5 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

export default function TopUpPage() {
  const [selectedPackage, setSelectedPackage] = useState(coinPackages[0]);
  const [customCoins, setCustomCoins] = useState('');
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCustomCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCoins(e.target.value);
    setSelectedPackage(null);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setCustomCoins('');
  };

  const handleTopUp = async () => {
    setIsLoading(true);
    const coinsToAdd = selectedPackage ? selectedPackage.coins : parseInt(customCoins);
    
    try {
      const response = await fetch('/api/payment/coin/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: coinsToAdd }),
      });

      if (!response.ok) {
        throw new Error('Deposit failed');
      }

      const data = await response.json();
      setBalance(data.newBalance);
      toast({
        title: "Top Up Successful",
        description: `Added ${coinsToAdd} coins. New balance: ${data.newBalance} coins.`,
      });
    } catch (error) {
      console.error('Error depositing coins:', error);
      toast({
        title: "Top Up Failed",
        description: "There was an error processing your top up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Top Up Coins</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {coinPackages.map((pkg) => (
          <Card 
            key={pkg.coins} 
            className={`cursor-pointer ${selectedPackage === pkg ? 'border-blue-500' : ''}`} 
            onClick={() => handlePackageSelect(pkg)}
          >
            <CardHeader>
              <CardTitle>{pkg.coins} Coins</CardTitle>
              <CardDescription>${pkg.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <Coins className="w-12 h-12 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Custom Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Label htmlFor="customCoins">Coins:</Label>
            <Input
              id="customCoins"
              type="number"
              value={customCoins}
              onChange={handleCustomCoinsChange}
              placeholder="Enter custom coin amount"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{balance} coins</p>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button onClick={handleTopUp} className="w-full" disabled={isLoading}>
          <CreditCard className="mr-2 h-4 w-4" /> 
          {isLoading ? 'Processing...' : 'Top Up Now'}
        </Button>
      </div>
    </div>
  );
}