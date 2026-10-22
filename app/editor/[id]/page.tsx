'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getWeddingById, updateWedding, isSlugAvailable } from '@/services/weddingService';
import { WeddingProject, WeddingDetails, WeddingThemeConfig, WeddingTemplateId } from '@/types/wedding';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { GeneralTab } from '@/components/editor/tabs/GeneralTab';
import { VenuesTab } from '@/components/editor/tabs/VenuesTab';
import { StoryTab } from '@/components/editor/tabs/StoryTab';
import { GalleryTab } from '@/components/editor/tabs/GalleryTab';
import { DesignTab } from '@/components/editor/tabs/DesignTab';
import { MusicTab } from '@/components/editor/tabs/MusicTab';
import { SectionsTab } from '@/components/editor/tabs/SectionsTab';
import { PublishTab } from '@/components/editor/tabs/PublishTab';
import { LivePreviewFrame } from '@/components/editor/LivePreviewFrame';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/Button';
import {
  User,
  MapPin,
  Heart,
  ImageIcon,
  Palette,
  Music,
  Layers,
  Globe,
  Loader2,
  Eye,
  Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type EditorTab =
  | 'general'
  | 'venues'
  | 'story'
  | 'gallery'
  | 'design'
  | 'music'
  | 'sections'
  | 'publish';

function WeddingEditorContent() {
  const params = useParams();
  const weddingId = params?.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [wedding, setWedding] = useState<WeddingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EditorTab>('general');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Warn before closing or navigating away if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fetch wedding project
  useEffect(() => {
    async function loadData() {
      if (!weddingId || authLoading) return;
      if (!user) {
        router.push('/login');
        return;
      }
      // Check approval status: only approved users or admin can edit
      const isAdmin = user.role === 'admin' || user.email?.toLowerCase() === 'navodtwijesooriya@gmail.com';
      if (!isAdmin && user.status !== 'approved') {
        toastError('Account Pending', 'Your account is pending administrator approval.');
        router.push('/pending-approval');
        return;
      }

      try {
        const item = await getWeddingById(weddingId);
        if (!item) {
          toastError('Not Found', 'Wedding project not found.');
          router.push('/dashboard/weddings');
          return;
        }

        // Enforce strict ownership check
        if (item.userId !== user.uid && !isAdmin && user.uid !== 'demo-user-123') {
          toastError('Access Denied', 'You do not have permission to access or edit this wedding project.');
          router.push('/dashboard/weddings');
          return;
        }

        setWedding(item);
      } catch (err) {
        console.error('Failed to load wedding:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [weddingId, user, authLoading, router, toastError]);

  // Handle updates
  const handleDetailsChange = (updates: Partial<WeddingDetails>) => {
    if (!wedding) return;
    setWedding({
      ...wedding,
      details: {
        ...wedding.details,
        ...updates,
      },
    });
    setHasUnsavedChanges(true);
  };

  const handleThemeChange = (updates: Partial<WeddingThemeConfig>) => {
    if (!wedding) return;
    setWedding({
      ...wedding,
      themeConfig: {
        ...wedding.themeConfig,
        ...updates,
      },
    });
    setHasUnsavedChanges(true);
  };

  const handleTemplateChange = (templateId: WeddingTemplateId) => {
    if (!wedding) return;
    setWedding({
      ...wedding,
      templateId,
    });
    setHasUnsavedChanges(true);
    info('Template Applied', `Switched layout to ${templateId.replace('-', ' ')}`);
  };

  const handleSlugChange = (slug: string) => {
    if (!wedding) return;
    setWedding({
      ...wedding,
      slug,
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!wedding || !user) return;
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await updateWedding(wedding.id, user.uid, {
        title: `${wedding.details.brideName} & ${wedding.details.groomName}'s Wedding`,
        slug: wedding.slug,
        templateId: wedding.templateId,
        details: wedding.details,
        themeConfig: wedding.themeConfig,
        status: wedding.status,
      });
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      success('Changes Saved', 'All invitation updates are securely stored.');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      toastError('Save Failed', err?.message || 'Could not save wedding changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!wedding || !user) return;
    const newStatus = wedding.status === 'published' ? 'draft' : 'published';

    // Verify slug availability before publishing
    if (newStatus === 'published') {
      const avail = await isSlugAvailable(wedding.slug, wedding.id);
      if (!avail) {
        toastError('Slug Unavailable', 'This URL slug is taken. Please customize it in the Publish tab.');
        setActiveTab('publish');
        return;
      }
    }

    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const updated = await updateWedding(wedding.id, user.uid, {
        ...wedding,
        status: newStatus,
      });
      setWedding(updated);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      if (newStatus === 'published') {
        success('Website Published & Live!', `Guests can now visit /wedding/${wedding.slug}`);
      } else {
        info('Website Unpublished', 'Your invitation is now private.');
      }
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      toastError('Action Failed', err?.message || 'Failed to update publication status.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || authLoading) {
    return <LoadingScreen message="Loading Visual Wedding Builder..." />;
  }

  if (!wedding) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold text-stone-900 mb-2">Wedding Not Found</h2>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const tabs: Array<{ id: EditorTab; label: string; icon: React.ElementType }> = [
    { id: 'general', label: 'General', icon: User },
    { id: 'venues', label: 'Venues', icon: MapPin },
    { id: 'story', label: 'Story', icon: Heart },
    { id: 'gallery', label: 'Photos', icon: ImageIcon },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'sections', label: 'Sections', icon: Layers },
    { id: 'publish', label: 'Publish', icon: Globe },
  ];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Header */}
      <EditorHeader
        wedding={wedding}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        saveStatus={saveStatus}
        onSave={handleSave}
        onTogglePublish={handleTogglePublish}
        device={device}
        setDevice={setDevice}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Mobile view toggle (Editor vs Preview) */}
      <div className="md:hidden flex border-b border-stone-200 bg-stone-50 p-1">
        <button
          onClick={() => setMobileView('editor')}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition',
            mobileView === 'editor'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          )}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Customize Controls
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition',
            mobileView === 'preview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Customization Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={cn(
                'w-full md:w-[480px] lg:w-[540px] shrink-0 border-r border-stone-200 flex flex-col bg-white h-full overflow-hidden',
                mobileView === 'preview' ? 'hidden md:flex' : 'flex'
              )}
            >
              {/* Tabs bar */}
              <div className="border-b border-stone-200 px-3 py-2 bg-stone-50/70 overflow-x-auto flex gap-1 scrollbar-none shrink-0">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer',
                        isActive
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20">
                {activeTab === 'general' && (
                  <GeneralTab wedding={wedding} onChangeDetails={handleDetailsChange} />
                )}
                {activeTab === 'venues' && (
                  <VenuesTab wedding={wedding} onChangeDetails={handleDetailsChange} />
                )}
                {activeTab === 'story' && (
                  <StoryTab wedding={wedding} onChangeDetails={handleDetailsChange} />
                )}
                {activeTab === 'gallery' && (
                  <GalleryTab wedding={wedding} onChangeDetails={handleDetailsChange} />
                )}
                {activeTab === 'design' && (
                  <DesignTab
                    wedding={wedding}
                    onChangeTemplate={handleTemplateChange}
                    onChangeTheme={handleThemeChange}
                  />
                )}
                {activeTab === 'music' && (
                  <MusicTab wedding={wedding} onChangeDetails={handleDetailsChange} />
                )}
                {activeTab === 'sections' && (
                  <SectionsTab wedding={wedding} onChangeDetails={handleDetailsChange} />
                )}
                {activeTab === 'publish' && (
                  <PublishTab
                    wedding={wedding}
                    onChangeSlug={handleSlugChange}
                    onTogglePublish={handleTogglePublish}
                    isSaving={isSaving}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side: Live Preview Area */}
        <div
          className={cn(
            'flex-1 h-full overflow-hidden bg-stone-100',
            mobileView === 'editor' ? 'hidden md:block' : 'block'
          )}
        >
          <LivePreviewFrame wedding={wedding} device={device} />
        </div>
      </div>
    </div>
  );
}

export default function WeddingEditorPage() {
  return (
    <React.Suspense fallback={<LoadingScreen message="Loading Visual Wedding Builder..." />}>
      <WeddingEditorContent />
    </React.Suspense>
  );
}
