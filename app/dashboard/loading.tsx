import { DashboardOverviewSkeleton } from '@/components/ui/Skeletons';

export default function DashboardLoading() {
  return (
    <div className="py-4">
      <DashboardOverviewSkeleton />
    </div>
  );
}
