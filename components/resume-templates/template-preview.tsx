'use client'

import { useRef, useEffect } from 'react'

interface TemplatePreviewProps {
  templateId: string
  templateName: string
  isSelected: boolean
  onClick: () => void
}

const sampleData = {
  summary: "Experienced software developer with expertise in full-stack development and a proven track record of delivering scalable applications.",
  contact: {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    address: "123 Main St"
  },
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
  workExperience: [
    {
      company: "Tech Company",
      position: "Senior Developer",
      location: "New York, NY",
      type: "Full-Time",
      duration: "Jan 2020 - Present",
      description: "• Led development of web applications\n• Collaborated with cross-functional teams\n• Improved performance by 40%"
    }
  ],
  education: [
    {
      institution: "University Name",
      degree: "Bachelor's",
      field: "Computer Science",
      duration: "2016 - 2020"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      role: "Lead Developer",
      description: "Built a full-stack e-commerce solution",
      link: "https://example.com"
    }
  ]
}

function renderClassicPreview(ctx: CanvasRenderingContext2D, width: number) {
  // Header with name
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 16px Arial'
  ctx.fillText(sampleData.contact.name, 20, 30)

  // Contact info
  ctx.fillStyle = '#6b7280'
  ctx.font = '10px Arial'
  ctx.fillText(`${sampleData.contact.email} • ${sampleData.contact.phone}`, 20, 45)

  // Underline for header
  ctx.strokeStyle = '#111827'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 55)
  ctx.lineTo(width - 20, 55)
  ctx.stroke()

  // Skills section
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 12px Arial'
  ctx.fillText('SKILLS', 20, 80)

  // Skills chips
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(20, 90, 50, 16)
  ctx.fillRect(75, 90, 60, 16)
  ctx.fillRect(140, 90, 45, 16)

  ctx.fillStyle = '#374151'
  ctx.font = '8px Arial'
  ctx.fillText('JavaScript', 22, 100)
  ctx.fillText('React', 77, 100)
  ctx.fillText('Node.js', 142, 100)

  // Experience section
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 12px Arial'
  ctx.fillText('WORK EXPERIENCE', 20, 130)

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('Senior Developer', 20, 150)

  ctx.fillStyle = '#6b7280'
  ctx.font = '9px Arial'
  ctx.fillText('Tech Company • New York, NY', 20, 165)
  ctx.fillText('Jan 2020 - Present', width - 100, 165)

  // Experience description
  ctx.fillStyle = '#374151'
  ctx.font = '8px Arial'
  ctx.fillText('• Led development of web applications', 20, 180)
  ctx.fillText('• Collaborated with cross-functional teams', 20, 195)

  // Education section
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 12px Arial'
  ctx.fillText('EDUCATION', 20, 225)

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('University Name', 20, 245)

  ctx.fillStyle = '#6b7280'
  ctx.font = '9px Arial'
  ctx.fillText('Bachelor\'s in Computer Science', 20, 260)
  ctx.fillText('2016 - 2020', width - 70, 260)
}

function renderModernPreview(ctx: CanvasRenderingContext2D, width: number) {
  // Blue header background
  const gradient = ctx.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, '#2563eb')
  gradient.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, 70)

  // Name in header
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px Arial'
  ctx.fillText(sampleData.contact.name, 20, 30)

  // Contact info in header
  ctx.font = '9px Arial'
  ctx.fillText(`📧 ${sampleData.contact.email}`, 20, 45)
  ctx.fillText(`📱 ${sampleData.contact.phone}`, 20, 58)

  // Two column layout
  const leftWidth = width * 0.35
  const rightX = leftWidth + 10

  // Left column background
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 70, leftWidth, 330)

  // Skills in left column
  ctx.fillStyle = '#1e40af'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('SKILLS', 15, 95)

  // Skills list
  ctx.fillStyle = '#374151'
  ctx.font = '8px Arial'
  sampleData.skills.slice(0, 4).forEach((skill, i) => {
    ctx.fillText(`• ${skill}`, 15, 110 + i * 12)
  })

  // Education in left column
  ctx.fillStyle = '#1e40af'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('EDUCATION', 15, 175)

  ctx.fillStyle = '#374151'
  ctx.font = 'bold 8px Arial'
  ctx.fillText('University Name', 15, 190)
  ctx.font = '7px Arial'
  ctx.fillText('Bachelor\'s', 15, 202)
  ctx.fillText('Computer Science', 15, 212)

  // Experience in right column
  ctx.fillStyle = '#1e40af'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('EXPERIENCE', rightX, 95)

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 9px Arial'
  ctx.fillText('Senior Developer', rightX, 110)

  ctx.fillStyle = '#6b7280'
  ctx.font = '8px Arial'
  ctx.fillText('Tech Company', rightX, 125)
  ctx.fillText('Jan 2020 - Present', rightX, 138)

  // Experience description
  ctx.fillStyle = '#374151'
  ctx.font = '7px Arial'
  ctx.fillText('• Led development of web', rightX, 153)
  ctx.fillText('  applications', rightX, 163)
  ctx.fillText('• Collaborated with teams', rightX, 173)
}

