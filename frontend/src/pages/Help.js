import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { ChevronDown, ChevronUp, Mail, Clock } from 'lucide-react';

const FAQS = [
  {
    question: 'How does Reclaim Africa work?',
    answer: 'We help you discover and recover unclaimed financial assets in Nigeria. You submit your claim, we review it, and we guide you through the recovery process. We only charge a success fee when you receive your money.'
  },
  {
    question: 'How much does it cost?',
    answer: 'We charge a success fee only when we recover your money. Guided Self Recovery is 10 percent with a minimum of 5000 naira. Partial Manual Recovery is 15 percent. There is no upfront payment.'
  },
  {
    question: 'What documents do I need?',
    answer: 'It depends on your situation. If the shareholder is alive, you need your ID and share certificate if available. If the shareholder is deceased, you may need a death certificate, will or letter of administration. Do not worry if you are missing documents. We will guide you.'
  },
  {
    question: 'How long does recovery take?',
    answer: 'It varies by case. Simple cases can take 4 to 8 weeks. Complex cases involving deceased shareholders or disputes may take longer. We will keep you updated every step of the way.'
  },
  {
    question: 'Is my information safe?',
    answer: 'Yes. Your personal information is kept strictly confidential and is only used to process your claim.'
  },
  {
    question: 'What if my family members are in a dispute?',
    answer: 'We pause the claim until all beneficiaries reach a legal agreement or a court order is provided. We do not take sides.'
  },
  {
    question: 'What is a success fee?',
    answer: 'A success fee means you pay nothing upfront. We only take our percentage after your money has been successfully recovered and paid to you. If we recover nothing, you owe us nothing.'
  },
  {
    question: 'Can I track my claim?',
    answer: 'Yes. After you create an account and submit your claim, you can log in anytime to check the status of your case.'
  }
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#0A0908', minHeight: '100vh' }}>
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="help-title"
          >
            Help Center
          </h1>
          <p className="text-lg text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="help-subtitle">
            We are here to help you recover what is yours.
          </p>
        </div>

        <div className="mb-12 space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-left transition-all duration-300 hover:bg-[#1A1815]"
              >
                <h3 className="text-lg font-bold text-white pr-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp size={24} style={{ color: '#D4AF37', flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={24} style={{ color: '#A3A099', flexShrink: 0 }} />
                )}
              </button>
              {openIndex === index && (
                <div
                  className="px-6 pb-6 border-t"
                  style={{ borderColor: '#2B2823' }}
                  data-testid={`faq-answer-${index}`}
                >
                  <p className="text-[#A3A099] pt-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
          data-testid="contact-founder"
        >
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Still have questions?
          </h2>
          <p className="text-[#A3A099] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Contact our founder directly.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={20} style={{ color: '#D4AF37' }} />
              <a
                href="mailto:reclaimafrica.founder@gmail.com"
                className="text-white hover:text-[#D4AF37] transition-colors duration-300"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                reclaimafrica.founder@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} style={{ color: '#D4AF37' }} />
              <span className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Response time: Within 24 hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
