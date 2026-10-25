import { Button, Checkbox, Chip, Progress, Spinner } from "@nextui-org/react";
import {
  CalendarDays,
  ClipboardList,
  Edit,
  Plus,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../AppProvider";
import Task from "../domain/Task";
import { TaskPriority } from "../domain/TaskPriority";
import { TaskStatus } from "../domain/TaskStatus";
import PageHeader from "./PageHeader";

// Design only: colour + label for each priority
const priorityStyle: Record<
  TaskPriority,
  { color: "danger" | "warning" | "success"; label: string }
> = {
  [TaskPriority.HIGH]: { color: "danger", label: "High" },
  [TaskPriority.MEDIUM]: { color: "warning", label: "Medium" },
  [TaskPriority.LOW]: { color: "success", label: "Low" },
};

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Find task list directly from state instead of maintaining separate state
  const taskList = state.taskLists.find((tl) => listId === tl.id);

  // Single useEffect to handle all initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId) return;

      setIsLoading(true);
      try {
        // Only fetch if we don't already have the task list
        if (!taskList) {
          await api.getTaskList(listId);
        }

        // Attempt to fetch tasks - this may 404 but we'll try anyway
        try {
          await api.fetchTasks(listId);
        } catch (error) {
          console.log("Tasks not available yet");
        }
      } catch (error) {
        console.error("Error loading task list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId]); // Only depend on listId

  // Calculate completion percentage based on tasks
  const completionPercentage = React.useMemo(() => {
    if (listId && state.tasks[listId]) {
      const tasks = state.tasks[listId];
      const closeTaskCount = tasks.filter(
        (task) => task.status === TaskStatus.CLOSED
      ).length;
      return tasks.length > 0 ? (closeTaskCount / tasks.length) * 100 : 0;
    }
    return 0;
  }, [state.tasks, listId]);

  const toggleStatus = (task: Task) => {
    if (listId) {
      const updatedTask = { ...task };
      updatedTask.status =
        task.status === TaskStatus.CLOSED ? TaskStatus.OPEN : TaskStatus.CLOSED;

      api
        .updateTask(listId, task.id, updatedTask)
        .then(() => api.fetchTasks(listId));
    }
  };

  const deleteTaskList = async () => {
    if (null != listId) {
      await api.deleteTaskList(listId);
      navigate("/");
    }
  };

  const tasks = listId ? state.tasks[listId] : undefined;
  const totalTasks = tasks ? tasks.length : 0;
  const closedTasks = tasks
    ? tasks.filter((t) => t.status === TaskStatus.CLOSED).length
    : 0;

  const taskRows = () => {
    if (null != listId && null != state.tasks[listId]) {
      return state.tasks[listId].map((task) => {
        const isClosed = TaskStatus.CLOSED == task.status;
        const prio = priorityStyle[task.priority];
        return (
          <li
            key={task.id}
            className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <Checkbox
              isSelected={isClosed}
              onValueChange={() => toggleStatus(task)}
              radius="full"
              color="success"
              aria-label={`Mark task "${task.title}" as ${
                isClosed ? "open" : "closed"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p
                className={`font-medium truncate ${
                  isClosed ? "line-through text-default-400" : ""
                }`}
              >
                {task.title}
              </p>
              {task.dueDate && (
                <p
                  className="mt-0.5 flex items-center gap-1.5 text-xs text-default-500"
                  aria-label={`Due date for task "${task.title}"`}
                >
                  <CalendarDays size={13} aria-hidden="true" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            {prio && (
              <Chip
                size="sm"
                variant="flat"
                color={prio.color}
                className="hidden sm:inline-flex"
              >
                {prio.label}
              </Chip>
            )}
            <div className="flex gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                aria-label={`Edit task "${task.title}"`}
                onClick={() =>
                  navigate(`/task-lists/${listId}/edit-task/${task.id}`)
                }
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="full"
                color="danger"
                onClick={() => api.deleteTask(listId, task.id)}
                aria-label={`Delete task "${task.title}"`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </li>
        );
      });
    } else {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="grid place-items-center py-32">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <PageHeader
        title={taskList ? taskList.title : "Unknown Task List"}
        subtitle={
          taskList?.description
            ? taskList.description
            : `${closedTasks} of ${totalTasks} completed`
        }
        onBack={() => navigate("/")}
        backLabel="Go back to Task Lists"
        actions={
          <Button
            isIconOnly
            variant="flat"
            radius="full"
            aria-label="Edit task list"
            onClick={() => navigate(`/edit-task-list/${listId}`)}
            className="bg-white/5 hover:bg-white/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
        }
      />

      {/* Progress card */}
      <section className="glass-card p-5 mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-sm text-default-500">Progress</p>
            <p className="text-2xl font-bold tabular-nums">
              {Math.round(completionPercentage)}%
            </p>
          </div>
          <p className="text-sm text-default-500">
            {closedTasks} of {totalTasks} tasks done
          </p>
        </div>
        <Progress
          value={completionPercentage}
          size="md"
          radius="full"
          color="primary"
          aria-label="Task completion progress"
        />
      </section>

      {/* Add task */}
      <Button
        onClick={() => navigate(`/task-lists/${listId}/new-task`)}
        aria-label="Add new task"
        color="primary"
        radius="lg"
        className="w-full mb-5 font-semibold shadow-lg shadow-primary/25"
        startContent={<Plus className="h-4 w-4" />}
      >
        Add Task
      </Button>

      {/* Tasks */}
      {totalTasks === 0 ? (
        <div className="glass-card flex flex-col items-center text-center py-14 px-6">
          <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/15 text-primary-300 mb-3">
            <ClipboardList size={24} />
          </div>
          <h2 className="text-lg font-semibold">Nothing here yet</h2>
          <p className="text-default-500 text-sm mt-1">
            Add your first task to this list.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5" aria-label="Tasks list">
          {taskRows()}
        </ul>
      )}

      {/* Danger zone */}
      <div className="mt-10 flex justify-end">
        <Button
          color="danger"
          variant="flat"
          radius="lg"
          startContent={<Trash size={18} />}
          onClick={deleteTaskList}
          aria-label="Delete current task list"
        >
          Delete list
        </Button>
      </div>
    </div>
  );
};

export default TaskListScreen;
