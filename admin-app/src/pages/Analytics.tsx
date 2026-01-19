
import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { AnalyticsReport } from '../types';
import { Users, Eye, BarChart2, Calendar, MousePointer2, Smartphone, Monitor, Globe } from 'lucide-react';

const Analytics: React.FC = () => {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDetailedAnalytics();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Simple User Agent Parser
  const parseDevice = (ua: string) => {
    const lowerUA = ua.toLowerCase();
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';
    let icon = <Globe size={16} className="text-gray-400" />;

    // OS Detection
    if (lowerUA.includes('iphone')) { os = 'iPhone (iOS)'; icon = <Smartphone size={16} className="text-gray-600 dark:text-gray-300" />; }
    else if (lowerUA.includes('ipad')) { os = 'iPad (iOS)'; icon = <Smartphone size={16} className="text-gray-600 dark:text-gray-300" />; }
    else if (lowerUA.includes('android')) { os = 'Android'; icon = <Smartphone size={16} className="text-green-600 dark:text-green-400" />; }
    else if (lowerUA.includes('windows')) { os = 'Windows PC'; icon = <Monitor size={16} className="text-blue-600 dark:text-blue-400" />; }
    else if (lowerUA.includes('macintosh') || lowerUA.includes('mac os')) { os = 'Mac OS'; icon = <Monitor size={16} className="text-gray-800 dark:text-gray-200" />; }
    else if (lowerUA.includes('linux')) { os = 'Linux'; icon = <Monitor size={16} className="text-yellow-600 dark:text-yellow-400" />; }

    // Browser Detection (Basic)
    if (lowerUA.includes('chrome')) browser = 'Chrome';
    else if (lowerUA.includes('firefox')) browser = 'Firefox';
    else if (lowerUA.includes('safari')) browser = 'Safari';
    else if (lowerUA.includes('edge')) browser = 'Edge';
    else if (lowerUA.includes('crios')) browser = 'Chrome iOS';

    return { os, browser, icon };
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu thống kê...</div>;
  if (!report) return <div className="p-8 text-center text-red-500">Không thể tải báo cáo.</div>;

  const { stats, topProducts, visitorHistory, recentVisitors } = report;

  const maxViews = topProducts.length > 0 ? Math.max(...topProducts.map(p => p.views || 0)) : 1;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Báo cáo Thống kê</h1>
         <span className="text-sm text-gray-500 dark:text-gray-400">Cập nhật lúc: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-600"><Eye size={20}/></div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hôm nay</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayViews}</div>
          <div className="text-xs text-emerald-500 font-medium">Lượt truy cập</div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600"><Users size={20}/></div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Người dùng (Hôm nay)</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayUnique}</div>
          <div className="text-xs text-blue-500 font-medium">IP duy nhất</div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600"><BarChart2 size={20}/></div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng Views</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat('vi-VN').format(stats.totalViews)}</div>
          <div className="text-xs text-purple-500 font-medium">Toàn thời gian</div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-600"><Users size={20}/></div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng Users</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat('vi-VN').format(stats.totalUniqueIps)}</div>
          <div className="text-xs text-amber-500 font-medium">IP duy nhất (All time)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Products Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800 overflow-hidden">
           <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <MousePointer2 size={18} /> Top Sản Phẩm Được Quan Tâm
              </h2>
              <p className="text-xs text-gray-500 mt-1">Dựa trên số lượt click xem chi tiết</p>
           </div>
           <div className="p-6 space-y-5">
              {topProducts.length === 0 ? <p className="text-center text-gray-500">Chưa có dữ liệu.</p> : topProducts.map((product, idx) => (
                <div key={product.id || idx}>
                   <div className="flex justify-between items-center mb-1 text-sm">
                      <div className="flex items-center gap-2">
                         <span className="font-mono text-gray-400 w-4">#{idx + 1}</span>
                         <img src={product.thumbnailUrl} className="w-6 h-6 rounded object-cover bg-gray-200" alt=""/>
                         <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{product.views} lượt xem</span>
                   </div>
                   <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                      <div 
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max((product.views || 0) / maxViews * 100, 5)}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Visitor History Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800 overflow-hidden">
           <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <Calendar size={18} /> Lịch Sử Truy Cập (7 ngày)
              </h2>
           </div>
           <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
                 <tr>
                    <th className="px-6 py-3 font-semibold">Ngày</th>
                    <th className="px-6 py-3 font-semibold text-right">Lượt xem (Hits)</th>
                    <th className="px-6 py-3 font-semibold text-right">Người dùng (Unique IP)</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                 {visitorHistory.length === 0 ? <tr><td colSpan={3} className="p-6 text-center text-gray-500">Chưa có dữ liệu.</td></tr> : visitorHistory.map((log, idx) => (
                   <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-sm text-gray-700 dark:text-gray-300">
                      <td className="px-6 py-4 font-medium">{log.date}</td>
                      <td className="px-6 py-4 text-right">{log.hits}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{log.unique}</td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

      </div>

      {/* --- DETAILED VISITOR LOG --- */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800 overflow-hidden">
         <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <Users size={18} /> Nhật Ký Truy Cập Chi Tiết (50 lượt gần nhất)
            </h2>
            <p className="text-xs text-gray-500 mt-1">Hiển thị IP và thông tin thiết bị của khách hàng.</p>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase">
                 <tr>
                    <th className="px-6 py-3 font-semibold">Thời gian</th>
                    <th className="px-6 py-3 font-semibold">Địa chỉ IP</th>
                    <th className="px-6 py-3 font-semibold">Thiết bị / OS</th>
                    <th className="px-6 py-3 font-semibold text-right">Số lần xem</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                 {(!recentVisitors || recentVisitors.length === 0) ? (
                    <tr><td colSpan={4} className="p-6 text-center text-gray-500">Chưa có dữ liệu chi tiết.</td></tr>
                 ) : (
                    recentVisitors.map((visitor, idx) => {
                       const { os, browser, icon } = parseDevice(visitor.userAgent);
                       const timeString = new Date(visitor.lastSeen).toLocaleString('vi-VN');
                       return (
                         <tr key={visitor._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-sm text-gray-700 dark:text-gray-300">
                            <td className="px-6 py-4 text-gray-500 text-xs">{timeString}</td>
                            <td className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400">{visitor.ip}</td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  {icon}
                                  <div>
                                     <div className="font-medium">{os}</div>
                                     <div className="text-xs text-gray-400">{browser}</div>
                                  </div>
                               </div>
                               {/* Hover to see full UA if needed */}
                               <div className="hidden group-hover:block absolute bg-black text-white p-2 rounded text-xs z-10">{visitor.userAgent}</div>
                            </td>
                            <td className="px-6 py-4 text-right">{visitor.hits}</td>
                         </tr>
                       );
                    })
                 )}
              </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
