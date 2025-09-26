import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DatabaseToggleProps {
  onDatabaseChange: (database: "mongodb" | "d1") => void;
  currentDatabase: "mongodb" | "d1";
}

export default function DatabaseToggle({
  onDatabaseChange,
  currentDatabase,
}: DatabaseToggleProps) {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <span className="text-sm font-medium text-gray-700">Database:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Button
          variant={currentDatabase === "mongodb" ? "default" : "ghost"}
          size="sm"
          onClick={() => onDatabaseChange("mongodb")}
          className={`px-3 py-1 text-xs font-medium transition-all duration-200 ${
            currentDatabase === "mongodb"
              ? "bg-white hover:text-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          MongoDB
        </Button>
        <Button
          variant={currentDatabase === "d1" ? "default" : "ghost"}
          size="sm"
          onClick={() => onDatabaseChange("d1")}
          className={`px-3 py-1 text-xs font-medium transition-all duration-200 ${
            currentDatabase === "d1"
              ? "bg-white shadow-sm hover:text-white text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          D1
        </Button>
      </div>
    </div>
  );
}
