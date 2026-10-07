// ── DOM IDs ───────────────────────────────────────────────────────────────────
const FILE_INPUT_ID = 'claimant-spreadsheet';
const LOADING_OVERLAY_ID = 'spreadsheet-loading-overlay';

// ── Loading overlay ───────────────────────────────────────────────────────────

function createLoadingOverlay(): void {
  if (document.getElementById(LOADING_OVERLAY_ID)) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = LOADING_OVERLAY_ID;
  overlay.className = 'spreadsheet-loading-overlay hidden';
  overlay.setAttribute('aria-live', 'assertive');
  overlay.setAttribute('role', 'status');
  overlay.innerHTML = `
    <div class="spreadsheet-loading-overlay__content">
      <div class="spreadsheet-loading-overlay__spinner" aria-hidden="true"></div>
    </div>`;

  document.body.appendChild(overlay);
}

function setLoading(show: boolean): void {
  document.getElementById(LOADING_OVERLAY_ID)?.classList.toggle('hidden', !show);
}

// ── Main file change handler ──────────────────────────────────────────────────

async function handleFileChange(event: Event, form: HTMLFormElement): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  setLoading(true);

  try {
    const csrfInput = form.querySelector('input[name="_csrf"]') as HTMLInputElement | null;
    const basePath = form.action.split('?')[0];

    const formData = new FormData();
    formData.append('additionalClaimantSpreadsheetName', file);
    formData.append('_csrf', csrfInput?.value ?? '');

    const response = await fetch(`${basePath}/postvalidate`, {
      method: 'POST',
      body: formData,
    });

    setLoading(false);

    const result = await response.json();

    if (result.redirect) {
      window.location.href = result.redirect + window.location.search;
    }
  } catch {
    setLoading(false);
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

const fileInput = document.getElementById(FILE_INPUT_ID) as HTMLInputElement | null;
const mainForm = document.getElementById('main-form') as HTMLFormElement | null;

if (fileInput && mainForm) {
  createLoadingOverlay();
  fileInput.addEventListener('change', (event: Event) => {
    handleFileChange(event, mainForm).catch(() => {
      setLoading(false);
    });
  });
}

export {};
