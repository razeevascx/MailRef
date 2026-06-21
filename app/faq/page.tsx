import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is a Relay email mask?',
      answer: 'Email masks are masked, or private, email addresses that forward messages to your true email address. These masks allow you to share an address with third parties which will mask your true email address and forward messages to it.',
    },
    {
      question: 'I\'m not getting messages from my email masks',
      answer: `There are a few reasons you might not be receiving emails forwarded through your masks. These reasons include:\n* Messages are going into spam\n* Your email provider is blocking your email masks\n* The email forwarded has an attachment larger than 10 MB\n* The site doesn\'t accept email masks\n* The mask might have forwarding turned off\n* Relay might be taking longer than usual to forward your messages\nIf you\'re struggling with any of these issues, please visit our support site.`,
    },
    {
      question: 'When should I use Relay email masks?',
      answer: 'You can use Relay email masks most places you\'d use your regular email address. We recommend using them when signing up for marketing/informational emails where you may want to control whether or not you receive emails in the future.',
    },
    {
      question: 'Why did my email masks start to use the domain "mozmail.com?"',
      answer: 'We made the switch from "relay.firefox.com" to "mozmail.com" in order to make it possible to get a custom email subdomain, such as mask@yourdomain.mozmail.com. Custom email subdomains, available to Relay Premium subscribers, allow you to generate easier-to-remember email masks.',
    },
    {
      question: 'Will Firefox Relay forward emails with attachments?',
      answer: 'We now support attachment forwarding. However, there is a 10 MB limit for email forwarding using Relay. Any emails larger than 10 MB will not be forwarded.',
    },
    {
      question: 'What happens to my custom subdomain if I unsubscribe from Relay Premium?',
      answer: 'If you downgrade from Relay Premium, you\'ll still receive emails forwarded through your custom email masks, but you\'ll no longer be able to create new masks using that sub-domain. If you have more than 50 masks in total, you will not be able to create any more. You\'ll also lose the ability to reply to forwarded messages. You can resubscribe to Relay Premium and regain access to these features.',
    },
  ];

  return (
    <div className="min-h-screen text-[#1A2440] dark:text-white py-24 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">

          <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-[#1A2440] dark:text-white mt-6">
            Frequently Asked Questions
          </h1>
          {/* <p className="text-sm font-light text-[#1A2440]/70 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            Learn how our serverless architecture, edge mail routing, and database security shield you from spammers and tracking.
          </p> */}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {faqs.map((faq, index) => (
            <div key={index} className="gradient-shell-wrapper shadow-sm">
              <div className="gradient-shell-inner p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-base font-semibold text-[#1A2440] dark:text-white font-sans leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-xs text-[#1A2440]/75 dark:text-slate-400 leading-relaxed font-light font-sans">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="gradient-shell-wrapper shadow-sm max-w-3xl mx-auto">
          <div className="gradient-shell-inner p-8 text-center space-y-4">
            <h3 className="text-lg font-semibold text-[#1A2440] dark:text-white font-sans">Take control of your inbox today</h3>
            <p className="text-[#1A2440]/70 dark:text-slate-300 text-xs font-light max-w-md mx-auto leading-relaxed">
              Create up to 5 email aliases completely free. Shield your primary mailbox from hackers and spammers in under 2 minutes.
            </p>
            <div className="pt-2">
              <Link href="/get-started">
                <Button className="bg-[#1A2440] hover:bg-[#1A2440]/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-[#1A2440] font-semibold rounded-[12px] px-8 h-10 border border-transparent text-xs shadow-sm">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
