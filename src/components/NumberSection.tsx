import { type ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  text: string;
}

/** Section with title + icon header + formatted text. Used in Profile expanded cards. */
export function NumberSection({ title, icon, text }: Props) {
  return (
    <div className="mt-3 pt-3 border-t border-border/20">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-lato">{title}</p>
      </div>
      <div className="space-y-2">
        {text.split('\n\n').map((chunk, i) => {
          const colonIdx = chunk.indexOf(':');
          if (colonIdx > 0 && colonIdx < 40) {
            const heading = chunk.slice(0, colonIdx);
            const body = chunk.slice(colonIdx + 1).trim();
            return (
              <p key={i} className="text-sm text-foreground/80 font-lato leading-relaxed">
                <span className="font-semibold text-foreground">{heading}:</span> {body}
              </p>
            );
          }
          return (
            <p key={i} className="text-sm text-foreground/80 font-lato leading-relaxed">
              {chunk}
            </p>
          );
        })}
      </div>
    </div>
  );
}
