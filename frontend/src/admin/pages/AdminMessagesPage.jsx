import React, { useState, useEffect, useCallback } from 'react'
import { Mail, Trash2, MailOpen, Check, X, ExternalLink } from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminMessagesPage() {
  const { addToast } = useAdminToast()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Message Detail Modal
  const [activeMessage, setActiveMessage] = useState(null)

  // Delete Modal
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadMessages = useCallback(async () => {
    try {
      const data = await adminApi.getMessages()
      setMessages(data || [])
    } catch (err) {
      addToast(err.message || 'Failed to load messages', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  const handleToggleRead = async (msgId, currentStatus) => {
    try {
      await adminApi.toggleMessageRead(msgId, !currentStatus)
      addToast(`Marked as ${!currentStatus ? 'read' : 'unread'}`)
      if (activeMessage && activeMessage.id === msgId) {
        setActiveMessage({ ...activeMessage, is_read: !currentStatus, isRead: !currentStatus })
      }
      loadMessages()
    } catch (err) {
      addToast(err.message || 'Failed to update message', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteMessage(deleteId)
      addToast('Message deleted.')
      if (activeMessage && activeMessage.id === deleteId) {
        setActiveMessage(null)
      }
      setDeleteId(null)
      loadMessages()
    } catch (err) {
      addToast(err.message || 'Failed to delete message', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    )
  }

  const unreadCount = messages.filter((m) => !(m.is_read ?? m.isRead)).length

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Inbound Messages Inbox
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-black">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Inquiries received from recruiters, hiring managers, and collaborators via the contact form.
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#111622] border border-dashed border-white/10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-gray-500">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Inbox is Empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            When recruiters or clients submit inquiries through the contact form, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#111622] border border-white/10 rounded-3xl overflow-hidden shadow-xl divide-y divide-white/5">
          {messages.map((msg) => {
            const isRead = msg.is_read ?? msg.isRead
            return (
              <div
                key={msg.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isRead
                    ? 'hover:bg-white/[0.02] text-gray-300'
                    : 'bg-emerald-950/10 hover:bg-emerald-950/20 text-white font-medium'
                }`}
                onClick={() => setActiveMessage(msg)}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isRead ? 'bg-white/5 text-gray-500' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{msg.name}</span>
                      <span className="text-xs text-gray-400 font-mono">&lt;{msg.email}&gt;</span>
                      {!isRead && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 shrink-0 sm:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] font-mono text-gray-500">
                    {new Date(msg.created_at || msg.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleToggleRead(msg.id, isRead)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                    title={isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <Check className={`w-4 h-4 ${isRead ? 'text-gray-500' : 'text-emerald-400'}`} />
                  </button>

                  <button
                    onClick={() => setDeleteId(msg.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Message Detail Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111622] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-left shadow-2xl relative">
            <button
              onClick={() => setActiveMessage(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{activeMessage.name}</h3>
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="text-xs text-emerald-400 hover:underline font-mono"
                >
                  {activeMessage.email}
                </a>
              </div>
            </div>

            <div className="text-[11px] font-mono text-gray-500 mb-4 pb-3 border-b border-white/5">
              Received on {new Date(activeMessage.created_at || activeMessage.createdAt).toLocaleString()}
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap mb-6">
              {activeMessage.message}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleToggleRead(activeMessage.id, activeMessage.is_read ?? activeMessage.isRead)}
                className="text-xs text-gray-400 hover:text-white font-medium"
              >
                {activeMessage.is_read || activeMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleteId(activeMessage.id)}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20"
                >
                  Delete
                </button>
                <a
                  href={`mailto:${activeMessage.email}?subject=${encodeURIComponent(
                    `Re: Inquiry from ${activeMessage.name}`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-colors"
                >
                  <span>Reply via Email</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to permanently delete this message?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  )
}
