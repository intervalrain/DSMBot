import React, { useState } from "react";
import { Assistant } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { CheckCircle } from "lucide-react";

interface AssistantCardProp extends Assistant {
  onEdit: (assistant: Assistant) => void;
  onApply: (assistant: Assistant) => void;
  isActive: boolean;
}

const AssistantCard: React.FC<AssistantCardProp> = ({
  id,
  title,
  description,
  systemPrompt,
  topK,
  onEdit,
  onApply,
  isActive,
}) => {
  return (
    <Card
      className={`w-full max-w-sm cursor-pointer transition-all duration-300
        ${isActive ? "ring-2-ring-blue-500" : "hover:shadow-lg hover:scale-105"}
        hover:bg-gray-50 dark:hover:bg-gray-800`}
      onClick={() => onApply({ id, title, description, systemPrompt, topK })}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          {isActive && <CheckCircle className="text-blue-500" size={20} />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">System Prompt</p>
          <p className="text-sm text-gray-700">{systemPrompt}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Top-K: {topK}</p>
        </div>
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onEdit({ id, title, description, systemPrompt, topK });
          }}
          className="transition-colors duration-300 rounded-lg bg-indigo-600 hover:shadow-lg hover:scale-105"
        >
          Edit
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssistantCard;
