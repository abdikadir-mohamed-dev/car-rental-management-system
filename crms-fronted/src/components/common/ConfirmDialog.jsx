import { useState } from 'react'
import toast from 'react-hot-toast'

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Yes', cancelText = 'Cancel' }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-2">{message}</p>
        </div>
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button onClick={onConfirm} className="btn-primary flex-1">{confirmText}</button>
          <button onClick={onCancel} className="btn-secondary flex-1">{cancelText}</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
