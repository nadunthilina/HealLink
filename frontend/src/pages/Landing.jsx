import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StarRating from '../components/StarRating'
import FAQItem from '../components/FAQItem'

export default function Landing() {
  const [rating, setRating] = useState(3)

  return (
  <div className="text-slate-800 font-sans">
      <Navbar />

      {/* Hero */}
  <section id="home" className="w-full py-16">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Revolutionizing Caretaker and Patient Management</h1>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-prose">A mobile-responsive web-based solution designed to transform caretaker coordination in Sri Lanka. Manage caretaker records, assign schedules efficiently, and enable patients and families to connect with available caretakers in real time.</p>
        <div className="mt-6">
          <a href="#services" className="inline-flex items-center rounded-full bg-[#0B24FB] hover:bg-[#0519d9] text-white px-6 py-3 shadow-lg">Get Started</a>
        </div>

        <div className="mt-10 flex flex-wrap justify-start gap-6">
          <div className="min-w-[220px] rounded-2xl bg-[#0B24FB] text-white p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-lg p-2">
                <span>🕒</span>
              </div>
              <div>
                <h4 className="font-semibold">24 hour service</h4>
                <p className="text-blue-100 text-sm mt-1">Always available for uninterrupted patient care.</p>
              </div>
            </div>
          </div>
          <div className="min-w-[220px] rounded-2xl bg-[#0B24FB] text-white p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-lg p-2">
                <span>⚙️</span>
              </div>
              <div>
                <h4 className="font-semibold">Smart Scheduling</h4>
                <p className="text-blue-100 text-sm mt-1">Automated caretaker assignments with conflict detection.</p>
              </div>
            </div>
          </div>
          <div className="min-w-[220px] rounded-2xl bg-[#0B24FB] text-white p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-lg p-2">
                <span>💬</span>
              </div>
              <div>
                <h4 className="font-semibold">Better Communication</h4>
                <p className="text-blue-100 text-sm mt-1">Instant alerts and notifications between admins, caretakers, and families.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <img src="/images/Hero.webp" alt="Nurse with patient" className="w-80 md:w-[400px] lg:w-[450px] object-contain drop-shadow-xl" />
      </div>
    </div>
  </section>

      {/* About */}
  <section id="about" className="w-full py-16">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12">
      <h2 className="text-center text-blue-700 text-2xl font-bold mb-6">About Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-gray-700 leading-relaxed">HealLink is an innovative caretaker management system developed to support Harshi Nursing Service in collaboration with Badulla Hospital. Our goal is to replace outdated manual caretaker record-keeping and scheduling with a modern, digital solution.</p>
          <p className="mt-4 text-gray-700 leading-relaxed">Developed by a team of students from the Faculty of Computing, Sabaragamuwa University of Sri Lanka, HealLink addresses key challenges faced by caretaker providers and patients. By streamlining operations with real-time scheduling, profile management, and communication features, the system ensures better patient care, reduces errors, and improves efficiency.</p>

          <div className="mt-6 bg-[#EEF3FF] p-6 rounded-2xl">
            <p className="font-semibold">Branches:</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Badulla</li>
              <li>Ampara</li>
            </ul>
            <p className="font-semibold mt-4">Phone Numbers:</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>077 8926365</li>
              <li>076 4353335</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="bg-[#EEF3FF] p-8 rounded-2xl">
            <img src="/images/about.png" alt="Nurse pushing wheelchair" className="w-64 md:w-80 lg:w-96 object-contain" />
          </div>
        </div>
      </div>
    </div>
  </section>

      {/* Services */}
    <section id="services" className="w-full bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Comprehensive healthcare management solutions designed to revolutionize caretaker coordination and patient care delivery</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-3xl shadow-xl">
              <img
                src="/images/service.png"
                alt="Healthcare services illustration"
                className="w-full h-auto max-h-96 object-contain"
                loading="lazy"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              🏥 HEALTHCARE INNOVATION
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Transforming Patient Care Through Technology</h3>
            <p className="text-lg text-gray-600 leading-relaxed">Our platform integrates cutting-edge technology with compassionate care, ensuring seamless coordination between healthcare providers, caretakers, and families.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Real-time coordination</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Automated scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Quality assurance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">Caretaker Management</h4>
            <p className="text-gray-600 mb-6 leading-relaxed">Comprehensive profile management system with skill verification, certification tracking, and performance analytics.</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
              Manage Profiles
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">Smart Scheduling</h4>
            <p className="text-gray-600 mb-6 leading-relaxed">AI-powered scheduling system with conflict detection, workload balancing, and automated shift assignments.</p>
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
              View Schedules
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 md:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold  mb-3">Communication Hub</h4>
            <p className="text-gray-600 mb-6 leading-relaxed">Integrated messaging system with real-time notifications, family updates, and emergency communication protocols.</p>
            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
              Start Messaging
            </button>
          </div>
        </div>
      </div>
    </section>

      {/* Testimonials & Feedback */}
      <section className="w-full bg-white py-20">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900  mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Real feedback from healthcare professionals and families using HealLink</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Dr. Sarah Mitchell</h4>
                  <p className="text-gray-600">Badulla Hospital</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic">"HealLink has transformed how we coordinate care. The scheduling system is intuitive and has reduced conflicts by 80%."</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Amara Perera</h4>
                  <p className="text-gray-600">Professional Caretaker</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic">"Managing my schedule and connecting with families has never been easier. The app keeps me organized and informed."</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Rajitha Fernando</h4>
                  <p className="text-gray-600">Family Member</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic">"Peace of mind knowing we can easily communicate with our mother's caretaker and get real-time updates."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
  <section id="feedback" className="w-full bg-gradient-to-b from-blue-50 to-white py-20">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Share Your Experience</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your feedback helps us improve our services and better serve the healthcare community</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg" 
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg" 
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg" 
                placeholder="+94 77 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User Type</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg">
                <option>Select your role</option>
                <option>Patient / Family Member</option>
                <option>Professional Caretaker</option>
                <option>Healthcare Provider</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rate Our Service</label>
            <div className="flex items-center gap-2">
              <StarRating value={rating} onChange={setRating} />
              <span className="ml-2 text-gray-600">({rating} out of 5 stars)</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback</label>
            <textarea 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg resize-none" 
              rows="5"
              placeholder="Tell us about your experience with HealLink..."
            />
          </div>

          <div className="mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"/>
              <span className="text-gray-700">I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and <a href="#" className="text-primary hover:underline">Terms of Service</a></span>
            </label>
          </div>

          <div className="text-center">
            <button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>

      {/* FAQ */}
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to know about HealLink and how it works</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <FAQItem question="How do I book a caretaker through HealLink?" defaultOpen>
                <p className="text-gray-600 leading-relaxed">Patients and families can easily search through our verified caretaker directory using filters for location, specialization, and availability. Simply browse profiles, view ratings and certifications, then send a booking request directly through the platform. Our system will match you with the most suitable caretakers based on your specific needs.</p>
              </FAQItem>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <FAQItem question="Can caretakers manage their own availability and schedules?">
                <p className="text-gray-600 leading-relaxed">Yes, caretakers have full control over their schedules through their personalized dashboard. They can set their availability, block out time slots, update their status in real-time, and manage multiple bookings. The system automatically prevents double-bookings and sends notifications for schedule changes.</p>
              </FAQItem>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <FAQItem question="What types of notifications and reminders does the system provide?">
                <p className="text-gray-600 leading-relaxed">HealLink sends automated reminders via SMS and email for upcoming shifts, schedule changes, and important updates. Families receive notifications about caretaker arrivals, medication reminders, and daily care reports. All notifications are customizable and can be adjusted based on user preferences.</p>
              </FAQItem>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <FAQItem question="How does HealLink ensure caretaker quality and reliability?">
                <p className="text-gray-600 leading-relaxed">We maintain strict verification processes including background checks, certification validation, and continuous performance monitoring. All caretakers undergo skills assessment, and we collect feedback from families to maintain service quality. Our rating system helps families make informed decisions when selecting caretakers.</p>
              </FAQItem>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <FAQItem question="Is there 24/7 support available for emergencies?">
                <p className="text-gray-600 leading-relaxed">Yes, HealLink provides round-the-clock support with dedicated emergency contacts for urgent situations. Our support team is available via phone, chat, and emergency hotline to assist with immediate needs, schedule emergencies, or technical issues that may arise at any time.</p>
              </FAQItem>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <FAQItem question="What areas does HealLink currently serve in Sri Lanka?">
                <p className="text-gray-600 leading-relaxed">HealLink currently operates in Badulla and Ampara districts, with plans to expand to other regions. We work closely with Badulla Hospital and Harshi Nursing Service to provide comprehensive coverage. Contact us at 077 8926365 or 076 4353335 to check availability in your specific area.</p>
              </FAQItem>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Our support team is here to help you get started with HealLink and answer any specific questions about our services.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+94778926365" className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  📞 Call: 077 8926365
                </a>
                <a href="#contact" className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                  💬 Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      <Footer />
    </div>
  )
}
