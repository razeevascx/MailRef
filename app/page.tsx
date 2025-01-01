import React from 'react';
import { Shield, Mail, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features = [
  {
    icon: <Mail size={28} />,
    title: 'Email Masking',
    description:
      'Create unlimited email aliases that forward to your real inbox with built-in spam filtering.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Spam Guard',
    description:
      'Advanced encryption and security features protect your personal information across all services.',
  },
  {
    icon: <Mail size={28} />,
    title: 'Smart Forwarding',
    description:
      'Intelligent email routing with custom rules and automated filtering for enhanced privacy.',
  },
];

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="p-8 rounded-xl hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 hover:-translate-y-1">
    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Page = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" /> */}
      <div className="max-w-6xl mx-auto px-4 pt-20 ">
        <div className="text-center space-y-8">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer">
            Upcoming: Custom Domain Support
            <ChevronRight size={16} />
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mt-4">
            Protect Your Digital Identity
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Without Compromise
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Generate unlimited email aliases. Stay private online while managing
            everything from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="text-lg px-8 h-12 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
            >
              Join Now <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Everything you need to stay private online
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that protect your identity without sacrificing
              convenience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
