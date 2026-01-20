'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Resume } from '@/lib/types/database'
import { ClassicTemplate } from '@/components/resume-templates/classic-template'
import { ModernTemplate } from '@/components/resume-templates/modern-template'
import { MinimalTemplate } from '@/components/resume-templates/minimal-template'
import { ProfessionalTemplate } from '@/components/resume-templates/professional-template'
import { CreativeTemplate } from '@/components/resume-templates/creative-template'
import { ExecutiveTemplate } from '@/components/resume-templates/executive-template'
import { JakeTemplate } from '@/components/resume-templates/jake-template'
import { Eye, Download, ArrowLeft, Loader2, Edit } from 'lucide-react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const templates = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'modern', name: 'Modern', component: ModernTemplate },
  { id: 'minimal', name: 'Minimal', component: MinimalTemplate },
  { id: 'professional', name: 'Professional', component: ProfessionalTemplate },
  { id: 'creative', name: 'Creative', component: CreativeTemplate },
  { id: 'executive', name: 'Executive', component: ExecutiveTemplate },
  { id: 'jake', name: 'Jake (LaTeX)', component: JakeTemplate },
]

export default function ResumeViewPage() {
  const params = useParams()
  const [resume, setResume] = useState<Resume | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [loading, setLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', params.id)
          .single()

        if (!error && data) {
          setResume(data)
          setSelectedTemplate(data.template_id || 'classic')
        }
      } catch (error) {
        console.error('Error fetching resume:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchResumeData()
  }, [params.id, supabase])

  const handleDownload = async () => {
    if (!resume) return

    setIsGeneratingPDF(true)

    try {
      // Get the resume container element
      const resumeElement = document.querySelector('.resume-container') as HTMLElement
      if (!resumeElement) {
        console.error('Resume container not found')
        return
      }

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(resumeElement, {
        useCORS: true, // Enable cross-origin images
        logging: false, // Disable console logging
      })

      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: imgHeight > 297 ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      // Add the image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0)

      // Check if content needs multiple pages
      const pageHeight = 297 // A4 height in mm
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Generate filename with job title and date
      const fileName = `${resume.job_title.replace(/\s+/g, '_')}_Resume_${new Date().toISOString().split('T')[0]}.pdf`

      // Save the PDF
      pdf.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading resume...</div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="p-8">
        <div className="text-center">Resume not found</div>
      </div>
    )
  }

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || ClassicTemplate

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Controls */}
      <div className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/documents" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4" />
                Back to Documents
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{resume.job_title}</h1>
                <p className="text-sm text-gray-500">
                  Created {new Date(resume.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Template Selector */}
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="rounded-md border-gray-300 text-sm"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/documents/${params.id}/edit`}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <Link
                  href={`/preview/${params.id}?template=${selectedTemplate}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Link>
                <button
                  onClick={handleDownload}
                  title="To be implemented in future"
                  disabled={true}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="py-8">
        <div className="resume-container max-w-none px-8">
          <SelectedTemplateComponent
            data={resume.generated_data}
            settings={resume.generation_settings}
          />
        </div>
      </div>
    </div>
  )
}