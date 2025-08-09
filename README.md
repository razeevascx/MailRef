<div align="center">

# MAILREF

_Unleashing Privacy Through Seamless Email Masking & Protection_

![Last Commit](https://img.shields.io/github/last-commit/razeevascx/MailRef?label=last%20commit&color=blue&style=flat-square)
![TypeScript](https://img.shields.io/badge/typescript-100%25-blue?style=flat-square)
![Languages](https://img.shields.io/github/languages/count/razeevascx/MailRef?label=languages&color=orange&style=flat-square)

**Built with the tools and technologies:**

![Next.js](https://img.shields.io/badge/-Next.js-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/-React-blue?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

![Shadcn UI](https://img.shields.io/badge/-Shadcn%20UI-000000?style=flat-square&logo=shadcnui)
![React Hook Form](https://img.shields.io/badge/-React%20Hook%20Form-EC5990?style=flat-square&logo=react-hook-form)
![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat-square&logo=zod)
![Resend](https://img.shields.io/badge/-Resend-000000?style=flat-square&logo=resend)
![Lucide](https://img.shields.io/badge/-Lucide-F56565?style=flat-square&logo=lucide)

</div>

## Key Features

- **🎭 Email Masking** - Create unlimited email aliases that forward to your real inbox with built-in spam filtering
- **🛡️ Spam Guard** - Advanced encryption and security features protect your personal information across all services
- **🔄 Smart Forwarding** - Intelligent email routing with custom rules and automated filtering for enhanced privacy
- **🔐 Secure Authentication** - Supabase-powered authentication with OTP verification and social login options
- **🎨 Modern UI** - Beautiful, responsive interface built with Radix UI components and Tailwind CSS
- **⚡ Real-time Updates** - Instant notifications and updates powered by Supabase real-time subscriptions

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript 5
- **Styling:** Tailwind CSS, Radix UI Components, Lucide Icons
- **Backend:** Supabase (Authentication, Database, Real-time)
- **Email:** Resend API, React Email Components
- **Forms:** React Hook Form, Zod Validation
- **Animation:** Framer Motion, Tailwind Animate
- **Development:** ESLint, PostCSS, TypeScript

## Setup

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/razeevascx/MailRef.git
   ```

2. **Navigate to Project**

   ```bash
   cd MailRef
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Configure Environment**

   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

6. **Verify Installation**
   - Open browser: http://localhost:3000
   - Check that the MailRef homepage loads correctly
   - Test authentication flow if Supabase is configured

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Contributing

We welcome contributions! Please follow these steps:

### 1. Report Bugs

- Create a [new issue](https://github.com/razeevascx/MailRef/issues)
- Include detailed steps to reproduce the bug
- Add screenshots if relevant
- Specify your environment (OS, browser version, etc.)

### 2. Suggest Features

- Use our [feature request template](https://github.com/razeevascx/MailRef/issues/new?template=feature_request.md)
- Explain the problem you're trying to solve
- Describe the solution you'd like
- List any alternatives you've considered

### 3. Submit Code Changes

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Run tests (`npm run lint`)
5. Commit with clear messages (`git commit -m 'Add: feature X'`)
6. Push to your fork (`git push origin feature/improvement`)
7. Open a Pull Request
