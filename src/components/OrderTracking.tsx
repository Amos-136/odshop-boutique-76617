import { Check, Package, Truck, Home, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderTrackingProps {
  currentStatus: string;
  createdAt: string;
}

const OrderTracking = ({ currentStatus, createdAt }: OrderTrackingProps) => {
  const steps = [
    { id: 'pending', label: 'En attente', icon: Clock },
    { id: 'confirmed', label: 'Confirmée', icon: Check },
    { id: 'preparing', label: 'En préparation', icon: Package },
    { id: 'shipped', label: 'Expédiée', icon: Truck },
    { id: 'delivered', label: 'Livrée', icon: Home },
  ];

  const statusOrder = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="py-6">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20 scale-110"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 text-center max-w-[80px] transition-colors",
                    isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current status message */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm">
          <span className="font-semibold text-primary">
            {steps[currentIndex]?.label}
          </span>
          {currentIndex === statusOrder.length - 1 && (
            <span className="ml-2">🎉 Votre commande a été livrée !</span>
          )}
          {currentIndex < statusOrder.length - 1 && (
            <span className="ml-2 text-muted-foreground">
              Prochaine étape : {steps[currentIndex + 1]?.label}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default OrderTracking;
