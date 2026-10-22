'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SocialShareProps {
  title: string;
  url?: string;
  className?: string;
}

export function SocialShare({ title, url, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const shareWhatsapp = () => {
    const text = encodeURIComponent(`You are cordially invited: ${title} - ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Join us in celebrating: ${title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className || ''}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      >
        {copied ? 'Link Copied!' : 'Copy Invitation Link'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareWhatsapp}
        leftIcon={<MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
      >
        WhatsApp
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareFacebook}
      >
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareTwitter}
      >
        X (Twitter)
      </Button>
    </div>
  );
}
