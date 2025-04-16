# CSS Prep - Study Platform for CSS/PMS Aspirants

CSS Prep is a clean, user-friendly web application designed to help Pakistan's CSS and PMS aspirants organize their studies, track progress, and practice exams with a Notion-inspired interface.

## Features

- **Dashboard**: View your study progress, upcoming tasks, and countdown to exam day
- **Syllabus Management**: Organize subjects and subtopics with progress tracking
- **Notes**: Take and organize notes with a markdown editor
- **Exam Room**: Practice with past papers and create your own MCQs
- **Progress Tracking**: Monitor your study progress and achievements

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **UI Components**: Shadcn UI
- **Data Storage**: localStorage (MVP version)
- **Future Backend**: Supabase/Firebase (planned)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/css-prep.git
   cd css-prep
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `pages/`: Next.js pages (routes)
- `components/`: Reusable React components
- `components/ui/`: Shadcn UI components
- `utils/`: Utility functions, including localStorage data management
- `styles/`: Global CSS styles
- `public/`: Static assets

## Future Enhancements

- **Backend Integration**: Replace localStorage with Supabase or Firebase
- **Authentication**: User accounts and profiles
- **Syllabus Store**: Community-shared syllabi and study plans
- **Article Feed**: Curated articles and resources for exam preparation
- **Study Groups**: Collaborative study features
- **Mobile App**: Native mobile experience

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
