import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Phone, MessageSquare, Mail } from "lucide-react";

const data = [
  { name: "Voice", value: 42, color: "hsl(221, 83%, 53%)", icon: Phone },
  { name: "Chat", value: 38, color: "hsl(142, 76%, 36%)", icon: MessageSquare },
  { name: "Email", value: 20, color: "hsl(38, 92%, 50%)", icon: Mail },
];

export function ChannelMetrics() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Channel Distribution</h3>
        <p className="text-sm text-muted-foreground">Conversation volume by channel</p>
      </div>
      <div className="flex items-center gap-8">
        <div className="h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-4">
          {data.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-foreground">{item.value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}