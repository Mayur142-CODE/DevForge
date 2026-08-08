import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between pb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* Category Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 rounded-2xl">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </div>
              <Skeleton className="h-24 w-full rounded-lg" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AchievementsSkeleton() {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto w-full">
      {/* Hero Card */}
      <Card className="border-border/40 bg-card/50 rounded-3xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-secondary/30 border border-border/30">
              <div className="text-center space-y-1">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="h-10 w-px bg-border/40" />
              <div className="text-center space-y-1">
                <Skeleton className="h-8 w-14" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border/20">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-xl" />
        ))}
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 rounded-2xl overflow-hidden">
            <Skeleton className="h-1.5 w-full" />
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-start gap-3.5">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
              <div className="pt-2 border-t border-border/20 space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CategoriesSkeleton() {
  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 rounded-2xl">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </div>
              <Skeleton className="h-24 w-full rounded-lg" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function StatisticsSkeleton() {
  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 rounded-2xl">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 rounded-2xl">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 rounded-2xl">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl space-y-6 p-6">
      {/* Profile Card */}
      <Card className="border-border/40 bg-card/50 rounded-3xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 rounded-2xl">
            <CardContent className="p-5">
              <Skeleton className="h-3 w-28 mb-3" />
              <Skeleton className="h-7 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
