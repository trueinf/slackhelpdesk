import { KBArticle } from './types';

export const KB_ARTICLES: KBArticle[] = [
  {
    id: 'kb-okta-figma-missing-tile',
    title: 'Figma tile missing in Okta dashboard',
    summary: 'How to restore the Figma application tile in Okta and ensure SSO works.',
    tags: ['okta', 'figma', 'sso', 'access'],
    keywords: ['missing tile', 'okta app', 'figma access', 'viewer', 'marketing'],
    body:
      'If the Figma tile is missing in Okta:\n\n1) Verify user group membership (e.g., figma-marketing-users).\n2) Assign app in Okta Admin → Applications → Figma → Assign.\n3) Ensure SAML attributes include email.\n4) Ask user to refresh Okta home or re-login.\n5) Confirm license type is correct (viewer/comment).',
    successRatePercent: 92,
    frequentFollowUps: [
      'Request edit access after viewer provisioning',
      'Move user into correct Okta group for department',
      'Clear Okta browser cache or re-login',
    ],
  },
  {
    id: 'kb-okta-reset-2fa',
    title: 'Reset Okta MFA/2FA',
    summary: 'Steps to reset or change your Okta multifactor methods.',
    tags: ['okta', 'mfa', 'security'],
    keywords: ['2fa', 'mfa reset', 'authenticator', 'sms'],
    body:
      'To reset MFA: Contact IT or use self-service reset if enabled. In Okta → Settings → Extra Verification, remove the factor and enroll again. If locked out, open a Helpdesk ticket for admin reset.',
    successRatePercent: 84,
    frequentFollowUps: [
      'Re-enroll Okta Verify push notifications',
      'Switch to backup factor (SMS) temporarily',
    ],
  },
  {
    id: 'kb-zoom-license-upgrade',
    title: 'Request a Zoom Pro license',
    summary: 'How to upgrade from Basic to Pro license depending on team policy.',
    tags: ['zoom', 'license'],
    keywords: ['zoom pro', 'meeting limit', 'recording'],
    body:
      'Submit a license upgrade request via Helpdesk. Provide meeting duration needs and cost center. Approval auto-granted for managers and customer-facing roles.',
    successRatePercent: 76,
    frequentFollowUps: [
      'Assign cloud recording to user',
      'Enable webinar add-on',
    ],
  },
  {
    id: 'kb-adobe-creative-cloud',
    title: 'Adobe Creative Cloud Access',
    summary: 'Provisioning guidance for Adobe CC with SSO.',
    tags: ['adobe', 'sso', 'access'],
    keywords: ['photoshop', 'illustrator', 'xd', 'license'],
    body:
      'Users in Design/Marketing can get Adobe CC. Request via Helpdesk, confirm seat availability, assign SSO profile. Sign in using company Okta.',
    successRatePercent: 88,
    frequentFollowUps: [
      'Add Adobe Stock entitlement',
      'Assign specific app (Photoshop-only) license',
    ],
  },
];


