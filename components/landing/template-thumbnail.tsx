import { getTemplateDef, RESUME_PAGE_WIDTH_PX, RESUME_PAGE_HEIGHT_PX } from '@/lib/templates'
import { landingSampleResume } from '@/lib/data/landing-sample'

interface TemplateThumbnailProps {
  templateId: string
  /** Rendered box width in px (height follows US-Letter aspect). */
  width?: number
}

/**
 * Renders a real template at fixed page width, scaled down into a
 * letter-aspect box - the thumbnail is always faithful to the real output.
 */
export function TemplateThumbnail({ templateId, width = 264 }: TemplateThumbnailProps) {
  const def = getTemplateDef(templateId)
  const Template = def.component
  const scale = width / RESUME_PAGE_WIDTH_PX
  const height = Math.round(RESUME_PAGE_HEIGHT_PX * scale)

  return (
    <div
      aria-hidden
      className="pointer-events-none relative select-none overflow-hidden bg-white"
      style={{ width, height }}
    >
      <div
        style={{
          width: RESUME_PAGE_WIDTH_PX,
          height: RESUME_PAGE_HEIGHT_PX,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <Template data={landingSampleResume} />
      </div>
    </div>
  )
}
