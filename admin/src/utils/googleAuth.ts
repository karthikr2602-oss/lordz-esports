/**
 * Google Identity Services & OAuth 2.0 Client Utility for Admin Portal
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: {
              access_token: string;
              error?: string;
              error_description?: string;
            }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export interface GoogleUserProfile {
  token?: string;
  credential?: string;
  email: string;
  name?: string;
  picture?: string;
  googleId?: string;
}

export const getGoogleClientId = (): string => {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (typeof envId === "string" && envId.trim().length > 0 && !envId.includes("your-google-client-id")) {
    return envId.trim();
  }
  return "";
};

export const isGoogleClientConfigured = (): boolean => {
  return getGoogleClientId().length > 0;
};

export const openGoogleOAuthPopup = (): Promise<GoogleUserProfile> => {
  return new Promise((resolve, reject) => {
    const clientId = getGoogleClientId();
    if (!clientId) {
      reject(new Error("GOOGLE_CLIENT_ID_NOT_CONFIGURED"));
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      reject(new Error("Google Identity Services script not yet loaded."));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }

          try {
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userInfoRes.ok) {
              throw new Error("Failed to retrieve Google profile");
            }

            const profile = await userInfoRes.json();
            resolve({
              token: tokenResponse.access_token,
              email: profile.email,
              name: profile.name || profile.given_name,
              picture: profile.picture,
              googleId: profile.sub,
            });
          } catch (err: any) {
            reject(err);
          }
        },
      });

      client.requestAccessToken();
    } catch (err: any) {
      reject(err);
    }
  });
};

/**
 * Redirect browser to Google Accounts sign-in page for Admin
 */
export const redirectToGoogleAccounts = (returnUrl?: string, role: string = "ADMIN"): void => {
  const currentUrl = returnUrl || window.location.href;
  const redirectTarget = `/api/auth/google?returnUrl=${encodeURIComponent(currentUrl)}&role=${role}`;
  window.location.href = redirectTarget;
};

