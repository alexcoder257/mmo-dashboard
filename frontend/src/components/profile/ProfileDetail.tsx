// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

import { useGetProfileQuery } from '@/hooks/profile/use-auth-queries';

interface IProps {
  className?: string;
}

const ProfileDetail: React.FC<IProps> = ({ className }) => {
  const { data: userInfo, isLoading } = useGetProfileQuery();

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-xl" />;
  }

  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm">{'Username'}</span>
          <span className="font-medium text-sm">
            {userInfo?.firstname} {userInfo?.lastname}
          </span>
        </div>
        <div className="flex justify-between py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm">{'Email'}</span>
          <span className="font-medium text-sm">{userInfo?.email}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
