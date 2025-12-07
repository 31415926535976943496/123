import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  MapPin, 
  Globe, 
  Server, 
  RefreshCw,
  LogOut,
  Navigation
} from 'lucide-react';
import { GeoCoordinates } from './types';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Data State
  const [ip, setIp] = useState<string>("Loading...");
  const [coords, setCoords] = useState<GeoCoordinates | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>("Waiting for permission...");

  // 1. Fetch IP Address
  const fetchIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIp(data.ip);
    } catch (e) {
      setIp("Unknown / Hidden");
    }
  };

  // 2. Start GPS Tracking
  const startGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("Geolocation not supported");
      return;
    }

    setGpsStatus("Locating...");
    navigator.geolocation.watchPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
        setGpsStatus("Active");
      },
      (err) => {
        setGpsStatus(`Error: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // Allow any password for demo purposes, or check specifically
      if (password.length > 0) {
        setIsLoggedIn(true);
        fetchIp();
        startGps();
      } else {
        setError("Please enter administrator credentials.");
      }
      setLoading(false);
    }, 800);
  };

  // --- VIEW 1: LOGIN SCREEN (Blank page style) ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-center mb-6 text-blue-600">
            <div className="p-3 bg-blue-50 rounded-full">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">Admin Login</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Restricted Access</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter access key..."
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Unlock size={18} />}
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 2: ADMIN DASHBOARD (Data View) ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-1.5 rounded">
            <Server size={20} />
          </div>
          <h1 className="font-bold text-lg text-gray-800">{APP_NAME} <span className="text-xs font-normal text-gray-500 ml-2">v2.0.1</span></h1>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        
        {/* Connection Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Target Identity</h3>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                <Globe size={24} />
             </div>
             <div>
               <div className="text-sm text-gray-500">Public IP Address</div>
               <div className="text-2xl font-mono font-bold text-gray-900">{ip}</div>
             </div>
          </div>
        </div>

        {/* GPS Data Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <MapPin size={16} /> GPS Telemetry
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${
              gpsStatus === "Active" 
                ? "bg-green-100 text-green-700 border-green-200" 
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }`}>
              Status: {gpsStatus}
            </span>
          </div>
          
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Metric</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Latitude</td>
                  <td className="px-6 py-4 font-mono text-blue-600">
                    {coords ? coords.latitude.toFixed(7) : "--"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">Decimal Degrees</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Longitude</td>
                  <td className="px-6 py-4 font-mono text-blue-600">
                    {coords ? coords.longitude.toFixed(7) : "--"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">Decimal Degrees</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Accuracy</td>
                  <td className="px-6 py-4 font-mono">
                    {coords ? `± ${Math.round(coords.accuracy || 0)} meters` : "--"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">Signal Confidence</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Speed</td>
                  <td className="px-6 py-4 font-mono">
                    {coords?.speed ? `${(coords.speed * 3.6).toFixed(1)} km/h` : "0 km/h"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">Movement</td>
                </tr>
                 <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Map View</td>
                  <td className="px-6 py-4" colSpan={2}>
                    {coords ? (
                      <a 
                        href={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                      >
                        <Navigation size={14} /> Open in Google Maps
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Waiting for coordinates...</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 font-mono text-right">
             LAST UPDATE: {coords ? new Date(coords.timestamp).toLocaleTimeString() : "NEVER"}
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default App;
