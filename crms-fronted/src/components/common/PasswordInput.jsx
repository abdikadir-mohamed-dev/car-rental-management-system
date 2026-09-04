import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/*
 * Password <input> with a show/hide toggle. Renders like a normal
 * text input plus an eye icon button; all other props (name, value,
 * onChange, placeholder, autoComplete, id, ...) pass straight through.
 */
function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        className={`${className} pr-10`}
        {...props}
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {visible ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

export default PasswordInput
