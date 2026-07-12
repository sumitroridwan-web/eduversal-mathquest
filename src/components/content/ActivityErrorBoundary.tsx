"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

// ==========================================================
// Wraps a single activity so a crash in one engine shows a
// friendly retry card instead of blanking the whole page.
// ==========================================================

interface Props { children: React.ReactNode; resourceId?: string; title?: string }
interface State { error: Error | null }

export class ActivityErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    track("activity_error", { resourceId: this.props.resourceId, message: error.message });
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-8 text-center" role="alert">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
          <h3 className="font-display text-lg font-bold text-navy-900">This activity hit a snag</h3>
          <p className="max-w-sm text-sm text-navy-600">Something went wrong loading{this.props.title ? ` "${this.props.title}"` : " this activity"}. You can try again — the rest of the site is fine.</p>
          <Button variant="primary" size="sm" onClick={this.reset}><RotateCcw className="h-4 w-4" /> Try again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
