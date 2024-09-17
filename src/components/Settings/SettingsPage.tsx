import React from "react";
import { useAppContext } from "../../AppContext";
import { Card } from "../ui/card";

const SettingsPage: React.FC = () => {
  const { settings, setSettings, hasChanges, setHasChanges, saveSettings } =
    useAppContext();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    if (value <= 0) {
      setSettings({ ...settings, [key]: 0 });
    } else if (value >= 365) {
      setSettings({ ...settings, [key]: 365 });
    } else {
      setSettings({ ...settings, [key]: value });
    }
    
    setHasChanges(true);
  };

  const handleSave = () => {
    saveSettings();
    setHasChanges(false);
  };

  const models: string[] = [
    "gpt-3.5-turbo", 
    "gpt-4o-for-text"
  ];

  const languages: string[] = [
    "System",
    "English",
    "中文"
  ];

  const themes: string[] = [
    "System",
    "Light",
    "Dark"
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card
        className={`w-full max-w-sm transition-all duration-300 rounded-l
      hover:bg-gray-50 dark:hover:bg-gray-800`}
      >
        <div className="h-full overflow-y-auto bg-gray-900 text-gray-100 p-4">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">
                Temperature: {settings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) =>
                  handleSettingChange("temperature", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2">Model</label>
              <select
                value={settings.model}
                onChange={(e) => handleSettingChange("model", e.target.value)}
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
              >
                {models.map((model) => <option value={model}>{model}</option>)};
              </select>
            </div>

            <div>
              <label className="block mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) =>
                  handleSettingChange("language", e.target.value)
                }
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
              >
                {languages.map((language) => <option value={language}>{language}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-2">Keep History (days)</label>
              <input
                type="number"
                value={settings.historyDays}
                min={0}
                max={365}
                onChange={(e) =>
                  handleSettingChange("historyDays", parseInt(e.target.value))
                }
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
              />
            </div>

            <div>
              <label className="block mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange("theme", e.target.value)}
                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
              >
                {themes.map((theme) => <option value={theme}>{theme}</option>)};
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
