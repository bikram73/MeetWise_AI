import React, { useState } from 'react';
import { ActionItem } from '../types';

interface ActionItemsTableProps {
  actionItems: ActionItem[];
  onUpdateActionItem: (index: number, updatedItem: ActionItem) => void;
  onAddActionItem: (newItem: ActionItem) => void;
  isDarkMode?: boolean;
}

export const ActionItemsTable: React.FC<ActionItemsTableProps> = ({
  actionItems,
  onUpdateActionItem,
  onAddActionItem,
  isDarkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New action item form state
  const [newTask, setNewTask] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const filteredItems = actionItems.filter((item) => {
    const matchesSearch =
      item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.due_date.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      selectedPriority === 'all' || item.priority.toLowerCase() === selectedPriority.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  const handleStatusChange = (index: number, currentStatus: string) => {
    const nextStatusMap: Record<string, 'Pending' | 'In Progress' | 'Completed'> = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Pending',
    };
    const nextStatus = nextStatusMap[currentStatus] || 'Completed';
    onUpdateActionItem(index, { ...actionItems[index], status: nextStatus });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAddActionItem({
      task: newTask.trim(),
      owner: newOwner.trim() || 'Unassigned',
      due_date: newDueDate.trim() || 'Not Specified',
      priority: newPriority,
      status: 'Pending',
    });
    setNewTask('');
    setNewOwner('');
    setNewDueDate('');
    setShowAddModal(false);
  };

  const getPriorityBadgeClass = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === 'high' || p === 'critical') return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (p === 'medium') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (s === 'in progress') return 'bg-[#005bbf]/10 text-[#005bbf] border-[#005bbf]/20';
    return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-1 gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks, owners, or dates..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                  : 'bg-white border-[#c1c6d6]/30 text-[#131b2e]'
              } focus:outline-none focus:ring-2 focus:ring-[#005bbf]/50`}
            />
          </div>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-[#c1c6d6]/30'
            } focus:outline-none cursor-pointer`}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#005bbf] hover:bg-[#1a73e8] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Task
        </button>
      </div>

      {/* Table Container */}
      <div className={`overflow-x-auto rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-[#c1c6d6]/30 bg-white'}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b font-bold ${isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-[#f2f3ff]/60 border-[#c1c6d6]/30 text-[#414754]'}`}>
              <th className="p-3.5">Task Description</th>
              <th className="p-3.5">Owner</th>
              <th className="p-3.5">Due Date</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/60' : 'divide-[#c1c6d6]/20'}`}>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                  No action items match your current filter.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, originalIndex) => {
                const actualIndex = actionItems.findIndex((a) => a === item);
                return (
                  <tr
                    key={actualIndex !== -1 ? actualIndex : originalIndex}
                    className={`transition-colors ${
                      isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="p-3.5 font-medium max-w-xs leading-relaxed">
                      <span className={item.status === 'Completed' ? 'line-through text-slate-400' : ''}>
                        {item.task}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-[#005bbf]/10 text-[#005bbf] border-[#005bbf]/20'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">person</span>
                        {item.owner}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_today</span>
                        {item.due_date}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadgeClass(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusChange(actualIndex !== -1 ? actualIndex : originalIndex, item.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${getStatusBadgeClass(item.status)}`}
                        title="Click to cycle status"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {item.status === 'Completed' ? 'check_circle' : item.status === 'In Progress' ? 'pending' : 'schedule'}
                        </span>
                        {item.status}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add New Action Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="e.g. Prepare API deployment checklist"
                  className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005bbf]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Owner</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005bbf]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. Friday"
                    className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005bbf]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-950 dark:border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#005bbf] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#1a73e8] cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
