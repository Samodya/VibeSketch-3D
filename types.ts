// FIX: Import ReactNode to resolve 'Cannot find namespace 'React'' error.
import type { ReactNode } from 'react';

export enum Page {
  Landing,
  Sketch,
  Editor,
  Upscale,
  Generator,
  Settings,
  ImageTuning,
}

export type NavItem = {
  page: Page;
  name: string;
  icon: ReactNode;
};