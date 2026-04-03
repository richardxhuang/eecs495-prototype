import type { AppView } from '../types/domain'

type ViewToggleProps = {
  activeView: AppView
  onChange: (view: AppView) => void
}

export function ViewToggle({ activeView, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="tablist" aria-label="Switch view">
      <button
        type="button"
        role="tab"
        aria-selected={activeView === 'map'}
        className={activeView === 'map' ? 'toggle-btn active' : 'toggle-btn'}
        onClick={() => onChange('map')}
      >
        Map
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeView === 'list'}
        className={activeView === 'list' ? 'toggle-btn active' : 'toggle-btn'}
        onClick={() => onChange('list')}
      >
        List
      </button>
    </div>
  )
}
