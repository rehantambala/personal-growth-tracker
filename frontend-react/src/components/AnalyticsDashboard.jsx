import React, { useState, useEffect } from "react";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import "../styles/analytics.css";
import { computeTrends } from "../utils/trendAnalysis";


export default function AnalyticsDashboard({ entries }) {

  const [stats, setStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!entries || entries.length === 0) return;

    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);

    // Calculate statistics
    const totalEntries = entries.length;

    // Mood distribution
    const moodCount = { happy: 0, good: 0, neutral: 0, sad: 0 };
    entries.forEach(e => {
      if (e.mood && moodCount[e.mood] !== undefined) {
        moodCount[e.mood]++;
      }
    });

    const moodDistribution = Object.entries(moodCount)
      .map(([mood, count]) => ({ name: mood, value: count }))
      .filter(m => m.value > 0);

    // Emotion tones (awareness data)
    const toneCount = {};
    entries.forEach(e => {
      if (e.emotionTone) {
        toneCount[e.emotionTone] = (toneCount[e.emotionTone] || 0) + 1;
      }
    });

    // Cognitive lenses
    const lensCount = {};
    entries.forEach(e => {
      if (e.cognitiveLens) {
        lensCount[e.cognitiveLens] = (lensCount[e.cognitiveLens] || 0) + 1;
      }
    });
    const cognitiveLenses = Object.entries(lensCount)
      .map(([lens, count]) => ({ name: lens, value: count }))
      .sort((a, b) => b.value - a.value);

    // Life contexts
    const contextCount = {};
    entries.forEach(e => {
      if (e.lifeContext) {
        contextCount[e.lifeContext] = (contextCount[e.lifeContext] || 0) + 1;
      }
    });
    const lifeContexts = Object.entries(contextCount)
      .map(([context, count]) => ({ name: context, value: count }))
      .sort((a, b) => b.value - a.value);

    // Activity over last 7 days
    const now = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const count = entries.filter(e => {
        const entryDate = new Date(e.createdAt);
        return entryDate.toDateString() === date.toDateString();
      }).length;

      last7Days.push({ date: dateStr, count });
    }

    const entriesWithAwareness = entries.filter(
      e => e.emotionTone || e.cognitiveLens || e.lifeContext
    ).length;

    setStats({
      totalEntries,
      entriesWithAwareness,
      moodDistribution,
      cognitiveLenses,
      lifeContexts,
      activity: last7Days,
      topLens: cognitiveLenses[0]?.name || "—",
      topContext: lifeContexts[0]?.name || "—"
    });

  }, [entries]);

  if (!stats) return null;

  // Color schemes
  const MOOD_COLORS = {
    happy: "#6bff9c",
    good: "#9affc7",
    neutral: "#b8b8b8",
    sad: "#ff8b8b"
  };

  const GRADIENT_COLORS = {
    lens: ["#6bff9c", "#4ee88b"],
    context: ["#ffd96b", "#ffb84d"],
    activity: "#9affc7"
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name || payload[0].payload.name}</p>
          <p className="tooltip-value">{payload[0].value} reflections</p>
        </div>
      );
    }
    return null;
  };

  const trends = computeTrends(entries);


  return (
    <div className={`analytics-dashboard-wrapper ${isVisible ? 'visible' : ''}`}>
      
      {/* Animated background elements */}
      <div className="analytics-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="analytics-content">

        {/* Header */}
        <div className="analytics-header-section">
          <div className="header-glow"></div>
          <h2 className="analytics-title">Your Reflection Insights</h2>
          <p className="analytics-subtitle">Understanding your inner patterns</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          
          <div className="stat-card-modern card-delay-1">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalEntries}</div>
              <div className="stat-label">Total Reflections</div>
            </div>
            <div className="stat-glow"></div>
          </div>

          <div className="stat-card-modern card-delay-2">
            <div className="stat-icon">✨</div>
            <div className="stat-content">
              <div className="stat-number">{stats.entriesWithAwareness}</div>
              <div className="stat-label">With Awareness</div>
            </div>
            <div className="stat-glow"></div>
          </div>

          <div className="stat-card-modern card-delay-3">
            <div className="stat-icon">🧠</div>
            <div className="stat-content">
              <div className="stat-number">{stats.topLens}</div>
              <div className="stat-label">Top Cognitive Lens</div>
            </div>
            <div className="stat-glow"></div>
          </div>

          <div className="stat-card-modern card-delay-4">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <div className="stat-number">{stats.topContext}</div>
              <div className="stat-label">Main Life Context</div>
            </div>
            <div className="stat-glow"></div>
          </div>

        </div>
        {!trends.empty && (
  <div className="trend-insights-grid">

    <div className="trend-card">
      📈 <strong>{trends.reflectionsLastWeek}</strong> reflections this week
    </div>

    <div className="trend-card">
      ✨ <strong>{trends.withAwareness}</strong> written with awareness
    </div>

    <div className="trend-card">
      💫 Most frequent mood: <strong>{trends.mostUsedMood}</strong>
    </div>

    <div className="trend-card">
      🌿 Dominant life context: <strong>{trends.dominantContext}</strong>
    </div>

  </div>
)}


        {/* Charts Grid */}
        <div className="charts-container">

          {/* Mood Distribution - Donut Chart */}
          <div className="chart-card-modern chart-delay-1">
            <div className="chart-header">
              <h3>Mood Distribution</h3>
              <div className="chart-accent"></div>
            </div>
            <div className="chart-body">
              {stats.moodDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.moodDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stats.moodDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={MOOD_COLORS[entry.name]}
                          style={{ filter: 'drop-shadow(0 0 8px rgba(107, 255, 156, 0.3))' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <p>No mood data yet</p>
                </div>
              )}
            </div>
            <div className="card-glow-green"></div>
          </div>

          {/* Activity Timeline */}
          <div className="chart-card-modern chart-delay-2">
            <div className="chart-header">
              <h3>Last 7 Days Activity</h3>
              <div className="chart-accent"></div>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={stats.activity}>
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.3)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={GRADIENT_COLORS.activity}
                    strokeWidth={3}
                    dot={{ 
                      fill: GRADIENT_COLORS.activity, 
                      r: 5,
                      strokeWidth: 2,
                      stroke: '#1a1a1a'
                    }}
                    activeDot={{ r: 7 }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(154, 255, 199, 0.5))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card-glow-green"></div>
          </div>

          {/* Cognitive Lenses */}
          <div className="chart-card-modern chart-delay-3">
            <div className="chart-header">
              <h3>Cognitive Lenses</h3>
              <div className="chart-accent"></div>
            </div>
            <div className="chart-body">
              {stats.cognitiveLenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.cognitiveLenses}>
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.3)"
                      angle={-20}
                      textAnchor="end"
                      height={80}
                      style={{ fontSize: '11px' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="url(#lensGradient)"
                      radius={[8, 8, 0, 0]}
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(107, 255, 156, 0.3))' }}
                    />
                    <defs>
                      <linearGradient id="lensGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GRADIENT_COLORS.lens[0]} stopOpacity={1}/>
                        <stop offset="100%" stopColor={GRADIENT_COLORS.lens[1]} stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🧠</div>
                  <p>No cognitive lens data yet</p>
                </div>
              )}
            </div>
            <div className="card-glow-green"></div>
          </div>

          {/* Life Contexts */}
          <div className="chart-card-modern chart-delay-4">
            <div className="chart-header">
              <h3>Life Contexts</h3>
              <div className="chart-accent"></div>
            </div>
            <div className="chart-body">
              {stats.lifeContexts.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.lifeContexts}>
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.3)"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="url(#contextGradient)"
                      radius={[8, 8, 0, 0]}
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(255, 217, 107, 0.3))' }}
                    />
                    <defs>
                      <linearGradient id="contextGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GRADIENT_COLORS.context[0]} stopOpacity={1}/>
                        <stop offset="100%" stopColor={GRADIENT_COLORS.context[1]} stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🌱</div>
                  <p>No life context data yet</p>
                </div>
              )}
            </div>
            <div className="card-glow-yellow"></div>
          </div>

        </div>

      </div>
    </div>
  );
}