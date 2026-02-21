'use client';
import { useState, useRef, useCallback } from 'react';

interface Props {
  initialCode?: string;
  height?: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodePreview({ initialCode = '', height = '300px', onCodeChange, readOnly = false }: Props) {
  const [code, setCode] = useState(initialCode);
  const [preview, setPreview] = useState(initialCode);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRun = useCallback(() => {
    setPreview(code);
    onCodeChange?.(code);
  }, [code, onCodeChange]);

  const handleCodeChange = (val: string) => {
    setCode(val);
  };

  const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: system-ui, -apple-system, sans-serif; color: #e2e8f0; background: #0f172a; padding: 16px; margin: 0; }
  a { color: #38bdf8; }
  img { max-width: 100%; height: auto; }
  h1,h2,h3 { color: #f1f5f9; }
  input, textarea, select, button { background: #1e293b; color: #e2e8f0; border: 1px solid #334155; border-radius: 6px; padding: 6px 10px; font-size: 14px; }
  button { cursor: pointer; background: #3b82f6; border-color: #3b82f6; }
  button:hover { background: #2563eb; }
  label { display: block; margin-bottom: 4px; color: #94a3b8; font-size: 14px; }
  * { box-sizing: border-box; }
</style>
</head>
<body>
${preview}
</body>
</html>`;

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden bg-black/80">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900/50 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-gray-500 ml-1 font-mono">Code Editor</span>
        </div>
        <button
          onClick={handleRun}
          className="text-xs px-3 py-1 rounded-lg font-semibold transition-all"
          style={{ background: '#39ff14', color: '#000' }}
        >
          ▶ Run
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-col md:flex-row" style={{ height }}>
        {/* Code Editor */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute top-1 right-2 text-[9px] text-gray-600 font-mono z-10">HTML / CSS / JS</div>
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            readOnly={readOnly}
            className="w-full h-full bg-black/50 text-gray-200 font-mono text-xs p-3 resize-none outline-none border-none"
            style={{ tabSize: 2 }}
            spellCheck={false}
            placeholder="Write your HTML, CSS, and JavaScript here..."
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-800" />
        <div className="md:hidden h-px bg-gray-800" />

        {/* Preview */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute top-1 right-2 text-[9px] text-gray-600 font-mono z-10">Preview</div>
          <iframe
            ref={iframeRef}
            srcDoc={srcdoc}
            className="w-full h-full border-none bg-[#0f172a]"
            sandbox="allow-scripts"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
