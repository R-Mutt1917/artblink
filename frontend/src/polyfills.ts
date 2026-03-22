import { Buffer } from 'buffer';
window.Buffer = Buffer;
(globalThis as any).Buffer = Buffer;