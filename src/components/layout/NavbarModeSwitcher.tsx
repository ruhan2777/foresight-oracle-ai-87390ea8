import { GraduationCap, LineChart, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppMode, AppMode } from '@/contexts/AppModeContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const modes = [
  {
    id: 'academy' as AppMode,
    label: 'Academy',
    shortLabel: 'Academy',
    icon: GraduationCap,
    description: 'Learn with virtual trading',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    hoverBg: 'hover:bg-emerald-500/20',
  },
  {
    id: 'terminal' as AppMode,
    label: 'Terminal',
    shortLabel: 'Terminal',
    icon: LineChart,
    description: 'Full market analysis',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    hoverBg: 'hover:bg-primary/20',
  },
];

export function NavbarModeSwitcher() {
  const { mode, setMode } = useAppMode();

  const currentMode = modes.find((m) => m.id === mode) || modes[1];
  const CurrentIcon = currentMode.icon;

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === mode) return;
    
    setMode(newMode);
    const selectedMode = modes.find((m) => m.id === newMode);
    toast.success(`Switched to ${selectedMode?.label} Mode`, {
      description: selectedMode?.description,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            'border border-border/50 hover:border-border',
            currentMode.bgColor,
            currentMode.hoverBg
          )}
        >
          <CurrentIcon className={cn('w-4 h-4', currentMode.color)} />
          <span className={cn('hidden sm:inline', currentMode.color)}>
            {currentMode.shortLabel}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {modes.map((modeOption) => {
          const Icon = modeOption.icon;
          const isActive = mode === modeOption.id;
          return (
            <DropdownMenuItem
              key={modeOption.id}
              onClick={() => handleModeChange(modeOption.id)}
              className={cn(
                'flex items-center gap-3 cursor-pointer',
                isActive && modeOption.bgColor
              )}
            >
              <Icon className={cn('w-4 h-4', modeOption.color)} />
              <div className="flex flex-col">
                <span className={cn('font-medium', isActive && modeOption.color)}>
                  {modeOption.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {modeOption.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
