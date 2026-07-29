import { Resume } from '@/lib/types/database'
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'
import { renderFormattedContent } from '@/lib/utils/render-content'

interface ModernTemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
}

export function ModernTemplate({ data, settings }: ModernTemplateProps) {
  return (
    <div className="bg-white p-8 w-full shadow-lg font-poppins" style={{ minHeight: '11in' }}>
      {/* Header Section */}
      <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-8 -m-8 mb-6">
        <h1 className="text-4xl font-bold mb-4">{data.contact.name}</h1>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{data.contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{data.contact.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{data.contact.location}</span>
          </div>
          {data.contact.socialLinks?.linkedin && (
            <a href={data.contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <LinkedInIcon className="w-4 h-4" />
            </a>
          )}
          {data.contact.socialLinks?.github && (
            <a href={data.contact.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <GitHubIcon className="w-4 h-4" />
            </a>
          )}
          {data.contact.socialLinks?.stackoverflow && (
            <a href={data.contact.socialLinks.stackoverflow} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <StackOverflowIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">PROFESSIONAL SUMMARY</h2>
          {renderFormattedContent(data.summary, settings?.summary_format)}
        </section>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Skills & Education */}
        <div className="col-span-1 space-y-6">
          {/* Skills Section */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">SKILLS</h2>
              {typeof data.skills[0] === 'string' ? (
                <div className="space-y-1">
                  {(data.skills as string[]).map((skill, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      • {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(data.skills as Array<{ category: string; skills: string[] }>).map((category, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-blue-600 text-sm mb-1">{category.category}</h3>
                      <div className="space-y-1">
                        {category.skills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="text-sm text-gray-700">
                            • {skill}
                          </div>
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
              <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">EDUCATION</h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800 text-sm">{edu.institution}</h3>
                    <p className="text-xs text-gray-600">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.field}</p>
                    <p className="text-xs text-gray-500 mt-1">{edu.duration}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Experience & Projects */}
        <div className="col-span-2 space-y-6">
          {/* Work Experience Section */}
          {data.workExperience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">EXPERIENCE</h2>
              <div className="space-y-4">
                {data.workExperience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{exp.position}</h3>
                        <p className="text-sm text-gray-600 font-semibold">{exp.company} • {exp.location}</p>
                      </div>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
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
              <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">PROJECTS</h2>
              <div className="space-y-3">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{project.name}</h3>
                        {project.role && <p className="text-sm text-gray-600 font-semibold">{project.role}</p>}
                      </div>
                      {project.link && (
                        <a href={project.link} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="w-4 h-4" />
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