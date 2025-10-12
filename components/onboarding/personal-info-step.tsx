'use client'

import { useState } from 'react'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { useRouter } from 'next/navigation'

export function PersonalInfoStep() {
  const { data, updatePersonalInfo, setCurrentStep } = useOnboarding()
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: data.personalInfo.first_name || '',
    last_name: data.personalInfo.last_name || '',
    email: data.personalInfo.email || '',
    phone: data.personalInfo.phone || '',
    birthday: data.personalInfo.birthday || '',
    location: data.personalInfo.location || '',
    address_1: data.personalInfo.address_1 || '',
    address_2: data.personalInfo.address_2 || '',
    address_3: data.personalInfo.address_3 || '',
    postal_code: data.personalInfo.postal_code || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updatePersonalInfo(formData)
    setCurrentStep(2)
    router.push('/onboarding/skills')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
            Birthday *
          </label>
          <input
            type="date"
            name="birthday"
            id="birthday"
            required
            value={formData.birthday}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            placeholder="City, State/Country"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address_1" className="block text-sm font-medium text-gray-700">
            Address Line 1 (Optional)
          </label>
          <input
            type="text"
            name="address_1"
            id="address_1"
            value={formData.address_1}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address_2" className="block text-sm font-medium text-gray-700">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            name="address_2"
            id="address_2"
            value={formData.address_2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address_3" className="block text-sm font-medium text-gray-700">
            Address Line 3 (Optional)
          </label>
          <input
            type="text"
            name="address_3"
            id="address_3"
            value={formData.address_3}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
            Postal Code (Optional)
          </label>
          <input
            type="text"
            name="postal_code"
            id="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>
    </form>
  )
}