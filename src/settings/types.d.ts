export type Theme = 'light' | 'dark';
export type Container = 'centered' | 'none';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id'?: string;
        [key: string]: any;
      };
    }
  }
}
