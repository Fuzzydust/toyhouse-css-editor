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

export interface WorldLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  link?: {
    type: 'page' | 'url';
    target: string;
    openInNewTab?: boolean;
  };
  buttonStyles?: {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: string;
    fontSize?: string;
    fontWeight?: string;
  };
}

export interface CanvasElement {
  id: string;
  type: 'div' | 'image' | 'text' | 'shape' | 'pagedoll' | 'world';
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
  worldImage?: string;
  locations?: WorldLocation[];
  styles?: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
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

export interface Project {
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  elements: CanvasElement[];
  pages?: Page[];
  currentPageId?: string;
}
