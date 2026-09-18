"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/site";

const FIELD_STYLES =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 " +
  "placeholder:text-zinc-400 transition-colors focus:bg-white focus:border-zinc-400 focus:outline-none";

/**
 * Composes a `mailto:` link from the form and hands it to the reader's mail
 * client. There is no backend, so nothing is submitted anywhere and no success
 * state is faked — the browser either opens a compose window or nothing happens.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = name.trim() ? `${message}\n\n— ${name}` : message;
    const params = new URLSearchParams({
      subject: subject.trim() || "Holdytic enquiry",
      body,
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
  };

  return (
    <form onSubmit={handleSubmit} className="no-prose mt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5"
          >
            Your name
          </label>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Optional"
            className={FIELD_STYLES}
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What is this about?"
            className={FIELD_STYLES}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="Tell us what you need…"
          className={`${FIELD_STYLES} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={buttonStyles("no-prose")}>
          <Mail size={16} className="mr-2" aria-hidden />
          Open in mail app
        </button>
        <p className="text-xs text-zinc-500">
          This opens your own email client — nothing is sent from this page.
        </p>
      </div>
    </form>
  );
}
