export function addErrorListContent(textString: string, hrefString: string): ErrorListContent {
  return {
    text: textString,
    href: hrefString,
  };
}

export interface ErrorListContent {
  text?: string;
  href?: string;
}
