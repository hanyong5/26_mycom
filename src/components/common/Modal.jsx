import { useEffect } from 'react'
import Button from './Button'

export default function Modal({ isOpen, onClose, title, children, confirmText = '확인', onConfirm, danger = false }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="text-sm text-gray-600 mb-6">{children}</div>
        {onConfirm && (
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={onClose}>취소</Button>
            <Button variant={danger ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>{confirmText}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
