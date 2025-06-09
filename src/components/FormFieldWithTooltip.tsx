
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface FormFieldWithTooltipProps {
  label: string;
  tooltip: string;
  children: React.ReactNode;
  htmlFor?: string;
}

const FormFieldWithTooltip = ({ label, tooltip, children, htmlFor }: FormFieldWithTooltipProps) => {
  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor={htmlFor} className="text-gray-300">{label}</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-cyan-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {children}
      </div>
    </TooltipProvider>
  );
};

export default FormFieldWithTooltip;