function renderMinimalPreview(ctx: CanvasRenderingContext2D, width: number) {
  // Centered name
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 14px Arial'
  const nameWidth = ctx.measureText(sampleData.contact.name).width
  ctx.fillText(sampleData.contact.name, (width - nameWidth) / 2, 40)

  // Centered contact
  ctx.fillStyle = '#6b7280'
  ctx.font = '9px Arial'
  const contactText = `${sampleData.contact.email} • ${sampleData.contact.phone}`
  const contactWidth = ctx.measureText(contactText).width
  ctx.fillText(contactText, (width - contactWidth) / 2, 55)

  // Experience section with left border
  ctx.fillStyle = '#9ca3af'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('EXPERIENCE', 30, 90)

  // Left border line
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 100)
  ctx.lineTo(20, 180)
  ctx.stroke()

  // Experience entry
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('Senior Developer', 30, 110)

  ctx.fillStyle = '#6b7280'
  ctx.font = '9px Arial'
  ctx.fillText('Tech Company, New York, NY', 30, 125)
  ctx.fillText('Jan 2020 - Present', width - 100, 110)

  ctx.fillStyle = '#374151'
  ctx.font = '8px Arial'
  ctx.fillText('Led development of web applications and', 30, 140)
  ctx.fillText('collaborated with cross-functional teams.', 30, 152)

  // Education section
  ctx.fillStyle = '#9ca3af'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('EDUCATION', 30, 185)

  // Education left border
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 195)
  ctx.lineTo(20, 240)
  ctx.stroke()

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('Bachelor\'s Degree', 30, 205)

  ctx.fillStyle = '#6b7280'
  ctx.font = '9px Arial'
  ctx.fillText('University Name', 30, 220)
  ctx.fillText('2016 - 2020', width - 70, 205)

  // Skills section
  ctx.fillStyle = '#9ca3af'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('SKILLS', 30, 255)

  // Skills border
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(20, 265)
  ctx.lineTo(20, 285)
  ctx.stroke()

  ctx.fillStyle = '#374151'
  ctx.font = '8px Arial'
  ctx.fillText('JavaScript • React • Node.js • TypeScript • Python', 30, 275)
}

export function TemplatePreview({ templateId, templateName, isSelected, onClick }: TemplatePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for preview
    canvas.width = 300
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set default styles
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add border
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    switch (templateId) {
      case 'classic':
        renderClassicPreview(ctx, canvas.width)
        break
      case 'modern':
        renderModernPreview(ctx, canvas.width)
        break
      case 'minimal':
        renderMinimalPreview(ctx, canvas.width)
        break
      default:
        renderClassicPreview(ctx, canvas.width)
    }
  }, [templateId])


  return (
    <div 
      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="text-center mb-3">
        <h3 className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
          {templateName}
        </h3>
      </div>
      
      <div className="flex justify-center">
        <canvas 
          ref={canvasRef} 
          className="border border-gray-200 rounded-sm shadow-xs"
          style={{ width: '150px', height: '200px' }}
        />
      </div>
      
      {isSelected && (
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Selected
          </span>
        </div>
      )}
    </div>
  )
}