import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ServerProduct } from '../../types';
import serverProducts from '../../data/serverProducts.json';

interface ProductShowcaseProps {
  onLearnMore: (product: ServerProduct) => void;
}

export function ProductShowcase({ onLearnMore }: ProductShowcaseProps) {
  const products = serverProducts as ServerProduct[];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F2027] mb-4">
            HPE ProLiant Server Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From entry-level to enterprise-class, find the perfect server for your workload. 
            Our AI advisor will help you choose the right configuration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <img 
                  src={product.imageUrl}
                  alt={product.model}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F2027] mb-2">
                    {product.model}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Starting at:</span>
                    <span className="font-semibold text-[#01A982]">
                      ${product.pricing.basePrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.useCases.slice(0, 2).map((useCase) => (
                      <span 
                        key={useCase}
                        className="px-2 py-1 bg-[#01A982]/10 text-[#01A982] text-xs rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onLearnMore(product)}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-[#01A982] hover:bg-[#018f73]">
            Compare All Servers
          </Button>
        </div>
      </div>
    </section>
  );
}