(() => {
  const script = document.currentScript;
  const entries = (script?.dataset.debugCodes || '')
    .split('|')
    .map((entry) => {
      const separator = entry.indexOf(':');
      if (separator < 0) return null;
      return {
        label: entry.slice(0, separator).trim(),
        code: entry.slice(separator + 1).trim(),
      };
    })
    .filter((entry) => entry && entry.label && entry.code);

  if (!entries.length) {
    console.error('Debug shortcut requires at least one labeled access code.');
    return;
  }

  function showDebugPanel() {
    const existingPanel = document.getElementById('letterDebugPanel');
    if (existingPanel) {
      existingPanel.focus();
      return;
    }

    const panel = document.createElement('aside');
    panel.id = 'letterDebugPanel';
    panel.tabIndex = -1;
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');
    panel.style.cssText = [
      'position:fixed',
      'z-index:9999',
      'right:16px',
      'bottom:16px',
      'width:min(540px,calc(100% - 32px))',
      'max-height:70vh',
      'overflow:auto',
      'padding:20px',
      'border:2px solid #bdb5a5',
      'border-radius:12px',
      'background:#fff',
      'color:#171611',
      'box-shadow:0 8px 32px rgba(0,0,0,.2)',
      'font:16px/1.6 "SF Mono",monospace',
    ].join(';');

    const heading = document.createElement('h2');
    heading.textContent = 'Debug access';
    panel.appendChild(heading);

    const message = document.createElement('p');
    message.textContent = entries.length === 1
      ? 'Task bypassed. Use this access code on the home page:'
      : 'Debug codes for the available letters:';
    panel.appendChild(message);

    entries.forEach(({ label, code }) => {
      const row = document.createElement('p');
      const codeElement = document.createElement('code');
      row.textContent = `${label}: `;
      codeElement.textContent = code;
      row.appendChild(codeElement);
      panel.appendChild(row);
    });

    const homeLink = document.createElement('a');
    homeLink.href = 'home.html';
    homeLink.textContent = 'Go to home page';
    panel.appendChild(homeLink);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    closeButton.style.cssText = 'display:block;margin-top:16px;padding:8px 14px;font:inherit;cursor:pointer';
    closeButton.addEventListener('click', () => panel.remove());
    panel.appendChild(closeButton);

    document.body.appendChild(panel);
    closeButton.focus();
  }

  document.addEventListener('keydown', (event) => {
    const isDebugKey = event.code === 'KeyD' || (event.key || '').toLowerCase() === 'd';
    const isDesktopShortcut = event.ctrlKey && event.altKey && !event.metaKey;
    const isMacShortcut = event.metaKey && event.altKey && event.shiftKey;

    if (!isDebugKey || (!isDesktopShortcut && !isMacShortcut)) return;

    event.preventDefault();
    showDebugPanel();
  });
})();
