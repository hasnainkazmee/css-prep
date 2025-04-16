import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
  { 
    question: 'What is CSS Prep?', 
    answer: 'CSS Prep is a web app to help CSS/PMS aspirants in Pakistan organize studies and practice exams.' 
  },
  { 
    question: 'How do I add a syllabus?', 
    answer: 'Go to the Syllabus page, select a subject, and enter subtopics in the form.' 
  },
  { 
    question: 'Is my data saved?', 
    answer: 'Currently, data is saved locally; a backend will soon enable cloud saving.' 
  },
  {
    question: 'How do I take practice exams?',
    answer: 'Visit the Exam Room page to start a new exam. You can choose from various subjects and customize your exam settings.'
  },
  {
    question: 'Can I track my progress?',
    answer: 'Yes! The Progress page provides detailed statistics and visualizations of your study progress and exam performance.'
  }
];

const FAQPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground dark:text-white mb-8">Frequently Asked Questions</h1>
      <div className="grid gap-6">
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-card dark:bg-gray-900 border-none rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground dark:text-white">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
