export interface AccordionItem {
  heading: Heading;
  content: Content;
}

interface Heading {
  text: string;
}

interface Content {
  html: string;
}
