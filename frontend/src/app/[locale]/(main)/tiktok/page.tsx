'use client';

export const runtime = 'edge';

import { Input, message, Spin } from 'antd';
import { useTranslations } from 'next-intl';

import { tiktokDownloadApi } from '@/apis/tiktok.api';
import IconTiktok from '@/assets/icons/shared/IconTiktok.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { useTiktokStore } from '@/stores/tiktok.store';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const TiktokPage: React.FC = () => {
  const t = useTranslations();
  const { error, isDownloading, result, setError, setIsDownloading, setResult, setUrl, url } =
    useTiktokStore();

  const handleDownload = async () => {
    if (!url.trim() || !url.includes('tiktok.com')) {
      message.error(t('tiktok.invalidUrl'));
      return;
    }

    setError(null);
    setResult(null);
    setIsDownloading(true);

    try {
      const response = await tiktokDownloadApi({ url });
      setResult(response.data);
    } catch (_err) {
      setError(t('tiktok.error'));
      message.error(t('tiktok.error'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <IconTiktok className="w-8 h-8 text-pink-400" />
          {t('tiktok.title')}
        </h1>
        <p className="text-slate-400 mb-8">{t('tiktok.description')}</p>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <Input
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-xl"
              disabled={isDownloading}
              onChange={(e) => setUrl(e.target.value)}
              onPressEnter={handleDownload}
              placeholder={t('tiktok.urlPlaceholder')}
              size="large"
              value={url}
            />
            <BaseButton
              customColor="primary"
              disabled={isDownloading || !url.trim()}
              loading={isDownloading}
              onClick={handleDownload}
              size="large"
            >
              {isDownloading ? t('tiktok.downloading') : t('tiktok.download')}
            </BaseButton>
          </div>
        </div>

        {isDownloading && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4">
            <Spin size="large" />
            <p className="text-slate-400">{t('tiktok.downloading')}</p>
          </div>
        )}

        {!isDownloading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!isDownloading && result && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">{t('tiktok.preview')}</h2>

            <div className="space-y-1 text-slate-300 text-sm">
              <p>{t('tiktok.videoTitle', { title: result.title })}</p>
              <p>{t('tiktok.duration', { seconds: result.duration })}</p>
            </div>

            <video
              className="w-full max-h-[400px] rounded-xl border border-white/10 bg-black object-contain"
              controls
              src={`${BASE_URL}/api/tiktok/files/${result.filename}`}
            />

            <a
              className="block w-full text-center"
              download={result.filename}
              href={`${BASE_URL}/api/tiktok/files/${result.filename}`}
              rel="noreferrer"
              target="_blank"
            >
              <BaseButton className="w-full" customColor="primary" size="large">
                {t('tiktok.downloadFile')}
              </BaseButton>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiktokPage;
