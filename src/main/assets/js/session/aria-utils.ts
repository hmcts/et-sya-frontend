function addAriaExpandedAttribute(): void {
  document.querySelectorAll('details').forEach(detail => {
    if (detail.open) {
      detail.setAttribute('aria-expanded', 'true');
    } else {
      detail.setAttribute('aria-expanded', 'false');
    }
  });
}

function addAriaExpandedEventListener(): void {
  document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        detail.setAttribute('aria-expanded', 'true');
      } else {
        detail.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

export { addAriaExpandedAttribute, addAriaExpandedEventListener };
