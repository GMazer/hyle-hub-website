import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { SiteConfig, SocialLink } from '../../../packages/shared/types';
import { Save, Plus, Trash2 } from 'lucide-react';
import { DynamicIcon, IconMap } from '../components/ui/Icons';

const Dashboard: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([adminApi.getConfig(), adminApi.getSocials()])
      .then(([c, s]) => {
        setConfig(c || { siteName: 'HyleHub', notices: [], contactInfo: {}, tagline: '' } as SiteConfig);
        setSocials(s);
      });
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return;
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleNoticeChange = (idx: number, val: string) => {
    if (!config) return;
    const newNotices = [...config.notices];
    newNotices[idx] = val;
    setConfig({ ...config, notices: newNotices });
  };

  const addNotice = () => {
    if (!config) return;
    setConfig({ ...config, notices: [...config.notices, 'Thông báo mới'] });
  };

  const removeNotice = (idx: number) => {
    if (!config) return;
    setConfig({ ...config, notices: config.notices.filter((_, i) => i !== idx) });
  };

  const handleSocialChange = (id: string, field: keyof SocialLink, val: any) => {
    setSocials(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const addSocial = () => {
    setSocials([...socials, {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'New Link',
      url: '#',
      iconName: 'Globe',
      order: socials.length + 1
    }]);
  };

  const removeSocial = (id: string) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await Promise.all([adminApi.updateConfig(config), adminApi.updateSocials(socials)]);
      alert('Đã lưu cấu hình thành công!');
    } catch (e) {
      alert('Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <div>Đang tải...</div>;

  const inputClass = "w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 cursor-text";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const cardClass = "bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800 transition-colors";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cấu hình trang</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50">
          <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cardClass}>
          <h2 className="text-lg font-semibold mb-4 border-b dark:border-gray-700 pb-2 text-emerald-800 dark:text-emerald-400">Thông tin chung</h2>
          <div className="space-y-4">
            <div><label className={labelClass}>Tên website</label><input type="text" name="siteName" value={config.siteName} onChange={handleConfigChange} className={inputClass} /></div>
            <div><label className={labelClass}>Tagline</label><input type="text" name="tagline" value={config.tagline} onChange={handleConfigChange} className={inputClass} /></div>
            <div><label className={labelClass}>Logo URL</label><input type="text" name="logoUrl" value={config.logoUrl || ''} onChange={handleConfigChange} className={inputClass} /></div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
            <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400">Thông báo</h2>
            <button onClick={addNotice} className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">+ Thêm dòng</button>
          </div>
          <div className="space-y-2">
            {config.notices.map((notice, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={notice} onChange={(e) => handleNoticeChange(idx, e.target.value)} className={`${inputClass} mt-0 flex-1`} />
                <button onClick={() => removeNotice(idx)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
            <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400">Mạng xã hội</h2>
            <button onClick={addSocial} className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><Plus size={16}/> Thêm Link</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socials.map(social => (
              <div key={social.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex flex-col gap-3">
                <div className="flex justify-between">
                   <select value={social.iconName} onChange={(e) => handleSocialChange(social.id, 'iconName', e.target.value)} className="p-1 border rounded text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                     {Object.keys(IconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                   </select>
                   <button onClick={() => removeSocial(social.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                </div>
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-700 dark:text-gray-200"><DynamicIcon name={social.iconName} /></div>
                   <input type="text" value={social.platform} onChange={(e) => handleSocialChange(social.id, 'platform', e.target.value)} className="flex-1 p-1 border rounded font-medium bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-text" />
                </div>
                <input type="text" value={social.url} onChange={(e) => handleSocialChange(social.id, 'url', e.target.value)} className="w-full p-1 border rounded text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 cursor-text" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;