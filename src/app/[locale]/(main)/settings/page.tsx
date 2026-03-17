import React from 'react';

export default function SettingsPage() {
  return <div></div>;
}

// 'use client';

// export const runtime = 'edge';

// import { useTranslations } from 'next-intl';
// import { useState } from 'react';

// import IconDarkMode from '@/assets/icons/shared/IconDarkMode.svg';
// import IconEnglish from '@/assets/icons/shared/IconEnglish.svg';
// import IconJapanese from '@/assets/icons/shared/IconJapanese.svg';
// import IconLightMode from '@/assets/icons/shared/IconLightMode.svg';
// import IconNotification from '@/assets/icons/shared/IconNotification.svg';
// import IconProfile from '@/assets/icons/shared/IconProfile.svg';
// import IconSettings from '@/assets/icons/shared/IconSettings.svg';
// import IconVietnamese from '@/assets/icons/shared/IconVietnamese.svg';
// import { BaseButton } from '@/components/shared/BaseButton';
// import { BaseFormItem } from '@/components/shared/BaseFormItem';
// import { BaseSelect } from '@/components/shared/BaseSelect';
// import { BaseSwitch } from '@/components/shared/BaseSwitch';
// import { PROFILE_PAGE } from '@/constants/route-pages.const';
// import { useLanguage } from '@/hooks/shared/use-language';
// import { useTheme } from '@/hooks/shared/use-theme';
// import { Link } from '@/i18n/navigation';
// import { ELanguageCode } from '@/models/enums/shared.enum';

// const SettingsPage: React.FC = () => {
//   const t = useTranslations();
//   const { changeTheme, theme } = useTheme();
//   const { language, setLanguage } = useLanguage();

//   const [notifications, setNotifications] = useState({
//     email: true,
//     newsletter: true,
//     productUpdates: false,
//     push: false,
//   });

//   const [privacy, setPrivacy] = useState({
//     activityTracking: false,
//     dataSharing: false,
//     profileVisibility: true,
//   });

//   const _themeOptions = [
//     {
//       label: (
//         <div className="flex items-center gap-2">
//           <IconLightMode className="w-4 h-4" />
//           <span>{t('settings.theme.light')}</span>
//         </div>
//       ),
//       value: 'light',
//     },
//     {
//       label: (
//         <div className="flex items-center gap-2">
//           <IconDarkMode className="w-4 h-4" />
//           <span>{t('settings.theme.dark')}</span>
//         </div>
//       ),
//       value: 'dark',
//     },
//     {
//       label: (
//         <div className="flex items-center gap-2">
//           <IconSettings className="w-4 h-4" />
//           <span>{t('settings.theme.system')}</span>
//         </div>
//       ),
//       value: 'system',
//     },
//   ];

//   const languageOptions = [
//     {
//       label: (
//         <div className="flex items-center gap-2">
//           <IconEnglish className="w-5 h-5" />
//           <span>{'English'}</span>
//         </div>
//       ),
//       value: 'en',
//     },
//     {
//       label: (
//         <div className="flex items-center gap-2">
//           <IconJapanese className="w-5 h-5" />
//           <span>{'日本語'}</span>
//         </div>
//       ),
//       value: 'ja',
//     },
//     {
//       label: (
//         <div className="flex items-center gap-2">
//           <IconVietnamese className="w-5 h-5" />
//           <span>{'Tiếng Việt'}</span>
//         </div>
//       ),
//       value: 'vi',
//     },
//   ];

//   const handleSaveSettings = () => {
//     // TODO: Implement save settings functionality
//     // Settings saved
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-8 flex items-center gap-3">
//         <IconSettings className="w-8 h-8" />
//         {t('settings.title')}
//       </h1>

//       <div className="space-y-8">
//         {/* Appearance Section */}
//         <section className="bg-white rounded-2xl p-6 shadow-sm">
//           <h2 className="text-lg font-semibold mb-4">
//             {t('settings.appearance.title')}
//           </h2>

//           <BaseFormItem label={t('settings.appearance.theme')} name="theme">
//             <div className="flex items-center gap-4">
//               <span>{t('settings.theme.light')}</span>
//               <BaseSwitch checked={theme === 'DARK'} onChange={changeTheme} />
//               <span>{t('settings.theme.dark')}</span>
//             </div>
//           </BaseFormItem>

//           <BaseFormItem
//             className="mt-4"
//             label={t('settings.appearance.language')}
//             name="language"
//           >
//             <BaseSelect
//               className="w-full md:w-64"
//               onChange={(value) => setLanguage(value as ELanguageCode)}
//               options={languageOptions}
//               value={language}
//             />
//           </BaseFormItem>
//         </section>

//         {/* Notifications Section */}
//         <section className="bg-white rounded-2xl p-6 shadow-sm">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <IconNotification className="w-5 h-5" />
//             {t('settings.notifications.title')}
//           </h2>

