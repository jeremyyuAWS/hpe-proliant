import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ServerProduct } from '../../types';
import { Check } from 'lucide-react';

interface ServerRecommendationProps {
  products: ServerProduct[];
  onApprove: (products: ServerProduct[]) => void;
}

export function ServerRecommendation({ products, onApprove }: ServerRecommendationProps) {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent>
        <h3 className="font-semibold text-gray-800 mb-4">Recommended Servers</h3>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg p-4 border">
              <div className="flex items-start space-x-4">
                <img 
                  src={product.imageUrl}
                  alt={product.model}
                  className="w-20 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{product.model}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#01A982]">
                      ${product.pricing.basePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Key Specifications:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Processors: {product.specifications.processors}</div>
                  <div>Memory: {product.specifications.memory}</div>
                  <div>Form Factor: {product.specifications.formFactor}</div>
                  <div>Storage: {product.specifications.storage}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => onApprove(products)}
            className="flex-1"
          >
            <Check className="mr-2 h-4 w-4" />
            Generate Quote
          </Button>
          <Button variant="outline" className="flex-1">
            Modify Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}