import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { ChevronRight, ListChecks, Plus, Sparkles } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppProvider";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();

  // Fetch task lists when the component mounts
  useEffect(() => {
    if (null == state.taskLists) {
      api.fetchTaskLists();
    }
  }, [state]);

  // Get a handle on the router
  const navigate = useNavigate();

  const handleCreateTaskList = () => {
    navigate("/new-task-list");
  };

  const handleSelectTaskList = (taskListId: string | undefined) => {
    navigate(`/task-lists/${taskListId}`);
    console.log(`Navigating to task list ${taskListId}`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary-300 mb-2">
            <Sparkles size={16} aria-hidden="true" />
            Taskflow
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My <span className="gradient-text">Task Lists</span>
          </h1>
          <p className="text-default-500 mt-2">
            {state.taskLists.length === 0
              ? "Create your first list to get started."
              : `${state.taskLists.length} ${
                  state.taskLists.length === 1 ? "list" : "lists"
                } in your workspace`}
          </p>
        </div>
        <Button
          onPress={handleCreateTaskList}
          color="primary"
          radius="lg"
          size="lg"
          startContent={<Plus size={20} aria-hidden="true" />}
          className="font-semibold shadow-lg shadow-primary/30"
          aria-label="Create New Task List"
        >
          New list
        </Button>
      </header>

      {/* Empty state */}
      {state.taskLists.length === 0 && (
        <div className="glass-card flex flex-col items-center text-center py-16 px-6">
          <div className="grid place-items-center h-14 w-14 rounded-2xl bg-primary/15 text-primary-300 mb-4">
            <ListChecks size={28} />
          </div>
          <h2 className="text-xl font-semibold">No task lists yet</h2>
          <p className="text-default-500 mt-1 mb-6 max-w-sm">
            Lists help you group your tasks. Make one for work, study, shopping
            or anything else.
          </p>
          <Button color="primary" radius="lg" onPress={handleCreateTaskList}>
            Create your first list
          </Button>
        </div>
      )}

      {/* Lists grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {state.taskLists.map((list) => {
          const percent = list.progress ? Math.round(list.progress * 100) : 0;
          return (
            <Card
              key={list.id}
              isPressable
              onPress={() => handleSelectTaskList(list.id)}
              className="group w-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-none transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.06]"
              role="button"
              aria-label={`Select task list: ${list.title}`}
            >
              <CardBody className="p-5 text-left">
                <div className="flex items-start justify-between">
                  <div className="grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-cyan-400 text-white shadow-lg shadow-primary/30">
                    <ListChecks size={22} aria-hidden="true" />
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-default-400 transition group-hover:translate-x-1 group-hover:text-primary-300"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-lg font-semibold mt-4 truncate">
                  {list.title}
                </h2>
                <p className="text-sm text-default-500 mt-1">
                  {list.count ?? 0} {list.count === 1 ? "task" : "tasks"}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Progress
                    value={list.progress ? list.progress * 100 : 0}
                    size="sm"
                    radius="full"
                    color="primary"
                    className="flex-1"
                    aria-label={`Progress for ${list.title}: ${list.progress}%`}
                  />
                  <span className="text-xs font-medium text-default-500 tabular-nums w-9 text-right">
                    {percent}%
                  </span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TaskListScreen;
