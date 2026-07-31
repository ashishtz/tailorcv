'use client'

import { useEffect, useId, useState } from 'react'
import { Input, type InputProps } from '@/components/ui/field'

interface SuggestInputProps extends Omit<InputProps, 'list' | 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  /** Async source of suggestions for the current text; called debounced (300ms). */
  search: (term: string) => Promise<string[]>
}

/**
 * <Input> + <datalist> fed by a debounced async search - the native
 * search-or-create combobox used by the skill pickers. Pass a stable
 * (useCallback) `search` function.
 */
export function SuggestInput({ value, onChange, search, ...props }: SuggestInputProps) {
  const listId = useId()
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(() => {
      search(value.trim()).then((names) => {
        if (active) setOptions(names)
      })
    }, 300)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [value, search])

  return (
    <>
      <Input list={listId} value={value} onChange={(e) => onChange(e.target.value)} {...props} />
      <datalist id={listId}>
        {options.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </>
  )
}
