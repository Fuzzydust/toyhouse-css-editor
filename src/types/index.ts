export interface ImageStyles {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  blur: number;
  opacity: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
}

export interface CanvasElement {
  id: string;
  type: 'div' | 'image' | 'text' | 'shape' | 'pagedoll';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  visible?: boolean;
  locked?: boolean;
  name?: string;
  scrollBehavior?: 'fixed' | 'absolute';
  link?: {
    type: 'page' | 'url';
    target: string;
    openInNewTab?: boolean;
  };
  content?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  textAlign?: string;
  shapeType?: 'circle' | 'rectangle' | 'triangle' | 'polygon' | 'ellipse';
  sides?: number;
  styles?: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    borderRadius?: number | string;
    opacity?: number;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    mixBlendMode?: string;
    [key: string]: any;
  };
}

export interface Page {
  id: string;
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  elements: CanvasElement[];
}

export interface CustomFont {
  id: string;
  name: string;
  url: string;
  type: 'google' | 'custom';
}

export interface Project {
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  elements: CanvasElement[];
  pages?: Page[];
  currentPageId?: string;
  customFonts?: CustomFont[];
}
