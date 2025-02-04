import React, { useState, useEffect } from 'react';
import '../../globals.css'

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'reminders' | 'settings'>('quotes');
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [quoteCategory, setQuoteCategory] = useState<string>('motivational');
  const [reminders, setReminders] = useState<Array<{ id: string; text: string }>>([]);
  const [newReminder, setNewReminder] = useState<string>('');
  const [settings, setSettings] = useState({
    darkMode: true,
    widgetFrequency: 'Medium'
  });

  // Quote collections
  const quotes = {
    motivational: [
      "Small steps lead to massive changes.",
      "Your only limit is your mind.",
      "Make it happen, shock everyone."
    ],
    productivity: [
      "Done is better than perfect.",
      "Focus on progress, not perfection.",
      "Time is your most valuable asset."
    ],
    personal: [
      "Be proud of how far you've come.",
      "Trust your journey.",
      "You are stronger than you know."
    ]
  };

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      // Chrome storage API to get saved data
      if (chrome?.storage?.local) {
        const data = await chrome.storage.local.get([
          'reminders',
          'settings',
          'lastQuote'
        ]);

        if (data.reminders) setReminders(data.reminders);
        if (data.settings) setSettings(data.settings);
        if (data.lastQuote) setCurrentQuote(data.lastQuote);
        else generateNewQuote('motivational');
      }
    };

    loadSavedData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (chrome?.storage?.local) {
      chrome.storage.local.set({
        reminders,
        settings,
        lastQuote: currentQuote
      });
    }
  }, [reminders, settings, currentQuote]);

  // Quote handling
  const generateNewQuote = (category: string) => {
    const categoryQuotes = quotes[category as keyof typeof quotes];
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    setCurrentQuote(categoryQuotes[randomIndex]);
    setQuoteCategory(category);
  };

  // Reminder handling
  const addReminder = (text: string) => {
    if (text.trim()) {
      const newReminderItem = {
        id: Date.now().toString(),
        text: text.trim()
      };
      setReminders(prev => [...prev, newReminderItem]);
      setNewReminder('');
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  // Settings handling
  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  const updateWidgetFrequency = (frequency: string) => {
    setSettings(prev => ({
      ...prev,
      widgetFrequency: frequency
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'quotes':
        return (
          <div className="grid gap-4">
            <div className="bg-indigo-900 p-4 rounded-lg shadow-lg">
              <p className="text-sky-300 italic">{currentQuote}</p>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => generateNewQuote(quoteCategory)}
                  className="bg-flame-orange text-white px-3 py-1 rounded-full hover:bg-opacity-80 transition"
                >
                  New Quote
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => generateNewQuote('motivational')}
                className="bg-sunny-yellow text-indigo-900 p-2 rounded-lg hover:opacity-80 transition"
              >
                Motivational
              </button>
              <button
                onClick={() => generateNewQuote('productivity')}
                className="bg-sky-blue text-white p-2 rounded-lg hover:opacity-80 transition"
              >
                Productivity
              </button>
              <button
                onClick={() => generateNewQuote('personal')}
                className="bg-flame-orange text-white p-2 rounded-lg hover:opacity-80 transition"
              >
                Personal
              </button>
            </div>
          </div>
        );
      case 'reminders':
        return (
          <div className="grid gap-4">
            <div className="bg-indigo-900 p-4 rounded-lg shadow-lg">
              <input
                type="text"
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addReminder(newReminder)}
                placeholder="Add a new reminder"
                className="w-full bg-indigo-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />
              <div className="mt-4 space-y-2">
                {reminders.map(reminder => (
                  <div key={reminder.id} className="flex items-center justify-between bg-indigo-800 p-2 rounded-lg">
                    <span className="text-sky-300">{reminder.text}</span>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-flame-orange hover:text-opacity-80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="grid gap-4">
            <div className="bg-indigo-900 p-4 rounded-lg shadow-lg">
              <h3 className="text-sky-300 font-bold mb-4">Preferences</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Dark Mode</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="hidden peer"
                      id="darkModeToggle"
                      checked={settings.darkMode}
                      onChange={toggleDarkMode}
                    />
                    <label
                      htmlFor="darkModeToggle"
                      className="w-12 h-6 bg-indigo-800 rounded-full peer-checked:bg-sky-blue relative inline-block cursor-pointer
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:w-5 after:h-5 after:rounded-full
                      after:transition-all peer-checked:after:translate-x-6"
                    ></label>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Widget Frequency</span>
                  <select
                    className="bg-indigo-800 text-white rounded-lg p-1"
                    value={settings.widgetFrequency}
                    onChange={(e) => updateWidgetFrequency(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-dark-indigo text-white p-6 rounded-xl shadow-2xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-blue">AdFriend</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`p-2 rounded-full ${activeTab === 'quotes' ? 'bg-flame-orange text-white' : 'text-gray-400 hover:bg-indigo-800'}`}
          >
            💬
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`p-2 rounded-full ${activeTab === 'reminders' ? 'bg-flame-orange text-white' : 'text-gray-400 hover:bg-indigo-800'}`}
          >
            ✅
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-full ${activeTab === 'settings' ? 'bg-flame-orange text-white' : 'text-gray-400 hover:bg-indigo-800'}`}
          >
            ⚙️
          </button>
        </div>
      </header>

      {renderContent()}
    </div>
  );
};

export default Popup;