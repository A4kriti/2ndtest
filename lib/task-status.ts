// All task statuses in one place. Change labels or colors here only.
export const TASK_STATUSES = [
  { value: "todo", label: "To do", style: "bg-gray-100 text-gray-600" },
  { value: "pending", label: "Pending", style: "bg-yellow-100 text-yellow-700" },
  { value: "complete", label: "Complete", style: "bg-green-100 text-green-700" },
];

// Find the status info from its value. Falls back to "To do".
export function getStatus(value: string) {
  return TASK_STATUSES.find((s) => s.value === value) ?? TASK_STATUSES[0];
}

