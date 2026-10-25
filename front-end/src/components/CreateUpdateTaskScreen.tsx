import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Chip, Spinner } from "@nextui-org/react";
import { AlertCircle } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TaskPriority } from "../domain/TaskPriority";
import { DatePicker } from "@nextui-org/date-picker";
import { TaskStatus } from "../domain/TaskStatus";
import { parseDate } from "@internationalized/date";
import PageHeader from "./PageHeader";

const CreateUpdateTaskScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId, taskId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId || !taskId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Loading initial data...");
        
        // First ensure we have the task list
        if (!state.taskLists.find(tl => tl.id === listId)) {
          await api.getTaskList(listId);
        }

        // Load the individual task
        const taskResponse = await api.getTask(listId, taskId);
        console.log("Task loaded:", taskResponse);
        
        // Check state after loading
        console.log("Current state after load:", state);
        
        // Get task from state
        const task = state.tasks[listId]?.find(t => t.id === taskId);
        console.log("Found task in state:", task);

        if (task) {
          console.log("Setting form values with task:", task);
          setTitle(task.title);
          setDescription(task.description || "");
          setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
          setPriority(task.priority || TaskPriority.MEDIUM);
          setStatus(task.status);
        }

        setIsUpdate(true);
      } catch (error) {
        console.error("Error loading task:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId, taskId]);

  // Watch for task updates in state
  useEffect(() => {
    if (listId && taskId && state.tasks[listId]) {
      const task = state.tasks[listId].find(t => t.id === taskId);
      console.log("State updated, current task:", task);
      
      if (task) {
        console.log("Updating form with task from state update:", task);
        setTitle(task.title);
        setDescription(task.description || "");
        setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
        setPriority(task.priority || TaskPriority.MEDIUM);
        setStatus(task.status);
      }
    }
  }, [listId, taskId, state.tasks]);

  const createUpdateTask = async () => {
    try {
      if (!listId) return;

      if (isUpdate && taskId) {
        await api.updateTask(listId, taskId, {
          id: taskId,
          title,
          description,
          dueDate,
          priority,
          status,
        });
      } else {
        await api.createTask(listId, {
          title,
          description,
          dueDate,
          priority,
          status: undefined,
        });
      }

      navigate(`/task-lists/${listId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDueDate(date || undefined);
  };

  const formatDateForPicker = (date: Date | undefined) => {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <div className="grid place-items-center py-32">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Design only: colour + label for each priority chip
  const priorityStyle: Record<
    TaskPriority,
    { color: "danger" | "warning" | "success"; label: string }
  > = {
    [TaskPriority.HIGH]: { color: "danger", label: "High" },
    [TaskPriority.MEDIUM]: { color: "warning", label: "Medium" },
    [TaskPriority.LOW]: { color: "success", label: "Low" },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <PageHeader
        title={isUpdate ? "Update Task" : "Create Task"}
        subtitle={
          isUpdate ? "Edit the details of this task." : "Add a new task to your list."
        }
        onBack={() => navigate(`/task-lists/${listId}`)}
        backLabel="Go back"
      />
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="glass-card p-6 flex flex-col gap-5"
      >
        <Input
          label="Title"
          labelPlacement="outside"
          placeholder="e.g. Buy milk"
          variant="bordered"
          radius="lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <Textarea
          label="Description"
          labelPlacement="outside"
          placeholder="Enter task description (optional)"
          variant="bordered"
          radius="lg"
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <DatePicker
          label="Due date (optional)"
          variant="bordered"
          radius="lg"
          defaultValue={dueDate ? parseDate(formatDateForPicker(dueDate)!) : undefined}
          onChange={(newDate) => handleDateChange(newDate ? new Date(newDate.toString()) : null)}
        />
        <div>
          <p className="text-sm text-default-500 mb-2">Priority</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(TaskPriority).map((p) => (
              <Chip
                key={p}
                color={priorityStyle[p].color}
                variant={priority === p ? "solid" : "bordered"}
                onClick={() => setPriority(p)}
                className="cursor-pointer select-none px-2 transition hover:opacity-90"
              >
                {priorityStyle[p].label}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <Button
            variant="flat"
            radius="lg"
            className="flex-1"
            onPress={() => navigate(`/task-lists/${listId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            radius="lg"
            className="flex-1 font-semibold shadow-lg shadow-primary/25"
            onClick={createUpdateTask}
          >
            {isUpdate ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUpdateTaskScreen;
