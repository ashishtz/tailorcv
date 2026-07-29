import { Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'
import { Resume } from '@/lib/types/database'
import { renderFormattedContent } from '@/lib/utils/render-content'

interface ExecutiveTemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
}

export function ExecutiveTemplate({ data, settings }: ExecutiveTemplateProps) {
  return (
    <div className="bg-white w-full shadow-lg font-serif" style={{ minHeight: '11in' }}>
      {/* Header Section */}
      <header className="bg-linear-to-r from-slate-900 to-slate-800 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 border border-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 border border-white/10 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-3 tracking-wide">{data.contact.name}</h1>
          <div className="flex items-center mb-6">
            <div className="w-16 h-0.5 bg-amber-400 mr-4"></div>
            <div className="text-xl text-amber-400 font-semibold">Executive Profile</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-amber-400" />
              <span className="font-medium">{data.contact.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-amber-400" />
              <span className="font-medium">{data.contact.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-amber-400" />
              <span className="font-medium">{data.contact.location}</span>
            </div>
          </div>
          {(data.contact.socialLinks?.linkedin || data.contact.socialLinks?.github || data.contact.socialLinks?.stackoverflow) && (
            <div className="flex gap-4 mt-4">
              {data.contact.socialLinks?.linkedin && (
                <a href={data.contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-white transition-colors">
                  <LinkedInIcon className="w-5 h-5" />
                </a>
              )}
              {data.contact.socialLinks?.github && (
                <a href={data.contact.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-white transition-colors">
                  <GitHubIcon className="w-5 h-5" />
                </a>
              )}
              {data.contact.socialLinks?.stackoverflow && (
                <a href={data.contact.socialLinks.stackoverflow} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-white transition-colors">
                  <StackOverflowIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="p-10">
        {/* Executive Summary */}
        {data.summary && (
          <section className="mb-10">
            <div className="flex items-center mb-6">
              <Briefcase className="w-6 h-6 mr-4 text-amber-600" />
              <h2 className="text-2xl font-bold text-slate-800 relative">
                Executive Summary
              </h2>
              <div className="flex-1 ml-4 border-t-2 border-amber-600"></div>
            </div>
            <div className="bg-slate-50 border-l-4 border-amber-600 p-6 italic text-lg leading-relaxed">
              {renderFormattedContent(data.summary, settings?.summary_format)}
            </div>
          </section>
        )}

        {/* Core Competencies */}
        {data.skills.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 mr-4 text-amber-600" />
              <h2 className="text-2xl font-bold text-slate-800 relative">
                Core Competencies
              </h2>
              <div className="flex-1 ml-4 border-t-2 border-amber-600"></div>
            </div>
            {typeof data.skills[0] === 'string' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(data.skills as string[]).map((skill, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center hover:bg-amber-50 hover:border-amber-200 transition-colors"
                  >
                    <span className="font-semibold text-slate-700">{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {(data.skills as Array<{ category: string; skills: string[] }>).map((category, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-amber-700 mb-3">{category.category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {category.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center hover:bg-amber-50 hover:border-amber-200 transition-colors"
                        >
                          <span className="font-semibold text-slate-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Professional Experience */}
        {data.workExperience.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center mb-6">
              <Briefcase className="w-6 h-6 mr-4 text-amber-600" />
              <h2 className="text-2xl font-bold text-slate-800 relative">
                Professional Experience
              </h2>
              <div className="flex-1 ml-4 border-t-2 border-amber-600"></div>
            </div>
            <div className="space-y-8">
              {data.workExperience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="bg-slate-50 rounded-lg p-8 border-l-4 border-amber-600">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                      <div className="lg:col-span-3">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{exp.position}</h3>
                        <div className="text-xl text-amber-600 font-semibold mb-1">{exp.company}</div>
                        <div className="text-slate-600 font-medium">{exp.location}</div>
                      </div>
                      <div className="lg:text-right">
                        <span className="inline-block bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      {renderFormattedContent(exp.description, settings?.work_experience_format)}
                    </div>
                  </div>
                  {index < data.workExperience.length - 1 && (
                    <div className="flex justify-center my-6">
                      <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Layout for Education & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Education Section */}
          {data.education.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 mr-4 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-800">Education</h2>
                <div className="flex-1 ml-4 border-t border-amber-600"></div>
              </div>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{edu.degree}</h3>
                    <div className="text-amber-600 font-semibold mb-1">{edu.institution}</div>
                    <div className="text-slate-600 mb-2">{edu.field}</div>
                    <div className="text-sm text-slate-500 font-medium">{edu.duration}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {data.projects.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <Briefcase className="w-6 h-6 mr-4 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-800">Key Projects</h2>
                <div className="flex-1 ml-4 border-t border-amber-600"></div>
              </div>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{project.name}</h3>
                        {project.role && <div className="text-amber-600 font-semibold text-sm">{project.role}</div>}
                      </div>
                      {project.link && (
                        <a href={project.link} className="text-amber-600 hover:text-amber-700 font-semibold text-sm underline" target="_blank" rel="noopener noreferrer">
                          View Project
                        </a>
                      )}
                    </div>
                    <div className="text-sm">
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