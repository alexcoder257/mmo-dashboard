'use client';

export const runtime = 'edge';

import type { TableColumnsType } from 'antd';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Input, message, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { deleteDoc, doc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { ITravelJob } from '@/hooks/shared/use-travel-jobs';

import { travelAnalyzeApi } from '@/apis/travel.api';
import IconAnalyzer from '@/assets/icons/shared/IconAnalyzer.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { useTravelJobs } from '@/hooks/shared/use-travel-jobs';
import { db } from '@/libs/firebase/config';

type TStatusConfig = {
  color: string;
  icon: React.ReactNode;
};

const STATUS_CONFIG: Record<ITravelJob['status'], TStatusConfig> = {
  analyzing: { color: 'orange', icon: <LoadingOutlined spin /> },
  completed: { color: 'green', icon: <CheckCircleOutlined /> },
  creating_notion: { color: 'purple', icon: <LoadingOutlined spin /> },
  downloading: { color: 'blue', icon: <LoadingOutlined spin /> },
  extracting_frames: { color: 'cyan', icon: <LoadingOutlined spin /> },
  failed: { color: 'red', icon: <CloseCircleOutlined /> },
  uploading_images: { color: 'geekblue', icon: <LoadingOutlined spin /> },
};

const STATUS_I18N_KEY: Record<ITravelJob['status'], string> = {
  analyzing: 'analyzing',
  completed: 'completed',
  creating_notion: 'creatingNotion',
  downloading: 'downloading',
  extracting_frames: 'extractingFrames',
  failed: 'failed',
  uploading_images: 'uploadingImages',
};

const TravelPage: React.FC = () => {
  const t = useTranslations();
  const { jobs, loading } = useTravelJobs();
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim() || !url.includes('tiktok.com')) {
      message.error(t('travel.invalidUrl'));
      return;
    }

    setIsSubmitting(true);
    try {
      await travelAnalyzeApi({ tiktokUrl: url });
      setUrl('');
    } catch (_err) {
      message.error(t('travel.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteDoc(doc(db, 'travel_jobs', jobId));
    } catch (_err) {
      message.error(t('travel.error'));
    }
  };

  const columns: TableColumnsType<ITravelJob> = [
    {
      dataIndex: 'tiktokUrl',
      key: 'tiktokUrl',
      render: (url: string) => (
        <Tooltip title={url}>
          <a
            className="text-blue-400 hover:text-blue-300 font-mono text-xs"
            href={url}
            rel="noreferrer"
            target="_blank"
          >
            {url.length > 40 ? `${url.slice(0, 40)}...` : url}
          </a>
        </Tooltip>
      ),
      title: t('travel.table.tiktokUrl'),
      width: 220,
    },
    {
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <span className="text-slate-300">{title || '—'}</span>
      ),
      title: t('travel.table.title'),
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: (status: ITravelJob['status']) => {
        const config = STATUS_CONFIG[status];
        const labelKey = STATUS_I18N_KEY[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {t(`travel.status.${labelKey}`)}
          </Tag>
        );
      },
      title: t('travel.table.status'),
      width: 180,
    },
    {
      dataIndex: 'notionUrl',
      key: 'notionUrl',
      render: (notionUrl: null | string) =>
        notionUrl ? (
          <a
            className="text-purple-400 hover:text-purple-300 text-sm"
            href={notionUrl}
            rel="noreferrer"
            target="_blank"
          >
            {t('travel.viewNotion')}
          </a>
        ) : (
          <span className="text-slate-500">—</span>
        ),
      title: t('travel.table.notionLink'),
      width: 120,
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: Date | null) => (
        <span className="text-slate-400 text-xs">
          {createdAt ? dayjs(createdAt).format('YYYY-MM-DD HH:mm') : '—'}
        </span>
      ),
      title: t('travel.table.createdAt'),
      width: 150,
    },
    {
      key: 'actions',
      render: (_: unknown, record: ITravelJob) => (
        <Space>
          <Popconfirm
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
            title={t('travel.deleteConfirm')}
          >
            <BaseButton
              danger
              icon={<DeleteOutlined />}
              size="small"
              type="text"
            />
          </Popconfirm>
        </Space>
      ),
      title: t('travel.table.actions'),
      width: 80,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <IconAnalyzer className="w-8 h-8 text-emerald-400" />
          {t('travel.title')}
        </h1>
        <p className="text-slate-400 mb-8">{t('travel.description')}</p>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <Input
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-xl"
              disabled={isSubmitting}
              onChange={(e) => setUrl(e.target.value)}
              onPressEnter={handleAnalyze}
              placeholder={t('travel.urlPlaceholder')}
              size="large"
              value={url}
            />
            <BaseButton
              customColor="primary"
              disabled={isSubmitting || !url.trim()}
              loading={isSubmitting}
              onClick={handleAnalyze}
              size="large"
            >
              {isSubmitting ? t('travel.analyzing') : t('travel.analyze')}
            </BaseButton>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
          <Table<ITravelJob>
            columns={columns}
            dataSource={jobs}
            loading={loading}
            locale={{ emptyText: t('travel.noJobs') }}
            pagination={false}
            rowKey="id"
            scroll={{ x: 900 }}
            size="middle"
          />
        </div>
      </div>
    </div>
  );
};

export default TravelPage;
