import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface ConceptTooltipProps {
  title: string;
  explanation: string;
  emoji?: string;
  children?: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  asChild?: boolean;
}

export const ConceptTooltip = ({
  title,
  explanation,
  emoji,
  children,
  side = 'top',
  asChild = false
}: ConceptTooltipProps) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>
          {children || (
            <button className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-muted transition-colors">
              <Info size={16} className="text-muted-foreground" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs p-0 overflow-hidden">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              {emoji && <span className="text-2xl">{emoji}</span>}
              <h4 className="font-semibold text-sm">{title}</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {explanation}
            </p>
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
