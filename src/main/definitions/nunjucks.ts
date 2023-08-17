export type GovUkSummaryRow = {
  classes?: string;
  key: {
    text?: string;
    html?: string;
    classes?: string;
  };
  value: {
    text?: string;
    html?: string;
    classes?: string;
  };
  actions?: {
    classes?: string;
    items?: {
      href?: string;
      text?: string;
      html?: string;
      visuallyHiddenText?: string;
      classes?: string;
      attributes?: object;
    }[];
  };
};
