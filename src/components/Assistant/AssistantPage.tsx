import React, { useState } from "react";
import { Assistant } from "./types";
import AssistantCard from "./AssistantCard";
import EditAssistantForm from "./EditAssistantForm";

const AssistantPage: React.FC = () => {
  const [assistants, setAssistants] = useState([
    {
      id: 1,
      title: "General Assistant",
      description: "A general-purpose assistant",
      systemPrompt: "You are a helpful assistant.",
      topK: 5,
    },
    {
      id: 2,
      title: "CE Assistant",
      description: "Specialized in DSM documents",
      systemPrompt: "You are an expert in DSM documents.",
      topK: 10,
    },
    {
      id: 3,
      title: "PEI Assistant",
      description: "Specialized in DSM documents",
      systemPrompt: "You are an expert in DSM documents.",
      topK: 10,
    },
    {
      id: 4,
      title: "TD Assistant",
      description: "Specialized in DSM documents",
      systemPrompt: "You are an expert in DSM documents.",
      topK: 10,
    },
    {
      id: 5,
      title: "IPDS Assistant",
      description: "Specialized in DSM documents",
      systemPrompt: "You are an expert in DSM documents.",
      topK: 10,
    },
    {
      id: 6,
      title: "TPES Assistant",
      description: "Specialized in DSM documents",
      systemPrompt: "You are an expert in DSM documents.",
      topK: 10,
    },
  ]);
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
    null
  );
  const [activeAssistant, setActiveAssistant] = useState<Assistant | null>(
    null
  );

  const handleEdit = (assistant: Assistant) => {
    setEditingAssistant(assistant);
  };

  const handleSave = (editedAssistant: Assistant) => {
    setAssistants(
      assistants.map((a) => (a.id === editedAssistant.id ? editedAssistant : a))
    );
    setEditingAssistant(null);
  };

  const handleCancel = () => {
    setEditingAssistant(null);
  };

  const handleApply = (assistant: Assistant) => {
    setActiveAssistant(assistant);
    console.log(`Applying Assistant: ${assistant.title}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assistants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assistants.map((assistant) => (
          <AssistantCard
            key={assistant.id}
            {...assistant}
            onEdit={handleEdit}
            onApply={handleApply}
            isActive={activeAssistant?.id === assistant.id}
          />
        ))}
      </div>
      {editingAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <EditAssistantForm
            assistant={editingAssistant}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default AssistantPage;
