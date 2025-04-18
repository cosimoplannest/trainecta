
import { FollowupMonitoring } from "./FollowupMonitoring";
import { InactiveClientsMonitoring } from "./InactiveClientsMonitoring";

export const MonitoringTab = () => {
  return (
    <div className="space-y-6">
      <FollowupMonitoring />
      <InactiveClientsMonitoring />
    </div>
  );
};
