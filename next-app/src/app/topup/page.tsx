import React, { useState } from 'react';
import { CreditCard, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const coinPackages = [
  { coins: 100, price: 5 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

export default function TopUpPage() {
  const [selectedPackage, setSelectedPackage] = useState(coinPackages[0]);
  const [customCoins, setCustomCoins] = useState('');

  const handleCustomCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCoins(e.target.value);
    setSelectedPackage(null);
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setCustomCoins('');
  };

  const handleTopUp = () => {
    // Implement your top-up logic here
    const coinsToAdd = selectedPackage ? selectedPackage.coins : parseInt(customCoins);
    console.log(`Adding ${coinsToAdd} coins to user's account`);
    // You would typically make an API call here to update the user's balance
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Top Up Coins</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {coinPackages.map((pkg) => (
          <Card key={pkg.coins} className={`cursor-pointer ${selectedPackage === pkg ? 'border-blue-500' : ''}`} onClick={() => handlePackageSelect(pkg)}>
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
      <Card>
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
      <div className="mt-6">
        <Button onClick={handleTopUp} className="w-full">
          <CreditCard className="mr-2 h-4 w-4" /> Top Up Now
        </Button>
      </div>
    </div>
  );
}