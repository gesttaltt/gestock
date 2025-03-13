/*
 SortableCustomerItem.tsx
*/
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "./Button";  // Adjust the path if needed
import Card from "./Card";      // Adjust the path if needed

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SortableCustomerItemProps {
  id: string; // Must be string for DndKit
  customer: Customer;
  onEdit: () => void;
}

const SortableCustomerItem: React.FC<SortableCustomerItemProps> = ({
  id,
  customer,
  onEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Each customer is displayed as a Card */}
      <Card className="bg-white rounded-lg shadow p-4 flex justify-between items-center cursor-move">
        <div>
          <p className="font-semibold text-gray-800">{customer.name}</p>
          <p className="text-sm text-gray-600">{customer.email}</p>
          <p className="text-sm text-gray-600">{customer.phone}</p>
        </div>
        <Button onClick={onEdit}>Editar</Button>
      </Card>
    </div>
  );
};

export default SortableCustomerItem;
