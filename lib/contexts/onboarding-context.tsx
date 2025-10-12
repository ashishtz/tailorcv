'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Profile, Skill, WorkExperience, Education, Project } from '@/lib/types/database'

interface OnboardingData {
  personalInfo: Partial<Profile>
  skills: Skill[]
  workExperiences: WorkExperience[]
  education: Education[]
  projects: Project[]
}

interface OnboardingContextType {
  currentStep: number
  data: OnboardingData
  setCurrentStep: (step: number) => void
  updatePersonalInfo: (info: Partial<Profile>) => void
  updateSkills: (skills: Skill[]) => void
  addWorkExperience: (experience: Omit<WorkExperience, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  updateWorkExperience: (index: number, experience: Partial<WorkExperience>) => void
  removeWorkExperience: (index: number) => void
  addEducation: (education: Omit<Education, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  updateEducation: (index: number, education: Partial<Education>) => void
  removeEducation: (index: number) => void
  addProject: (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  updateProject: (index: number, project: Partial<Project>) => void
  removeProject: (index: number) => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    personalInfo: {},
    skills: [],
    workExperiences: [],
    education: [],
    projects: [],
  })

  const updatePersonalInfo = (info: Partial<Profile>) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...info } }))
  }

  const updateSkills = (skills: Skill[]) => {
    setData(prev => ({ ...prev, skills }))
  }

  const addWorkExperience = (experience: Omit<WorkExperience, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newExperience = {
      ...experience,
      id: crypto.randomUUID(),
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as WorkExperience
    setData(prev => ({ ...prev, workExperiences: [...prev.workExperiences, newExperience] }))
  }

  const updateWorkExperience = (index: number, experience: Partial<WorkExperience>) => {
    setData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) => 
        i === index ? { ...exp, ...experience } : exp
      ),
    }))
  }

  const removeWorkExperience = (index: number) => {
    setData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
    }))
  }

  const addEducation = (education: Omit<Education, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newEducation = {
      ...education,
      id: crypto.randomUUID(),
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Education
    setData(prev => ({ ...prev, education: [...prev.education, newEducation] }))
  }

  const updateEducation = (index: number, education: Partial<Education>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, ...education } : edu
      ),
    }))
  }

  const removeEducation = (index: number) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addProject = (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newProject = {
      ...project,
      id: crypto.randomUUID(),
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Project
    setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }))
  }

  const updateProject = (index: number, project: Partial<Project>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, ...project } : proj
      ),
    }))
  }

  const removeProject = (index: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  return (
    <OnboardingContext.Provider value={{
      currentStep,
      data,
      setCurrentStep,
      updatePersonalInfo,
      updateSkills,
      addWorkExperience,
      updateWorkExperience,
      removeWorkExperience,
      addEducation,
      updateEducation,
      removeEducation,
      addProject,
      updateProject,
      removeProject,
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}