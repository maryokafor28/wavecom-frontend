'use client'

import { useState } from 'react'
import { Mail, Phone, Radio, Bell, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/use-notifications'
import { useNotificationStats } from '@/hooks/use-notification-stats'
import { useCanEditRecipient, useCanDeleteRecipient, } from '@/hooks/use-recipient-permission'
import { usePushRegistration } from '@/hooks/use-push-registration'
import { EditRecipientSheet } from '@/components/recipients/edit-recipient-sheet'
import type { Recipient } from '@/hooks/use-recipient'
import { useDisablePush } from '@/hooks/use-disable-push'
import { useRecipient } from '@/components/layout/recipient-context'
import { clearAllIdentification } from '@/lib/recipient-storage'
import { DeleteRecipientDialog } from '@/components/recipients/delete-recipient-dialog'

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function RecipientOverview({ recipient }: { recipient: Recipient }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [editSession, setEditSession] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<Recipient | null>(null)

  const canEdit = useCanEditRecipient()
  const canDelete = useCanDeleteRecipient()
  const { recipientId: currentRecipientId } = useRecipient()

  const {
    mutate: enablePush,
    isPending: pushPending,
    error: pushError,
  } = usePushRegistration(recipient.id)

  const {
  mutate: disablePush,
  isPending: disablePending,
  error: disableError,
} = useDisablePush(recipient.id)

  const { data: notificationsData, isLoading: lastNotifLoading } =
    useNotifications({ recipientId: recipient.id, limit: 1 })

  const { data: stats, isLoading: statsLoading } = useNotificationStats(
    recipient.id,
  )

  const lastNotification = notificationsData?.notifications?.[0]

  // A push token belongs to one browser, so only the person viewing their own
  // profile can register this device. The owner override doesn't apply here.
  const isOwnProfile = recipient.id === currentRecipientId

  function handleDeleted() {
    if (recipient.id === currentRecipientId) {
      // They deleted their own profile: clear the stored identity and do a full
      // reload so the context re-reads storage and the identification modal returns.
      clearAllIdentification()
      window.location.assign('/recipients')
      return
    }
    router.push('/recipients')
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Basic Info
          </h3>

          <div className="flex items-center gap-2">
            {canEdit(recipient) && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setEditSession((s) => s + 1)
                  setEditOpen(true)
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}

            {canDelete(recipient) && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => setPendingDelete(recipient)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="text-sm text-foreground">{recipient.email}</dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd className="text-sm text-foreground">
                {recipient.phone || 'Not set'}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">
                Preferred Channel
              </dt>
              <dd className="text-sm capitalize text-foreground">
                {recipient.preferredChannel}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 shrink-0 text-primary" />
            <div>
             <dt className="text-xs text-muted-foreground">Push</dt>
<dd className="text-sm text-foreground">
  {recipient.hasPushToken ? 'Registered' : 'Not registered'}
</dd>

{isOwnProfile && (
  <Button
    variant="outline"
    size="sm"
    disabled={pushPending || disablePending}
    onClick={() =>
      recipient.hasPushToken ? disablePush() : enablePush()
    }
    className="mt-2"
  >
    {pushPending
      ? 'Enabling...'
      : disablePending
        ? 'Disabling...'
        : recipient.hasPushToken
          ? 'Disable Notifications'
          : 'Enable  Notifications'}
  </Button>
)}

{(pushError || disableError) && (
  <p className="mt-2 max-w-xs text-xs text-destructive">
    {(pushError ?? disableError)?.message}
  </p>
)}
            </div>
          </div>
        </dl>
      </div>

      {/* At-a-glance summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground">Snapshot</h3>

        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Last Notification</dt>
            {lastNotifLoading ? (
              <Skeleton className="mt-1 h-5 w-16" />
            ) : (
              <dd className="mt-1 text-sm font-medium text-foreground">
                {lastNotification
                  ? formatRelativeTime(lastNotification.createdAt)
                  : '—'}
              </dd>
            )}
          </div>

          <div>
            <dt className="text-xs text-muted-foreground">Last Status</dt>
            {lastNotifLoading ? (
              <Skeleton className="mt-1 h-5 w-16" />
            ) : (
              <dd className="mt-1 text-sm font-medium capitalize text-foreground">
                {lastNotification?.status ?? '—'}
              </dd>
            )}
          </div>

          <div>
            <dt className="text-xs text-muted-foreground">
              Total Notifications
            </dt>
            {statsLoading ? (
              <Skeleton className="mt-1 h-5 w-10" />
            ) : (
              <dd className="mt-1 text-sm font-medium text-foreground">
                {stats?.total ?? 0}
              </dd>
            )}
          </div>

          <div>
            <dt className="text-xs text-muted-foreground">Average Delivery</dt>
            {statsLoading ? (
              <Skeleton className="mt-1 h-5 w-16" />
            ) : (
              <dd className="mt-1 text-sm font-medium text-foreground">
                {(stats?.avgDeliveryTimeMs ?? 0).toLocaleString()} ms
              </dd>
            )}
          </div>
        </dl>
      </div>

      <EditRecipientSheet
        key={editSession}
        open={editOpen}
        onOpenChangeAction={setEditOpen}
        recipient={recipient}
      />

      <DeleteRecipientDialog
        recipient={pendingDelete}
        onOpenChangeAction={(open) => !open && setPendingDelete(null)}
        onDeletedAction={handleDeleted}
      />
    </div>
  )
}