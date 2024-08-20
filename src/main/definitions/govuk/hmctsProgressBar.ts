export function addProgressBarItem(labelText: string, isComplete: boolean, isActive: boolean): ProgressBarItem {
  return {
    label: {
      text: labelText,
    },
    complete: isComplete,
    active: isActive,
  };
}

export interface ProgressBarItem {
  label: {
    text?: string;
  };
  complete?: boolean;
  active?: boolean;
}
