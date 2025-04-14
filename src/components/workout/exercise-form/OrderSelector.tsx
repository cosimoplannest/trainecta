
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface OrderSelectorProps {
  orderIndex: number;
  maxOrder: number;
  onChange: (orderIndex: number) => void;
}

export const OrderSelector: React.FC<OrderSelectorProps> = ({
  orderIndex,
  maxOrder,
  onChange
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex justify-between">
        <Label htmlFor="order">Order</Label>
        <span className="text-sm">{orderIndex}</span>
      </div>
      <Slider
        id="order"
        min={1}
        max={Math.max(maxOrder, 1)}
        step={1}
        value={[orderIndex || 1]}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
};
