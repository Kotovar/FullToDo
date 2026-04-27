type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleCredentialHandler = (response: GoogleCredentialResponse) => void;

type GoogleIdConfiguration = {
  client_id: string;
  callback: GoogleCredentialHandler;
};

type GoogleRenderedButtonOptions = {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  width?: string;
  logo_alignment?: 'left' | 'center';
};

type GoogleAccountsId = {
  initialize: (configuration: GoogleIdConfiguration) => void;
  renderButton: (
    parent: HTMLElement,
    options: GoogleRenderedButtonOptions,
  ) => void;
};

type GoogleWindow = Window & {
  google?: {
    accounts?: {
      id?: GoogleAccountsId;
    };
  };
};

export const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let credentialHandler: GoogleCredentialHandler | null = null;
let isGoogleInitialized = false;

export const getGoogleAccountsId = (): GoogleAccountsId | null => {
  const googleWindow = window as GoogleWindow;

  return googleWindow.google?.accounts?.id ?? null;
};

export const setGoogleCredentialHandler = (
  handler: GoogleCredentialHandler,
) => {
  credentialHandler = handler;
};

export const initializeGoogleAccounts = (): boolean => {
  if (!GOOGLE_CLIENT_ID || isGoogleInitialized) {
    return Boolean(GOOGLE_CLIENT_ID);
  }

  const accountsId = getGoogleAccountsId();

  if (!accountsId) {
    return false;
  }

  accountsId.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: response => {
      credentialHandler?.(response);
    },
  });
  isGoogleInitialized = true;

  return true;
};

export const renderGoogleButton = (parent: HTMLElement) => {
  const accountsId = getGoogleAccountsId();

  if (!accountsId) {
    return false;
  }

  parent.textContent = '';
  accountsId.renderButton(parent, {
    theme: 'outline',
    size: 'large',
    shape: 'rectangular',
    text: 'continue_with',
    width: '320',
    logo_alignment: 'left',
  });

  return true;
};
