// API Service Layer for CarbonShield Companion
// Designed to connect to a Python FastAPI backend (MongoDB + Supabase)
// Environment variable VITE_API_BASE_URL sets the backend endpoint.
// Isolated Demo Mode provides realistic simulation until the backend is connected.

import {
  INITIAL_USER,
  GRID_REGIONS,
  HOURLY_GRID_FORECAST,
  INITIAL_TASKS,
  GREEN_POINTS_HISTORY,
  REWARDS_CATALOG,
  COMPANY_ANALYTICS,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Check if app is in Demo Mode
export const getStoredDemoMode = () => {
  const stored = localStorage.getItem('cs_demo_mode');
  return stored !== null ? stored === 'true' : true; // Default to Demo Mode
};

export const setStoredDemoMode = (enabled) => {
  localStorage.setItem('cs_demo_mode', String(enabled));
};

export const getStoredApiBaseUrl = () => {
  return localStorage.getItem('cs_api_url') || API_BASE_URL;
};

export const setStoredApiBaseUrl = (url) => {
  localStorage.setItem('cs_api_url', url);
};

// Helper for realistic simulation delay in Demo Mode
const sleep = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

class ApiService {
  constructor() {
    this.demoMode = getStoredDemoMode();
    this.baseUrl = getStoredApiBaseUrl();
  }

  setDemoMode(enabled) {
    this.demoMode = enabled;
    setStoredDemoMode(enabled);
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    setStoredApiBaseUrl(url);
  }

  // Probe backend health to see if FastAPI is online
  async checkBackendHealth() {
    if (this.demoMode) {
      return {
        online: false,
        mode: 'demo',
        message: 'Running in isolated Demo Mode. Simulated measurements active.',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.baseUrl}/api/v1/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return { online: true, mode: 'live', ...data };
      }
      return { online: false, mode: 'error', status: res.status };
    } catch (err) {
      return {
        online: false,
        mode: 'offline',
        error: err.name === 'AbortError' ? 'Connection timed out' : 'Backend unreachable',
      };
    }
  }

  // Dashboard Overview Metrics
  async getDashboardMetrics() {
    if (this.demoMode) {
      await sleep(200);
      return {
        isSimulated: true,
        user: INITIAL_USER,
        stats: {
          greenPoints: 2450,
          tier: 'Eco Pioneer',
          nextTier: 'Carbon Guardian',
          pointsToNextTier: 550,
          tierProgressPercent: 81.6,
          carbonSavedKg: 14.2,
          carbonSavedG: 14200,
          carbonTrendPercent: 24.8,
          costSavedUsd: 148.6,
          costTrendPercent: 18.2,
          energySavedKwh: 412.5,
          treesEquivalent: 2.1,
          evKmEquivalent: 64.5,
          currentRegion: GRID_REGIONS[0],
          greenSchedulingRate: 88.5,
        },
      };
    }

    const res = await fetch(`${this.baseUrl}/api/v1/dashboard/metrics`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  }

  // Grid Status & Regional Telemetry
  async getGridRegions() {
    if (this.demoMode) {
      await sleep(150);
      return { isSimulated: true, regions: GRID_REGIONS };
    }
    const res = await fetch(`${this.baseUrl}/api/v1/grid/regions`);
    return await res.json();
  }

  async getGridForecast(regionId = 'eu-west-1') {
    if (this.demoMode) {
      await sleep(150);
      const region = GRID_REGIONS.find((r) => r.id === regionId) || GRID_REGIONS[0];
      return {
        isSimulated: true,
        region,
        forecast: HOURLY_GRID_FORECAST,
        cleanWindowSummary: {
          startsIn: region.nextWindowIn,
          windowRange: region.nextGreenWindow,
          peakCleanIntensity: 118,
          currentIntensity: region.currentIntensity,
        },
      };
    }
    const res = await fetch(`${this.baseUrl}/api/v1/grid/forecast?region=${regionId}`);
    return await res.json();
  }

  // Tasks Management
  async getTasks(filters = {}) {
    if (this.demoMode) {
      await sleep(200);
      return { isSimulated: true, tasks: INITIAL_TASKS };
    }
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${this.baseUrl}/api/v1/tasks?${query}`);
    return await res.json();
  }

  // Carbon-Aware AI Task Recommendation Engine
  async generateRecommendation(taskInput) {
    if (this.demoMode) {
      await sleep(750); // Simulate ML carbon optimization calculation
      const isUrgent = taskInput.priority === 'urgent';
      const isHighQuality = taskInput.quality === 'high';
      const region = GRID_REGIONS.find((r) => r.id === taskInput.region) || GRID_REGIONS[0];

      if (isUrgent) {
        return {
          isSimulated: true,
          schedulingDecision: 'immediate',
          executionTime: 'Immediate Execution (< 30 seconds)',
          reason: 'Urgent priority overrides deferred scheduling. Task will execute immediately to satisfy SLA.',
          modelRecommendation: isHighQuality ? 'Claude 3.5 Sonnet (Optimized Batching)' : 'Llama-3-8B-Instruct',
          targetRegion: region.name,
          metrics: {
            baselineEmissionsG: 840,
            optimizedEmissionsG: 710,
            carbonSavingsPercent: 15.5,
            carbonSavedG: 130,
            estimatedEnergyKwh: 1.8,
            estimatedCostUsd: 2.45,
            greenPointsAwarded: 20,
          },
          carbonIntensityAtRun: region.currentIntensity,
          explanation: `Since your task is marked Urgent, CarbonShield executes immediately on ${region.name}. Memory bandwidth optimizations save 15.5% energy, but deferral is bypassed to preserve zero latency SLA.`,
          greenWindowAvailable: false,
        };
      }

      // Flexible priority: Defer to cleanest window
      const bestWindowTime = region.nextGreenWindow.split(' - ')[0] || '02:30 AM';
      const baselineIntensity = Math.max(340, region.currentIntensity * 1.5);
      const cleanIntensity = Math.min(130, region.currentIntensity * 0.75);
      const savedG = Math.round((baselineIntensity - cleanIntensity) * 4.2);

      return {
        isSimulated: true,
        schedulingDecision: 'deferred',
        executionTime: `Tonight at ${bestWindowTime} (${region.nextWindowIn})`,
        reason: `Local grid intensity drops from ${region.currentIntensity} to ${cleanIntensity} gCO₂/kWh during the upcoming clean energy surge.`,
        modelRecommendation: isHighQuality
          ? 'Llama-3-70B-Instruct (INT8 Quantized)'
          : 'Llama-3-8B-Instruct (INT4 Quantized)',
        targetRegion: region.name,
        metrics: {
          baselineEmissionsG: Math.round(baselineIntensity * 4.2),
          optimizedEmissionsG: Math.round(cleanIntensity * 4.2),
          carbonSavingsPercent: Math.round(((baselineIntensity - cleanIntensity) / baselineIntensity) * 100),
          carbonSavedG: savedG,
          estimatedEnergyKwh: 2.6,
          estimatedCostUsd: 0.95,
          greenPointsAwarded: Math.min(190, Math.max(45, Math.round(savedG / 15))),
        },
        carbonIntensityAtRun: cleanIntensity,
        explanation: `By deferring execution by ${region.nextWindowIn}, your job runs when regional wind and solar generation is at maximum capacity in ${region.name}. Quantized memory footprint reduces GPU wattage by an additional 22%. Your deadline of ${taskInput.deadlineHours || 8}h remains fully respected.`,
        greenWindowAvailable: true,
      };
    }

    const res = await fetch(`${this.baseUrl}/api/v1/tasks/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskInput),
    });
    return await res.json();
  }

  // Submit and Schedule a Task
  async submitTask(taskPayload) {
    if (this.demoMode) {
      await sleep(350);
      const newTask = {
        id: `CS-${Math.floor(1000 + Math.random() * 9000)}`,
        name: taskPayload.name,
        category: taskPayload.category || 'LLM Batch Inference',
        priority: taskPayload.priority,
        quality: taskPayload.quality,
        model: taskPayload.model || 'Llama-3-8B-Instruct',
        region: taskPayload.region || 'eu-west-1',
        status: taskPayload.schedulingDecision === 'immediate' ? 'running' : 'scheduled',
        scheduledFor: taskPayload.executionTime,
        deadline: `Within ${taskPayload.deadlineHours || 8} hours`,
        submittedAt: 'Just now',
        energyKwh: taskPayload.metrics?.estimatedEnergyKwh || 2.4,
        carbonSavedG: taskPayload.metrics?.carbonSavedG || 850,
        costSavedUsd: taskPayload.metrics?.estimatedCostUsd || 1.2,
        pointsEarned: taskPayload.metrics?.greenPointsAwarded || 50,
        delayHours: taskPayload.delayHours || 4,
        rationale: taskPayload.explanation || 'Scheduled for optimal renewable energy window.',
      };
      return { isSimulated: true, success: true, task: newTask };
    }

    const res = await fetch(`${this.baseUrl}/api/v1/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskPayload),
    });
    return await res.json();
  }

  // Green Points & Rewards
  async getGreenPointsData() {
    if (this.demoMode) {
      await sleep(200);
      return {
        isSimulated: true,
        points: INITIAL_USER.points,
        tier: INITIAL_USER.tier,
        tierThreshold: INITIAL_USER.tierThreshold,
        history: GREEN_POINTS_HISTORY,
        catalog: REWARDS_CATALOG,
      };
    }
    const res = await fetch(`${this.baseUrl}/api/v1/points`);
    return await res.json();
  }

  async redeemReward(rewardId) {
    if (this.demoMode) {
      await sleep(400);
      const reward = REWARDS_CATALOG.find((r) => r.id === rewardId);
      return {
        isSimulated: true,
        success: true,
        redemptionCode: `CS-ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        reward,
        pointsDeducted: reward?.pointsCost || 500,
      };
    }
    const res = await fetch(`${this.baseUrl}/api/v1/points/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId }),
    });
    return await res.json();
  }

  // Company Analytics
  async getCompanyAnalytics() {
    if (this.demoMode) {
      await sleep(250);
      return { isSimulated: true, ...COMPANY_ANALYTICS };
    }
    const res = await fetch(`${this.baseUrl}/api/v1/analytics`);
    return await res.json();
  }
}

export const api = new ApiService();
