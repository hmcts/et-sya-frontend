export function addSummaryRow(keyText: string, valueText?: string, valueHtml?: string, actions?: SummaryListActions): SummaryListRow {
  return {
    key: {
      text: keyText,
      classes: 'govuk-!-font-weight-regular-m',
    },
    value: {
      text: valueText,
      html: valueHtml,
    },
    actions
  };
}

export interface SummaryListOptions {
  rows: SummaryListRow[];
  card?: SummaryListCard;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface SummaryListRow {
  key: SummaryListContent;
  value: SummaryListContent;
  actions?: SummaryListActions;
  classes?: string;
}

export interface SummaryListContent {
  text?: string;
  html?: string;
  classes?: string;
}

export interface SummaryListActions {
  items: SummaryListActionItem[];
  classes?: string;
}

export interface SummaryListActionItem {
  href: string;
  text?: string;
  html?: string;
  visuallyHiddenText?: string;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface SummaryListCard {
  title: SummaryListCardTitle;
  actions: SummaryListCardActions;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface SummaryListCardTitle {
  text?: string;
  html?: string;
  headingLevel?: number;
  classes?: string;
}

export interface SummaryListCardActions {
  items: SummaryListCardActionItem[];
  classes?: string;
}

export interface SummaryListCardActionItem {
  href: string;
  text?: string;
  html?: string;
}