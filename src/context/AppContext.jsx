import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredDemoMode, setStoredDemoMode } from '../services/api';
import {
  INITIAL_USER,
  INITIAL_TASKS,
  GRID_REGIONS,
  GREEN_POINTS_HISTORY,
  REWARDS_CATALOG,
} from '../services/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [demoMode, setDemoModeState] = useState(getStoredDemoMode());
  const [user, setUser] = useState(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('cs_authenticated');
    return saved !== null ? saved === 'true' : true; // Default logged in for seamless demo
  });
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [points, setPoints] = useState(INITIAL_USER.points);
  const [pointsHistory, setPointsHistory] = useState(GREEN_POINTS_HISTORY);
  const [selectedRegionId, setSelectedRegionId] = useState('eu-west-1');
  const [toasts, setToasts] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ online: false, mode: 'demo' });

  const login = (email, password) => {
    setIsAuthenticated(true);
    localStorage.setItem('cs_authenticated', 'true');
    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
    }));
    addToast('Welcome to CarbonShield', `Signed in as ${user.name} (${user.role})`, 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('cs_authenticated', 'false');
    addToast('Logged out', 'You have been signed out safely.', 'info');
  };

  // Update demo mode
  const setDemoMode = (enabled) => {
    setDemoModeState(enabled);
    setStoredDemoMode(enabled);
    api.setDemoMode(enabled);
    addToast(
      enabled ? 'Demo Mode Enabled' : 'Live Mode Enabled',
      enabled
        ? 'Using simulated enterprise telemetry.'
        : 'Connecting to live orchestration layer.',
      enabled ? 'info' : 'warning'
    );
  };

  // Add toast notification
  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add new task
  const addTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    // Also award points
    if (newTask.pointsEarned) {
      setPoints((prev) => prev + newTask.pointsEarned);
      setPointsHistory((prev) => [
        {
          id: `pt-${Date.now()}`,
          title: `Scheduled Green Task: ${newTask.name}`,
          task: newTask.model,
          points: newTask.pointsEarned,
          type: 'earned',
          date: 'Just now',
          co2Saved: `${newTask.carbonSavedG.toLocaleString()} gCO₂e`,
        },
        ...prev,
      ]);
    }
    addToast('AI Task Scheduled!', `Queued for cleanest regional window: ${newTask.scheduledFor}`, 'success');
  };

  // Update task status (cancel, reschedule, run now)
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            scheduledFor: newStatus === 'running' ? 'Active Now' : t.scheduledFor,
          };
        }
        return t;
      })
    );
    addToast('Task Updated', `Task ${taskId} is now ${newStatus}.`, 'info');
  };

  // Redeem Reward
  const redeemReward = (reward) => {
    if (points < reward.pointsCost) {
      addToast('Insufficient Points', `You need ${reward.pointsCost} points to redeem this reward.`, 'error');
      return false;
    }
    setPoints((prev) => prev - reward.pointsCost);
    setPointsHistory((prev) => [
      {
        id: `pt-${Date.now()}`,
        title: `Redeemed: ${reward.name}`,
        task: reward.provider,
        points: -reward.pointsCost,
        type: 'redeemed',
        date: 'Just now',
        co2Saved: '-',
      },
      ...prev,
    ]);
    addToast('Reward Claimed! 🎁', `Successfully redeemed ${reward.name}.`, 'success');
    return true;
  };

  const currentRegion = GRID_REGIONS.find((r) => r.id === selectedRegionId) || GRID_REGIONS[0];

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        demoMode,
        setDemoMode,
        user,
        setUser,
        tasks,
        addTask,
        updateTaskStatus,
        points,
        pointsHistory,
        redeemReward,
        selectedRegionId,
        setSelectedRegionId,
        currentRegion,
        gridRegions: GRID_REGIONS,
        toasts,
        addToast,
        removeToast,
        backendStatus,
        setBackendStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
