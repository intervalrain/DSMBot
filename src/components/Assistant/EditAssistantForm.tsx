import React, { useState } from "react";
import { Assistant } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { NumberInput } from "../ui/number-input";

interface EditAssistantFormProps {
  assistant: Assistant;
  onSave: (editedAssistant: Assistant) => void;
  onCancel: () => void;
}

const EditAssistantForm: React.FC<EditAssistantFormProps> = ({
  assistant,
  onSave,
  onCancel,
}) => {
  const [editedAssistant, setEditedAssistant] = useState<Assistant>(assistant);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEditedAssistant({ ...editedAssistant, [e.target.name]: e.target.value });
  };

  const handleTopKChange = (value: number) => {
    setEditedAssistant({ ...editedAssistant, topK: value });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Edit Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            onSave(editedAssistant);
          }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" name="title" value={editedAssistant.title} className="resize-none" onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" name="description" value={editedAssistant.description} className="resize-none" rows={5} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="systemPrompt" className="text-sm font-medium">System Prompt</label>
              <Textarea id="systemPrompt" name="systemPrompt" value={editedAssistant.systemPrompt} className="resize-none" rows={5} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="topK" className="text-sm font-medium">Top-K: {editedAssistant.topK}</label>
              <NumberInput
                value={editedAssistant.topK}
                onChange={handleTopKChange}
                min={1}
                max={100}
               />
              {/* <Slider
                id="topK"
                min={1}
                max={100}
                step={1}
                defaultValue={[editedAssistant.topK]}
                value={[editedAssistant.topK]}
                onValueChange={handleTopKChange}
                className={cn("w-[60%]")}
              /> */}
            </div>
            <div className="flex space-x-2">
              <Button className="bg-indigo-600 hover:shadow-lg hover:scale-105" type="submit">Save</Button>
              <Button className="hover:shoadow-lg hover:scale-105"variant="outline" onClick={onCancel}>Cancel</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditAssistantForm;
