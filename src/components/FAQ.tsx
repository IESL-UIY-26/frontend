
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: "What is UIY 2025?",
    answer: "UIY is a unique platform for recognizing and rewarding the nation's most outstanding and innovative undergraduate students and showcasing the emerging ideas and inventions that will shape our future. Judges will evaluate each entry for its originality, inventiveness, the scope of use and potential social, environmental or economic value."
  },
  {
    question: "Who is allowed to participate?",
    answer: "To enter the competition, the student shall be a student member of IESL and an undergraduate of engineering faculties of the University of Peradeniya, University of Moratuwa, University of Ruhuna, University of Sri Jayewardenepura, South Eastern University, University of Jaffna and Open University of Sri Lanka as of 10th July 2021."
  },
  {
    question: "What is the allowable team size?",
    answer: "You can participate as an individual or a group project. The maximum number of group members per group is eight."
  },
  {
    question: "Are there prizes or any other benefits?",
    answer: "Absolutely! Awards criteria are as follows: Awards and cash prizes for the best 3 inventions from each field. Awards and cash prizes for the overall best 4 inventions. Special award and cash prize for the most popular invention. Provide the opportunity for some selected inventions to patent their inventions through Sri Lanka Inventors Commission."
  },
  {
    question: "What is the basic procedure of UIY 2025 participation?",
    answer: "Registration form the link: Click Here. A letter signed by the Project supervisor/advisor and Head of Department verifying the originality of the students' work needs to be submitted."
  },
  {
    question: "Who will be the judges of the UIY 2025?",
    answer: "Judged by the Sri Lanka Inventors Commission and the judge's decision will be the final decision."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-animation">
          <div className="flex justify-center mb-3">
            <HelpCircle className="w-8 h-8 text-uiy-blue" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about the UIY 2025 competition.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 reveal-animation">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-medium text-uiy-darkblue hover:text-uiy-blue py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