//           <div className="space-y-4">
//             <BaseFormItem
//               help={t('settings.notifications.emailHelp')}
//               label={t('settings.notifications.email')}
//               layout="horizontal"
//               name="emailNotifications"
//             >
//               <BaseSwitch
//                 checked={notifications.email}
//                 onChange={(checked) =>
//                   setNotifications({ ...notifications, email: checked })
//                 }
//               />
//             </BaseFormItem>

//             <BaseFormItem
//               help={t('settings.notifications.pushHelp')}
//               label={t('settings.notifications.push')}
//               layout="horizontal"
//               name="pushNotifications"
//             >
//               <BaseSwitch
//                 checked={notifications.push}
//                 onChange={(checked) =>
//                   setNotifications({ ...notifications, push: checked })
//                 }
//               />
//             </BaseFormItem>

//             <BaseFormItem
//               help={t('settings.notifications.newsletterHelp')}
//               label={t('settings.notifications.newsletter')}
//               layout="horizontal"
//               name="newsletter"
//             >
//               <BaseSwitch
//                 checked={notifications.newsletter}
//                 onChange={(checked) =>
//                   setNotifications({ ...notifications, newsletter: checked })
//                 }
//               />
//             </BaseFormItem>

//             <BaseFormItem
//               help={t('settings.notifications.productUpdatesHelp')}
//               label={t('settings.notifications.productUpdates')}
//               layout="horizontal"
//               name="productUpdates"
//             >
//               <BaseSwitch
//                 checked={notifications.productUpdates}
//                 onChange={(checked) =>
//                   setNotifications({
//                     ...notifications,
//                     productUpdates: checked,
//                   })
//                 }
//               />
//             </BaseFormItem>
//           </div>
//         </section>

//         {/* Account Section */}
//         <section className="bg-white rounded-2xl p-6 shadow-sm">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <IconProfile className="w-5 h-5" />
//             {t('settings.account.title')}
//           </h2>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between py-3 border-b">
//               <div>
//                 <p className="font-medium">
//                   {t('settings.account.changePassword')}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {t('settings.account.changePasswordHelp')}
//                 </p>
//               </div>
//               <Link href={PROFILE_PAGE.CHANGE_PASSWORD}>
//                 <BaseButton size="small" variant="outlined">
//                   {t('settings.account.changePasswordButton')}
//                 </BaseButton>
//               </Link>
//             </div>

//             <div className="flex items-center justify-between py-3">
//               <div>
//                 <p className="font-medium text-red-600">
//                   {t('settings.account.deleteAccount')}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {t('settings.account.deleteAccountHelp')}
//                 </p>
//               </div>
//               <BaseButton danger size="small" variant="outlined">
//                 {t('settings.account.deleteAccountButton')}
//               </BaseButton>
//             </div>
//           </div>
//         </section>

//         {/* Privacy Section */}
//         <section className="bg-white rounded-2xl p-6 shadow-sm">
//           <h2 className="text-lg font-semibold mb-4">
//             {t('settings.privacy.title')}
//           </h2>

//           <div className="space-y-4">
//             <BaseFormItem
//               help={t('settings.privacy.profileVisibilityHelp')}
//               label={t('settings.privacy.profileVisibility')}
//               layout="horizontal"
//               name="profileVisibility"
//             >
//               <BaseSwitch
//                 checked={privacy.profileVisibility}
//                 onChange={(checked) =>
//                   setPrivacy({ ...privacy, profileVisibility: checked })
//                 }
//               />
//             </BaseFormItem>

//             <BaseFormItem
//               help={t('settings.privacy.activityTrackingHelp')}
//               label={t('settings.privacy.activityTracking')}
//               layout="horizontal"
//               name="activityTracking"
//             >
//               <BaseSwitch
//                 checked={privacy.activityTracking}
//                 onChange={(checked) =>
//                   setPrivacy({ ...privacy, activityTracking: checked })
//                 }
//               />
//             </BaseFormItem>

//             <BaseFormItem
//               help={t('settings.privacy.dataSharingHelp')}
//               label={t('settings.privacy.dataSharing')}
//               layout="horizontal"
//               name="dataSharing"
//             >
//               <BaseSwitch
//                 checked={privacy.dataSharing}
//                 onChange={(checked) =>
//                   setPrivacy({ ...privacy, dataSharing: checked })
//                 }
//               />
//             </BaseFormItem>
//           </div>
//         </section>

//         {/* Save Button */}
//         <div className="flex justify-end gap-4">
//           <BaseButton size="large" variant="outlined">
//             {t('settings.cancel')}
//           </BaseButton>
//           <BaseButton
//             onClick={handleSaveSettings}
//             size="large"
//             variant="filled"
//           >
//             {t('settings.save')}
//           </BaseButton>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;
