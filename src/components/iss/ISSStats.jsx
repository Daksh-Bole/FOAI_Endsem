import React from 'react';
import { Navigation, Wind, MapPin, Users, RefreshCw, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, subValue, color, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5 flex flex-col gap-2 relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}/5 rounded-full blur-3xl group-hover:bg-${color}/10 transition-all`}></div>
    
    <div className="flex items-center justify-between relative z-10">
      <div className={`p-2.5 rounded-xl bg-space-800 border border-${color}/20 text-${color} shadow-lg shadow-${color}/5`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
        {trend && <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5"><Activity className="w-3 h-3" /> LIVE</span>}
      </div>
    </div>
    
    <div className="mt-3 relative z-10">
      <h3 className="text-2xl font-black text-slate-100 tracking-tight">{value}</h3>
      {subValue && <p className="text-xs text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">{subValue}</p>}
    </div>
  </motion.div>
);

const ISSStats = ({ lat, lng, speed, locationName, peopleCount, peopleList, allPositions, timestamp, onRefresh }) => {
  const lastUpdate = new Date(timestamp * 1000);

  return (
    <div className="space-y-6 mb-8">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Navigation} 
          label="Latitude / Longitude" 
          value={`${lat.toFixed(4)}°, ${lng.toFixed(4)}°`}
          subValue={<><Clock className="w-3.5 h-3.5" /> Synchronized {format(lastUpdate, 'HH:mm:ss')}</>}
          color="cyan-400"
          trend
        />
        <StatCard 
          icon={Wind} 
          label="ISS Speed" 
          value={`${speed.toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h`}
          subValue="Haversine Calculation"
          color="cyan-400"
          trend
        />
        <StatCard 
          icon={MapPin} 
          label="Location Name" 
          value={locationName}
          subValue="Reverse Geocoded"
          color="cyan-400"
        />
        <StatCard 
          icon={Activity} 
          label="Tracked Positions" 
          value={allPositions.length}
          subValue="Stored Data Points"
          color="cyan-400"
        />
      </div>

      {/* Step 6 - Astronauts Section */}
      <div className="glass-card p-6 border-l-4 border-cyan-400">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-400/20 shadow-cyan-400/10">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">People in Space ({peopleCount})</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Live Personnel Telemetry</p>
            </div>
          </div>
          
          <button 
            onClick={onRefresh}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all shadow-xl group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Manual Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {peopleList && peopleList.length > 0 ? (
            peopleList.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl flex items-center justify-between group hover:border-cyan-400/30 transition-all"
              >
                <div>
                  <p className="font-bold text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{p.craft || 'ISS'}</p>
                </div>
                <div className="w-2 h-2 bg-cyan-400/20 rounded-full"></div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-4 text-center text-slate-500 text-sm font-medium italic">
              Synchronizing astronaut manifest...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ISSStats;
