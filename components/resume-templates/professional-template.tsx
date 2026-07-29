import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'
import { Resume } from '@/lib/types/database'
import { renderFormattedContent } from '@/lib/utils/render-content'

interface ProfessionalTemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
}

export function ProfessionalTemplate({ data, settings }: ProfessionalTemplateProps) {
  return (
    <div className="bg-white w-full shadow-lg font-inter" style={{ minHeight: '11in' }}>
      {/* Header Section with Sidebar */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-slate-800 text-white p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{data.contact.name}</h1>
            <div className="w-12 h-1 bg-blue-400 mb-6"></div>
          </div>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">Contact</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="w-4 h-4 mr-3 mt-0.5 text-blue-300 shrink-0" />
                <span className="text-sm break-all">{data.contact.email}</span>
              </div>
              <div className="flex items-start">
                <Phone className="w-4 h-4 mr-3 mt-0.5 text-blue-300 shrink-0" />
                <span className="text-sm">{data.contact.phone}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 text-blue-300 shrink-0" />
                <span className="text-sm">{data.contact.location}</span>
              </div>
              {data.contact.address && (
                <div className="flex items-start">
                  <Globe className="w-4 h-4 mr-3 mt-0.5 text-blue-300 shrink-0" />
                  <span className="text-sm">{data.contact.address}</span>
                </div>
              )}
              {data.contact.socialLinks?.linkedin && (
                <a href={data.contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-300 hover:text-white transition-colors">
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              )}
              {data.contact.socialLinks?.github && (
                <a href={data.contact.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-300 hover:text-white transition-colors">
                  <GitHubIcon className="w-4 h-4" />
                </a>
              )}
              {data.contact.socialLinks?.stackoverflow && (
                <a href={data.contact.socialLinks.stackoverflow} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-300 hover:text-white transition-colors">
                  <StackOverflowIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </section>

          {/* Skills Section */}
          {data.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">Skills</h2>
              {typeof data.skills[0] === 'string' ? (
                <div className="flex flex-wrap gap-1">
                  {(data.skills as string[]).map((skill, index) => (
                    <span key={index} className="text-xs bg-slate-700 px-2 py-1 rounded-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(data.skills as Array<{ category: string; skills: string[] }>).map((category, index) => (
                    <div key={index}>
                      <h3 className="text-xs font-semibold text-blue-200 mb-2 uppercase tracking-wide">{category.category}</h3>
                      <div className="flex flex-wrap gap-1">
                        {category.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="text-xs bg-slate-700 px-2 py-1 rounded-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-sm">{edu.degree}</h3>
                    <p className="text-xs text-slate-300 mb-1">{edu.institution}</p>
                    <p className="text-xs text-slate-300">{edu.field}</p>
                    <p className="text-xs text-blue-300 mt-1">{edu.duration}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8">
          {/* Professional Summary */}
          {data.summary && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-1">Professional Profile</h2>
              <div className="w-16 h-0.5 bg-blue-400 mb-4"></div>
              <div className="text-gray-700">
                {renderFormattedContent(data.summary, settings?.summary_format)}
              </div>
            </section>
          )}

          {/* Work Experience Section */}
          {data.workExperience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-1">Professional Experience</h2>
              <div className="w-16 h-0.5 bg-blue-400 mb-4"></div>
              <div className="space-y-6">
                {data.workExperience.map((exp, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute left-0 top-1 w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div className="absolute left-1.5 top-4 w-0.5 h-full bg-slate-200"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{exp.position}</h3>
                        <p className="text-blue-600 font-semibold">{exp.company}</p>
                        <p className="text-gray-600 text-sm">{exp.location}</p>
                      </div>
                      <span className="text-sm text-gray-500 bg-slate-100 px-3 py-1 rounded-sm">{exp.duration}</span>
                    </div>
                    <div className="text-sm mt-2">
                      {renderFormattedContent(exp.description, settings?.work_experience_format)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {data.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Key Projects</h2>
              <div className="w-16 h-0.5 bg-blue-400 mb-4"></div>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800">{project.name}</h3>
                        {project.role && <p className="text-blue-600 text-sm font-semibold">{project.role}</p>}
                      </div>
                      {project.link && (
                        <a href={project.link} className="text-blue-600 hover:text-blue-700 text-sm underline" target="_blank" rel="noopener noreferrer">
                          View Project
                        </a>
                      )}
                    </div>
                    <div className="text-sm mt-1">
                      {renderFormattedContent(project.description, settings?.projects_format)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}