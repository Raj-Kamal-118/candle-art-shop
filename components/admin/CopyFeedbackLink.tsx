"use client";

import { Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

export default function CopyFeedbackLink({ orderId }: { orderId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `${window.location.origin}/review?order=${orderId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy Feedback Link"
      className="p-1.5 text-brown-400 dark:text-amber-100/50 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors flex items-center justify-center"
    >
      {copied ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <LinkIcon size={14} />
      )}
    </button>
  );
}
