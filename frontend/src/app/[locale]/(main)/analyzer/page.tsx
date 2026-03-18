'use client';

export const runtime = 'edge';

import type { RcFile } from 'antd/es/upload';

import { message, Spin, Upload } from 'antd';
import { useTranslations } from 'next-intl';

import { analyzerUploadApi } from '@/apis/analyzer.api';
import IconAnalyzer from '@/assets/icons/shared/IconAnalyzer.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { useAnalyzerStore } from '@/stores/analyzer.store';

const MAX_FILE_SIZE_MB = 100;
const BULLET = '\u2022';
const ARROW = '\u2192';

const AnalyzerPage: React.FC = () => {
  const t = useTranslations();
  const { error, file, isAnalyzing, reset, result, setError, setFile, setIsAnalyzing, setResult } =
    useAnalyzerStore();

  const handleAnalyze = async () => {
    if (!file) {
      message.error(t('analyzer.invalidFile'));
      return;
    }

    setError(null);
    setResult(null);
    setIsAnalyzing(true);

    try {
      const data = await analyzerUploadApi(file);
      setResult(data);
      message.success(t('analyzer.notionCreated'));
    } catch (_err) {
      setError(t('analyzer.error'));
      message.error(t('analyzer.error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const beforeUpload = (uploadFile: RcFile) => {
    const isMP4 = uploadFile.type === 'video/mp4';
    const fileSizeMB = uploadFile.size / 1024 / 1024;
    const isUnderLimit = fileSizeMB <= MAX_FILE_SIZE_MB;

    if (!isMP4 || !isUnderLimit) {
      message.error(t('analyzer.invalidFile'));
      return Upload.LIST_IGNORE;
    }

    setFile(uploadFile as File);
    return false;
  };

  const handleRemove = () => {
    setFile(null);
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <IconAnalyzer className="w-8 h-8 text-violet-400" />
          {t('analyzer.title')}
        </h1>
        <p className="text-slate-400 mb-8">{t('analyzer.description')}</p>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <Upload.Dragger
            accept="video/mp4"
            beforeUpload={beforeUpload}
            className="!bg-white/5 !border-white/20 !rounded-xl"
            disabled={isAnalyzing}
            maxCount={1}
            onRemove={handleRemove}
          >
            <p className="text-slate-300 text-sm font-medium">{t('analyzer.uploadLabel')}</p>
            <p className="text-slate-500 text-xs mt-1">{t('analyzer.uploadHint')}</p>
          </Upload.Dragger>

          <BaseButton
            className="w-full"
            customColor="primary"
            disabled={!file || isAnalyzing}
            loading={isAnalyzing}
            onClick={handleAnalyze}
            size="large"
          >
            {isAnalyzing ? t('analyzer.analyzing') : t('analyzer.analyze')}
          </BaseButton>
        </div>

        {isAnalyzing && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4">
            <Spin size="large" />
            <p className="text-slate-400">{t('analyzer.analyzing')}</p>
          </div>
        )}

        {!isAnalyzing && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!isAnalyzing && result && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{t('analyzer.result')}</h2>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-violet-300 mb-2">{t('analyzer.summary')}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{result.analysis.summary}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-violet-300 mb-3">{t('analyzer.keyInsights')}</h3>
              <ul className="space-y-2">
                {result.analysis.keyInsights.map((insight, index) => (
                  <li className="flex items-start gap-2 text-slate-300 text-sm" key={index}>
                    <span className="text-violet-400 mt-0.5">{BULLET}</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-violet-300 mb-3">{t('analyzer.contentIdeas')}</h3>
              <ul className="space-y-2">
                {result.analysis.contentIdeas.map((idea, index) => (
                  <li className="flex items-start gap-2 text-slate-300 text-sm" key={index}>
                    <span className="text-pink-400 mt-0.5">{ARROW}</span>
                    {idea}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-violet-300 mb-3">{t('analyzer.captions')}</h3>
              <div className="space-y-3">
                {result.analysis.captions.map((caption, index) => (
                  <div
                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-slate-300 text-sm"
                    key={index}
                  >
                    {caption}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-violet-300 mb-3">{t('analyzer.hashtags')}</h3>
              <div className="flex flex-wrap gap-2">
                {result.analysis.hashtags.map((tag, index) => (
                  <span
                    className="bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-full px-3 py-1 text-sm"
                    key={index}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {result.notionPageUrl && (
              <a href={result.notionPageUrl} rel="noreferrer" target="_blank">
                <BaseButton className="w-full" customColor="secondary" size="large">
                  {t('analyzer.viewNotion')}
                </BaseButton>
              </a>
            )}

            <div className="pb-2">
              <BaseButton
                className="w-full"
                onClick={reset}
                size="large"
                variant="outlined"
              >
                {t('shared.button.back')}
              </BaseButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzerPage;
