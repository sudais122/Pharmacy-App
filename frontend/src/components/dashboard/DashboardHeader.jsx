import React from "react";
import { Plus } from "lucide-react";

import Button from "../ui/Button";
import PageHeader from "../ui/PageHeaer";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <PageHeader
        title="Dashboard"
        description="Overview of your pharmacy"
      />

      <div className="flex items-center gap-3">
        <Button icon={Plus} text="Add Sale" />
        <Button icon={Plus} text="Add Medicine" />
      </div>
    </div>
  );
};

export default DashboardHeader;