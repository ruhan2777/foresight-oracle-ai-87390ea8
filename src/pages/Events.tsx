import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { historicalEvents, HistoricalEvent } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Search, Globe, TrendingDown, Zap, Factory, AlertTriangle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

const eventTypeIcons: Record<string, typeof Globe> = {
  geopolitical: Globe,
  economic: TrendingDown,
  technological: Zap,
  industrial: Factory,
};

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

  const filteredEvents = historicalEvents.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.affectedSectors.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Historical Events Database</h1>
          <p className="text-muted-foreground mt-1">Explore past market events and their impacts</p>
        </div>

        {/* Search */}
        <div className="glass-card p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events, sectors, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border/50"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const Icon = eventTypeIcons[event.eventType] || AlertTriangle;
            const severityColor = event.severityLevel >= 8 ? 'text-destructive' : event.severityLevel >= 5 ? 'text-warning' : 'text-success';

            return (
              <div
                key={event.id}
                className="glass-card-hover p-5 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight mb-1">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{event.eventType}</span>
                      <span>•</span>
                      <span>{format(new Date(event.eventDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Severity</span>
                    <span className={cn('font-mono font-bold', severityColor)}>
                      {event.severityLevel.toFixed(1)}/10
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Recovery: {event.recoveryDays} days
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {event.affectedSectors.slice(0, 3).map((sector) => (
                    <span
                      key={sector}
                      className="px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground"
                    >
                      {sector}
                    </span>
                  ))}
                  {event.affectedSectors.length > 3 && (
                    <span className="px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                      +{event.affectedSectors.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Detail Modal */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-mono">{format(new Date(selectedEvent.eventDate), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{selectedEvent.eventType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Severity:</span>
                      <span className={cn('font-mono font-bold', selectedEvent.severityLevel >= 8 ? 'text-destructive' : 'text-warning')}>
                        {selectedEvent.severityLevel.toFixed(1)}/10
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                    <p className="text-foreground">{selectedEvent.description}</p>
                  </div>

                  {/* Affected Sectors */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Affected Sectors</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.affectedSectors.map((sector) => (
                        <span key={sector} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Market Impact */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Market Impact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/30">
                        <div className="text-xs text-muted-foreground mb-2">Immediate (Day 1)</div>
                        <div className="space-y-2">
                          {Object.entries(selectedEvent.marketImpact.immediate).map(([ticker, impact]) => (
                            <div key={ticker} className="flex items-center justify-between">
                              <span className="font-mono text-sm">{ticker}</span>
                              <span className={cn('font-mono font-bold', impact >= 0 ? 'text-success' : 'text-destructive')}>
                                {impact >= 0 ? '+' : ''}{impact.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30">
                        <div className="text-xs text-muted-foreground mb-2">30 Days Later</div>
                        <div className="space-y-2">
                          {Object.entries(selectedEvent.marketImpact.day30).map(([ticker, impact]) => (
                            <div key={ticker} className="flex items-center justify-between">
                              <span className="font-mono text-sm">{ticker}</span>
                              <span className={cn('font-mono font-bold', impact >= 0 ? 'text-success' : 'text-destructive')}>
                                {impact >= 0 ? '+' : ''}{impact.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pattern Reliability */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pattern Reliability Score</span>
                      <span className="font-mono font-bold text-primary">
                        {(selectedEvent.patternReliability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${selectedEvent.patternReliability * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Events;
