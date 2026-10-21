import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { Navigation } from './components/Navigation';
import { ToastContainer } from './components/common/Toast';
import { StudentDetailModal } from './components/common/StudentDetailModal';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { RecordsModule } from './components/modules/RecordsModule';
import { UnderstandingModule } from './components/modules/UnderstandingModule';
import { AiAssistantModule } from './components/modules/AiAssistantModule';
import { CareManagementModule } from './components/modules/CareManagementModule';
import { ProgressModule } from './components/modules/ProgressModule';
import { HappyActivitiesModule } from './components/modules/HappyActivitiesModule';
import { ParentConnectModule } from './components/modules/ParentConnectModule';
import { LibraryModule } from './components/modules/LibraryModule';
import { ReportEvidenceModule } from './components/modules/ReportEvidenceModule';
import { HappinessMapModule } from './components/modules/HappinessMapModule';
import { SettingsModule } from './components/modules/SettingsModule';

const MainContent: React.FC = () => {
  const { activeTab, settings } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5]">
      {/* Global Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6">
        {/* Hero banner shown on Overview */}
        {activeTab === 'overview' && <HeroBanner />}

        {/* 10 Modules + 2 Special Navigation Tabs */}
        <Navigation />

        {/* Dynamic Module Rendering */}
        <div className="transition-all duration-200">
          {activeTab === 'overview' && <DashboardModule />}
          {activeTab === 'records' && <RecordsModule />}
          {activeTab === 'understanding' && <UnderstandingModule />}
          {activeTab === 'ai_assistant' && <AiAssistantModule />}
          {activeTab === 'care_management' && <CareManagementModule />}
          {activeTab === 'progress' && <ProgressModule />}
          {activeTab === 'happy_activities' && <HappyActivitiesModule />}
          {activeTab === 'parent_connect' && <ParentConnectModule />}
          {activeTab === 'library' && <LibraryModule />}
          {activeTab === 'report_evidence' && <ReportEvidenceModule />}
          {activeTab === 'happiness_map' && <HappinessMapModule />}
          {activeTab === 'settings' && <SettingsModule />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200/90 py-8 px-4 text-center text-xs text-slate-500 space-y-2 no-print">
        <div className="flex items-center justify-center gap-2 flex-wrap font-bold text-slate-800">
          <span>AI ĐỒNG HÀNH – KIẾN TẠO LỚP 4 HẠNH PHÚC</span>
          <span>•</span>
          <span>{settings.schoolName}</span>
          <span>•</span>
          <span>Lớp {settings.className} ({settings.schoolYear})</span>
          <span>•</span>
          <span>GVCN: {settings.teacherName}</span>
        </div>
        <p className="italic text-slate-600">
          “{settings.slogan}”
        </p>
        <p className="text-[11px] text-slate-400">
          Hệ sinh thái công tác chủ nhiệm số ứng dụng Trí tuệ nhân tạo Google Gemini • Chuẩn hóa Thông tư 27/2020/TT-BGDĐT
        </p>
      </footer>

      {/* Global Modals & Notifications */}
      <StudentDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
