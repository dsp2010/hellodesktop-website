(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const panel = $('#barber-ai-panel');
  if (!panel) return;

  const openButton = $('#barber-ai-open');
  const closeButton = $('#barber-ai-close');
  const status = $('#barber-ai-status');
  const mount = $('#barber-ai-mount');
  if (!openButton || !closeButton || !status || !mount) return;
  const errorPanel = $('#barber-mic-error');
  const errorTitle = $('#barber-mic-error-title');
  const errorMessage = $('#barber-mic-error-message');
  const microphoneHelp = $('#barber-mic-help');
  const copyButton = $('#barber-mic-copy');
  const copyStatus = $('#barber-mic-copy-status');
  const pageLink = $('#barber-mic-link');
  const INITIAL_LABEL = 'Check microphone & open AI';

  // Public agent ID only. The URL and widget version cannot come from the query string.
  // Version: https://github.com/elevenlabs/packages/releases/tag/%40elevenlabs%2Fconvai-widget-embed%400.21.3
  const WIDGET_URL = 'https://unpkg.com/@elevenlabs/convai-widget-embed@0.21.3';
  const TAG = 'elevenlabs-convai';
  const registry = window.customElements;
  let generation = 0;
  let phase = 'closed';
  let timer = null;
  let pendingScript = null;
  let widget = null;

  function configuration() {
    // This panel is exclusively the barber agent, regardless of URL or other demo selectors.
    const candidate = window.HELLODESK_CONFIG?.voiceAgents?.barber;
    return candidate?.enabled === true && candidate.provider === 'elevenlabs' &&
      typeof candidate.agentId === 'string' && /^agent_[a-zA-Z0-9]+$/.test(candidate.agentId)
      ? candidate : null;
  }

  function supported() {
    return !!(registry && typeof registry.get === 'function' && typeof registry.whenDefined === 'function');
  }

  function writeStatus(message) {
    status.textContent = message;
    panel.dataset.state = phase;
  }

  function clearLoading(removeScript) {
    clearTimeout(timer);
    timer = null;
    if (pendingScript) {
      pendingScript.onload = null;
      pendingScript.onerror = null;
      if (removeScript) pendingScript.remove();
      pendingScript = null;
    }
  }

  function controls() {
    const busy = phase !== 'closed';
    openButton.hidden = busy;
    openButton.disabled = busy || !configuration() || !supported();
    openButton.setAttribute('aria-expanded', String(busy));
    closeButton.hidden = !busy;
    mount.hidden = phase !== 'open';
    panel.setAttribute('aria-busy', String(phase === 'checking' || phase === 'loading'));
  }

  function clearError() {
    if (errorPanel) errorPanel.hidden = true;
    if (errorTitle) errorTitle.textContent = '';
    if (errorMessage) errorMessage.textContent = '';
  }

  function close(message, focus = false) {
    generation++;
    clearLoading(true);
    // The official custom element ends its conversation on unmount. No private widget API.
    // https://github.com/elevenlabs/packages/blob/main/packages/convai-widget-core/src/contexts/conversation.tsx
    widget?.remove();
    widget = null;
    mount.replaceChildren();
    phase = 'closed';
    controls();
    if (message) writeStatus(message);
    if (focus && !openButton.disabled) openButton.focus();
  }

  function fail(message, token, title = 'The voice assistant could not open') {
    if (token !== generation || !['checking', 'loading'].includes(phase)) return;
    close(title + '. Follow the steps below, then retry.');
    openButton.textContent = 'Retry microphone & open AI';
    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;
    if (errorPanel) errorPanel.hidden = false;
    if (microphoneHelp) microphoneHelp.open = true;
    if (!document.hidden && errorPanel && errorTitle) errorTitle.focus();
  }

  function microphoneError(error) {
    const name = error?.name || '';
    const message = String(error?.message || '');
    if (name === 'NotAllowedError' && /permission denied by system/i.test(message)) {
      return ['Your system blocked the microphone', 'Windows or this app blocked microphone access before the voice assistant could start. In Windows, open Settings → Privacy & security → Microphone and enable microphone access for this app or desktop apps. If access is already enabled, copy this page link and open it in Chrome or Edge. Then allow the microphone for this website and retry.'];
    }
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return ['Microphone permission was not granted', 'Allow microphone access for this website using your browser’s site permissions, then retry. If this app does not offer a permission prompt, copy the page link and open it in Chrome or Edge. Check Windows microphone privacy settings if access remains blocked.'];
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return ['No available microphone was found', 'Connect or enable your microphone, then select it under Windows Settings → System → Sound → Input. Check that your browser can use that input device, then retry.'];
    }
    if (name === 'NotReadableError' || name === 'TrackStartError' || name === 'AbortError') {
      return ['Your microphone could not be opened', 'Your microphone may be busy, disconnected or unavailable to this browser. Close other apps using it, check Windows Settings → System → Sound → Input, then retry. You can also copy this page link and try Chrome or Edge.'];
    }
    if (name === 'SecurityError') {
      return ['This browser blocked microphone access', 'Microphone capture is disabled in this browser or app. Copy this secure page link and open it in Chrome or Edge, allow the microphone for this website, then retry.'];
    }
    return ['The microphone check did not finish', 'The browser could not check your microphone. Check its microphone permissions and your selected Windows input device, then retry. If you are using an embedded preview, copy the link and open it in Chrome or Edge.'];
  }

  function preflightProblem() {
    if (!window.isSecureContext) return ['A secure browser connection is needed', 'Microphone access needs a secure connection. Copy the live page link below and open it in Chrome or Edge, then allow the microphone for this website.'];
    if (typeof navigator.mediaDevices?.getUserMedia !== 'function') return ['This app cannot request your microphone', 'This browser or embedded app does not provide microphone access. Copy the live page link and open it in an up-to-date Chrome or Edge browser.'];
    const policy = document.permissionsPolicy || document.featurePolicy;
    try {
      if (policy?.allowsFeature && !policy.allowsFeature('microphone')) return ['This page is blocked from using the microphone', 'The surrounding browser or preview has blocked microphone access for this page. Copy the live link and open it directly in Chrome or Edge, then allow the microphone for this website.'];
    } catch (_) {
      // Older browsers can reject an unsupported policy query. The actual capture request decides.
    }
    return null;
  }

  function showWidget(token, agentId) {
    if (token !== generation || phase !== 'loading' || document.hidden) return;
    if (configuration()?.agentId !== agentId) {
      fail('The barber assistant configuration changed. Please try again.', token);
      return;
    }
    if (!registry.get(TAG)) return;
    clearLoading(false);
    widget = document.createElement(TAG);
    widget.setAttribute('agent-id', agentId);
    // These are supported attributes in the official widget source. The widget is floating;
    // full + default-expanded opens its interface, without starting a call or microphone.
    widget.setAttribute('variant', 'full');
    widget.setAttribute('default-expanded', 'true');
    widget.setAttribute('text-input', 'false');
    widget.setAttribute('mic-muting', 'true');
    widget.setAttribute('transcript', 'true');
    widget.setAttribute('persistent-session', 'false');
    widget.setAttribute('avatar-orb-color-1', '#173c35');
    widget.setAttribute('avatar-orb-color-2', '#d5e7b4');
    widget.setAttribute('action-text', 'HelloDesk barber AI');
    widget.setAttribute('start-call-text', 'Talk to the barber AI');
    widget.setAttribute('end-call-text', 'End conversation');
    widget.setAttribute('text-contents', JSON.stringify({
      main_label: 'HelloDesk barber AI',
      start_call: 'Talk to the barber AI',
      end_call: 'End call'
    }));
    mount.append(widget);
    phase = 'open';
    controls();
    writeStatus('Microphone access passed. The check has released your microphone. Press Talk to the barber AI in the ElevenLabs widget to start the conversation.');
  }

  function loadWidget(token, agentId) {
    if (token !== generation || phase !== 'checking' || document.hidden) return;
    if (configuration()?.agentId !== agentId) {
      fail('The barber assistant configuration changed. Please try again.', token);
      return;
    }
    clearLoading(true);
    phase = 'loading';
    controls();
    writeStatus('Loading the ElevenLabs voice assistant… No call has started.');
    if (registry.get(TAG)) {
      showWidget(token, agentId);
      return;
    }
    timer = setTimeout(() => fail('The voice assistant took too long to load. Check your connection, then try opening it again.', token), 25000);
    const script = document.createElement('script');
    pendingScript = script;
    script.src = WIDGET_URL;
    script.type = 'text/javascript';
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.onerror = () => fail('The voice assistant could not load. Check your connection or content blocker, then try opening it again.', token);
    script.onload = () => {
      if (token !== generation || phase !== 'loading') return;
      if (registry.get(TAG)) showWidget(token, agentId);
      else registry.whenDefined(TAG).then(() => showWidget(token, agentId)).catch(() => fail('The voice assistant could not initialise. Please try opening it again.', token));
    };
    document.head.append(script);
  }

  async function open() {
    if (phase !== 'closed' || document.hidden) return;
    const config = configuration();
    if (!config || !supported()) return;

    // Stop the separate browser-speech sandbox before checking the real microphone.
    $('#practice-end')?.click();
    const guided = $('#guided-practice');
    if (guided) guided.open = false;

    const token = ++generation;
    const agentId = config.agentId;
    clearError();
    phase = 'checking';
    controls();
    writeStatus('Checking microphone access… Allow it if your browser asks. Nothing is recorded or sent to ElevenLabs during this check.');
    const problem = preflightProblem();
    if (problem) {
      fail(problem[1], token, problem[0]);
      return;
    }
    timer = setTimeout(() => fail('The microphone permission request did not finish. Allow access in your browser if you want to continue, then press Retry. No voice assistant has been opened.', token, 'The microphone check timed out'), 20000);
    let stream = null;
    let error = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio: true});
    } catch (caught) {
      error = caught;
    } finally {
      // A permission prompt can resolve after close, backgrounding or timeout. Always release it.
      // No stream is recorded, forwarded to a provider or retained by this page.
      if (stream) {
        for (const track of stream.getTracks()) {
          try { track.stop(); } catch (_) { /* Stop the remaining tracks even if one fails. */ }
        }
      }
    }
    if (token !== generation || phase !== 'checking' || document.hidden) return;
    if (error) {
      const [title, message] = microphoneError(error);
      fail(message, token, title);
      return;
    }
    loadWidget(token, agentId);
  }

  copyButton?.addEventListener('click', async () => {
    if (!pageLink || !copyStatus) return;
    const url = pageLink.value;
    try {
      if (typeof navigator.clipboard?.writeText !== 'function') throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      copyStatus.textContent = 'Page link copied. Paste it into Chrome or Edge.';
    } catch (_) {
      pageLink.focus();
      pageLink.select();
      copyStatus.textContent = 'Link selected. Press Ctrl+C to copy, then paste it into Chrome or Edge.';
    }
  });

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', () => {
    close('Voice assistant closed. Your next attempt will check microphone access again.', true);
    openButton.textContent = INITIAL_LABEL;
    clearError();
  });
  for (const selector of ['#practice-start', '#practice-buttons']) {
    $(selector)?.addEventListener('click', () => {
      if (phase !== 'closed') close('Barber AI closed. The separate guided practice is selected.');
    }, true);
  }
  window.addEventListener('pagehide', () => close('Voice assistant closed when you left the page.'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && phase !== 'closed') close('Voice assistant closed while this page was in the background. Reopen it to begin another conversation.');
  });

  controls();
  if (!configuration()) writeStatus('The barber voice assistant is not connected yet.');
  else if (!supported()) writeStatus('The voice assistant is unavailable in this browser. Try opening this page in an up-to-date browser.');
  else writeStatus('Check microphone access first, then press Talk to the barber AI in its widget. The check stops the microphone immediately and does not start a call.');
})();
