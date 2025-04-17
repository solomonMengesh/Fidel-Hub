import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const ExampleAccordion = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is this platform about?</AccordionTrigger>
          <AccordionContent>
            This platform provides a space for learning, collaboration, and content delivery. It's built for educators and learners.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I enroll in a course?</AccordionTrigger>
          <AccordionContent>
            You can enroll by navigating to the course page and clicking the "Enroll" button. Some courses may require approval or payment.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I track my progress?</AccordionTrigger>
          <AccordionContent>
            Yes! Each course tracks your progress, completed lessons, and quiz scores so you can monitor your learning journey.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default accordion;
