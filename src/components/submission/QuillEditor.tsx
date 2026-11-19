"use client";

import { useEffect, useRef, useState } from "react";
import type Quill from "quill";
import { cn } from "cn";

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

export function QuillEditor({
  value,
  onChange,
  onBlur,
  invalid = false,
}: QuillEditorProps) {
  const editorElementRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);
  const initialValueRef = useRef(value);
  const invalidRef = useRef(invalid);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
    onBlurRef.current = onBlur;
  }, [onBlur, onChange]);

  useEffect(() => {
    let active = true;
    let editor: Quill | null = null;

    void import("quill")
      .then(({ default: QuillConstructor }) => {
        if (!active || !editorElementRef.current) return;

        editor = new QuillConstructor(editorElementRef.current, {
          modules: QUILL_MODULES,
          placeholder: "Enter the paper abstract",
          theme: "snow",
        });
        quillRef.current = editor;
        editor.root.setAttribute("aria-label", "Abstract");
        editor.root.setAttribute("aria-invalid", String(invalidRef.current));

        if (initialValueRef.current) {
          editor.clipboard.dangerouslyPasteHTML(initialValueRef.current);
        }
        setIsReady(true);

        editor.on("text-change", () => {
          onChangeRef.current(editor?.root.innerHTML ?? "");
        });
        editor.on("selection-change", (range, previousRange) => {
          if (previousRange && !range) onBlurRef.current?.();
        });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
      editor?.off("text-change");
      editor?.off("selection-change");
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    invalidRef.current = invalid;
    quillRef.current?.root.setAttribute("aria-invalid", String(invalid));
  }, [invalid]);

  if (loadError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-300 bg-red-50 px-3 py-3 text-sm text-red-700"
      >
        The abstract editor could not be loaded. Close the dialog and try again.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "paper-quill relative min-h-52 overflow-hidden rounded-lg bg-popover transition-[border-color,box-shadow]",
        invalid && "paper-quill-error",
      )}
      aria-busy={!isReady}
    >
      {!isReady ? (
        <div
          role="status"
          className="absolute inset-0 flex items-center justify-center gap-2 bg-muted/60 text-sm text-muted-foreground"
        >
          <span
            className="size-2 animate-pulse rounded-full bg-primary"
            aria-hidden
          />
          Loading abstract editor…
        </div>
      ) : null}
      <div ref={editorElementRef} />
    </div>
  );
}
