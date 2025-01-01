import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Page: React.FC = () => {
  const faqs = [
    {
      id: 'faq-1',
      question: 'What is MailRef?',
      answer:
        'MailRef is an email aliasing service that helps you protect your privacy by creating unique email addresses for every service you use.',
    },
    {
      id: 'faq-2',
      question: 'How does email aliasing work?',
      answer:
        'When you sign up for a service, you generate a unique email alias. Emails sent to this alias are forwarded to your real inbox, keeping your main email private.',
    },
    {
      id: 'faq-3',
      question: 'Can I block unwanted emails?',
      answer:
        'Yes. You can block specific aliases to stop receiving emails from services you no longer use.',
    },
    {
      id: 'faq-4',
      question: 'Is MailRef secure?',
      answer:
        'Yes. MailRef prioritizes your privacy and security. We do not track your activity or share your data with third parties.',
    },

    {
      id: 'faq-6',
      question: 'Is there a free plan available?',
      answer:
        'Yes. MailRef offers a free plan that includes basic email aliasing features. You can upgrade for more advanced options.',
    },
    {
      id: 'faq-7',
      question: 'How do I get started?',
      answer:
        'Getting started is simple. Sign up for a free account, create your first alias, and start using it right away.',
    },

    {
      id: 'faq-9',
      question: 'What happens if an alias is compromised?',
      answer:
        'You can disable the compromised alias immediately, ensuring that your real email and other aliases remain secure.',
    },
    {
      id: 'faq-10',
      question: 'Is MailRef responsive and mobile-friendly?',
      answer:
        'Yes. MailRef is fully responsive and works seamlessly on all devices, including smartphones, tablets, and desktops.',
    },
  ];

  return (
    <div className="min-h-screen  py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about MailRef's features and
            functionality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Featured FAQs */}
          <div className="grid gap-6">
            {faqs.slice(0, 2).map((faq) => (
              <div
                key={faq.id}
                className="p-6 rounded-xl hover:shadow-md transition-shadow"
              >
                <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  {faq.question}
                </h2>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {' '}
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Full FAQ Accordion */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">More Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.slice(2).map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;
