import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import { Resume } from '@/lib/types/database'
import { renderFormattedContent } from '@/lib/utils/render-content'

interface CreativeTemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
}

export function CreativeTemplate({ data, settings }: CreativeTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 w-full shadow-lg font-poppins" style={{ minHeight: '11in' }}>
      {/* Header Section */}
      <header className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white opacity-10 rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 tracking-wide">{data.contact.name}</h1>
          <div className="w-24 h-1 bg-white mb-4"></div>
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>{data.contact.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>{data.contact.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{data.contact.location}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-8">
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 relative">
                About Me
                <span className="absolute -bottom-1 left-0 w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></span>
              </h2>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-400">
              {renderFormattedContent(data.summary, settings?.summary_format)}
            </div>
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Skills & Education */}
          <div className="space-y-8">
            {/* Skills Section */}
            {data.skills.length > 0 && (
              <section>
                <div className="relative mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 relative">
                    Skills
                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></span>
                  </h2>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  {typeof data.skills[0] === 'string' ? (
                    <div className="flex flex-wrap gap-2">
                      {(data.skills as string[]).map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-semibold rounded-full border border-purple-200 hover:shadow-md transition-shadow"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(data.skills as Array<{ category: string; skills: string[] }>).map((category, index) => (
                        <div key={index}>
                          <h3 className="font-bold text-purple-700 mb-2">{category.category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-semibold rounded-full border border-purple-200 hover:shadow-md transition-shadow"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Education Section */}
            {data.education.length > 0 && (
              <section>
                <div className="relative mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 relative">
                    Education
                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-10 -mt-10"></div>
                      <div className="relative">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{edu.degree}</h3>
                        <p className="text-purple-600 font-semibold">{edu.institution}</p>
                        <p className="text-gray-600 text-sm">{edu.field}</p>
                        <p className="text-gray-500 text-sm mt-2">{edu.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Work Experience Section */}
            {data.workExperience.length > 0 && (
              <section>
                <div className="relative mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 relative">
                    Experience
                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></span>
                  </h2>
                </div>
                <div className="space-y-6">
                  {data.workExperience.map((exp, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-12 -mt-12"></div>
                      <div className="relative">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-800 text-xl mb-1">{exp.position}</h3>
                            <p className="text-purple-600 font-semibold text-lg">{exp.company}</p>
                            <p className="text-gray-600">{exp.location}</p>
                          </div>
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-semibold rounded-full mt-2 sm:mt-0">
                            {exp.duration}
                          </span>
                        </div>
                        <div className="text-sm">
                          {renderFormattedContent(exp.description, settings?.work_experience_format)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {data.projects.length > 0 && (
              <section>
                <div className="relative mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 relative">
                    Projects
                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></span>
                  </h2>
                </div>
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -ml-8 -mt-8"></div>
                      <div className="relative">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-800 text-xl">{project.name}</h3>
                            {project.role && <p className="text-purple-600 font-semibold">{project.role}</p>}
                          </div>
                          {project.link && (
                            <a href={project.link} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-semibold rounded-full hover:shadow-lg transition-shadow" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </a>
                          )}
                        </div>
                        <div className="text-sm">
                          {renderFormattedContent(project.description, settings?.projects_format)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}