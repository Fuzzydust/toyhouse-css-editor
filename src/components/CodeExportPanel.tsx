import { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { Project } from '../types';

interface CodeExportPanelProps {
  project: Project;
}

export default function CodeExportPanel({ project }: CodeExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [exportType, setExportType] = useState<'css' | 'html'>('html');

  const createPolygonClipPath = (sides: number): string => {
    const points: string[] = [];
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = -Math.PI / 2;

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const x = 50 + 50 * Math.cos(angle);
      const y = 50 + 50 * Math.sin(angle);
      points.push(`${x}% ${y}%`);
    }

    return `polygon(${points.join(', ')})`;
  };

  const generateCSS = () => {
    let css = `.container {\n  position: relative;\n  width: ${project.canvasWidth}px;\n  min-height: ${project.canvasHeight}px;\n  background: ${project.canvasBackground};\n  overflow: visible;\n}\n\n`;

    project.elements.forEach((el, index) => {
      css += `.element-${index + 1} {\n`;
      if (el.type === 'pagedoll') {
        css += `  position: absolute;\n`;
        css += `  right: ${el.x}px;\n`;
        css += `  bottom: ${el.y}px;\n`;
        css += `  max-height: ${el.height}px;\n`;
      } else {
        css += `  position: absolute;\n`;
        css += `  left: ${el.x}px;\n`;
        css += `  top: ${el.y}px;\n`;
        css += `  width: ${el.width}px;\n`;
        css += `  height: ${el.height}px;\n`;
      }

      if (el.rotation !== 0) {
        css += `  transform: rotate(${el.rotation}deg);\n`;
      }

      css += `  z-index: ${el.zIndex};\n`;

      if (el.styles?.backgroundColor) css += `  background-color: ${el.styles.backgroundColor};\n`;

      if (el.type === 'shape' && el.shapeType === 'circle') {
        css += `  border-radius: 50%;\n`;
      } else if (el.styles?.borderRadius) {
        const radius = typeof el.styles.borderRadius === 'number'
          ? `${el.styles.borderRadius}px`
          : el.styles.borderRadius;
        css += `  border-radius: ${radius};\n`;
      }

      if (el.styles?.opacity !== undefined && el.styles.opacity !== 1) {
        css += `  opacity: ${el.styles.opacity};\n`;
      }

      if (el.styles?.mixBlendMode && el.styles.mixBlendMode !== 'normal') {
        css += `  mix-blend-mode: ${el.styles.mixBlendMode};\n`;
      }

      if (el.styles?.backgroundImage) {
        const bgImage = el.styles.backgroundImage.startsWith('url(')
          ? el.styles.backgroundImage
          : `url(${el.styles.backgroundImage})`;
        css += `  background-image: ${bgImage};\n`;
        css += `  background-size: ${el.styles.backgroundSize || 'cover'};\n`;
        css += `  background-position: ${el.styles.backgroundPosition || 'center'};\n`;
        if (el.styles.backgroundRepeat) {
          css += `  background-repeat: ${el.styles.backgroundRepeat};\n`;
        }
      }

      if (el.type === 'shape' && el.shapeType === 'triangle') {
        css += `  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);\n`;
      }

      if (el.type === 'shape' && el.shapeType === 'polygon' && el.sides) {
        css += `  clip-path: ${createPolygonClipPath(el.sides)};\n`;
      }

      if (el.type === 'text') {
        if (el.fontSize) css += `  font-size: ${el.fontSize}px;\n`;
        if (el.fontColor) css += `  color: ${el.fontColor};\n`;
        if (el.fontFamily) css += `  font-family: ${el.fontFamily};\n`;
        if (el.textAlign) css += `  text-align: ${el.textAlign};\n`;
        css += `  display: flex;\n`;
        css += `  align-items: center;\n`;
        css += `  justify-content: center;\n`;
      }

      css += `}\n\n`;
    });

    return css;
  };

  const generateInlineStyles = (el: any): string => {
    const styles: string[] = [];

    if (el.type === 'pagedoll') {
      styles.push(`position: absolute`);
      styles.push(`right: ${el.x}px`);
      styles.push(`bottom: ${el.y}px`);
      styles.push(`max-height: ${el.height}px`);
    } else {
      styles.push(`position: absolute`);
      styles.push(`left: ${el.x}px`);
      styles.push(`top: ${el.y}px`);
      styles.push(`width: ${el.width}px`);
      styles.push(`height: ${el.height}px`);
    }

    if (el.rotation !== 0) {
      styles.push(`transform: rotate(${el.rotation}deg)`);
    }

    styles.push(`z-index: ${el.zIndex}`);

    if (el.styles?.backgroundColor) {
      styles.push(`background-color: ${el.styles.backgroundColor}`);
    }

    if (el.type === 'shape' && el.shapeType === 'circle') {
      styles.push(`border-radius: 50%`);
    } else if (el.styles?.borderRadius) {
      const radius = typeof el.styles.borderRadius === 'number'
        ? `${el.styles.borderRadius}px`
        : el.styles.borderRadius;
      styles.push(`border-radius: ${radius}`);
    }

    if (el.styles?.opacity !== undefined && el.styles.opacity !== 1) {
      styles.push(`opacity: ${el.styles.opacity}`);
    }

    if (el.styles?.mixBlendMode && el.styles.mixBlendMode !== 'normal') {
      styles.push(`mix-blend-mode: ${el.styles.mixBlendMode}`);
    }

    if (el.styles?.backgroundImage) {
      const bgImage = el.styles.backgroundImage.startsWith('url(')
        ? el.styles.backgroundImage
        : `url(${el.styles.backgroundImage})`;
      styles.push(`background-image: ${bgImage}`);
      styles.push(`background-size: ${el.styles.backgroundSize || 'cover'}`);
      styles.push(`background-position: ${el.styles.backgroundPosition || 'center'}`);
      if (el.styles.backgroundRepeat) {
        styles.push(`background-repeat: ${el.styles.backgroundRepeat}`);
      }
    }

    if (el.type === 'shape' && el.shapeType === 'triangle') {
      styles.push(`clip-path: polygon(50% 0%, 0% 100%, 100% 100%)`);
    }

    if (el.type === 'shape' && el.shapeType === 'polygon' && el.sides) {
      styles.push(`clip-path: ${createPolygonClipPath(el.sides)}`);
    }

    if (el.type === 'text') {
      if (el.fontSize) styles.push(`font-size: ${el.fontSize}px`);
      if (el.fontColor) styles.push(`color: ${el.fontColor}`);
      if (el.fontFamily) styles.push(`font-family: ${el.fontFamily}`);
      if (el.textAlign) styles.push(`text-align: ${el.textAlign}`);
      styles.push(`display: flex`);
      styles.push(`align-items: center`);
      styles.push(`justify-content: center`);
    }

    return styles.join('; ');
  };

  const generateHTML = () => {
    const containerStyle = `position: relative; width: ${project.canvasWidth}px; min-height: ${project.canvasHeight}px; background: ${project.canvasBackground}; overflow: visible`;

    let html = `<div style="${containerStyle}">\n`;

    const pagedolls: any[] = [];
    const regularElements: any[] = [];

    project.elements.forEach((el) => {
      if (el.type === 'pagedoll') {
        pagedolls.push(el);
      } else {
        regularElements.push(el);
      }
    });

    regularElements.forEach((el) => {
      const inlineStyle = generateInlineStyles(el);
      html += `  <div style="${inlineStyle}">`;
      if (el.type === 'text') {
        html += el.content || 'Text';
      }
      html += `</div>\n`;
    });

    pagedolls.forEach((el) => {
      const bgImage = el.styles?.backgroundImage?.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') || '';
      html += `  <img src="${bgImage}" style="max-height: ${el.height}px; right: ${el.x}px; bottom: ${el.y}px;" class="page-doll fr-fil fr-dib" width="${el.width}" height="${el.height}">\n`;
    });

    html += `</div>`;

    return html;
  };

  const getExportCode = () => {
    return exportType === 'html' ? generateHTML() : generateCSS();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 border-t border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Export Code</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setExportType('html')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            exportType === 'html'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          HTML + CSS
        </button>
        <button
          onClick={() => setExportType('css')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            exportType === 'css'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          CSS Only
        </button>
      </div>

      <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words bg-slate-800 p-3 rounded max-h-60 overflow-y-auto">
        {getExportCode()}
      </pre>
    </div>
  );
}
