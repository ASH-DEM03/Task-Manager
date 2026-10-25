import React, { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { AlertCircle } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageHeader from "./PageHeader";

const CreateUpdateTaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();

  const { listId } = useParams();

  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("" as string | undefined);

  // Get a handle on the router
  const navigate = useNavigate();

  const findTaskList = (taskListId: string) => {
    const filteredTaskLists = state.taskLists.filter(
      (tl) => taskListId == tl.id
    );
    if (filteredTaskLists.length === 1) {
      return filteredTaskLists[0];
    }
    return null;
  };

  const populateTaskList = (taskListId: string) => {
    const taskList = findTaskList(taskListId);
    if (null != taskList) {
      console.log("FOUND TASK LIST");
      setTitle(taskList.title);
      setDescription(taskList.description);
      setIsUpdate(true);
    }
  };

  useEffect(() => {
    if (null != listId) {
      console.log(`ID is ${listId}`);
      if (null == state.taskLists) {
        console.log("Fetching task lists");
        api.fetchTaskLists().then(() => populateTaskList(listId));
      } else {
        populateTaskList(listId);
      }
    }
  }, [listId]);

  const createUpdateTaskList = async () => {
    try {
      if (isUpdate && null != listId) {
        await api.updateTaskList(listId, {
          id: listId,
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      } else {
        await api.createTaskList({
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      }

      // Success navigate to home
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <PageHeader
        title={isUpdate ? "Update Task List" : "Create Task List"}
        subtitle={
          isUpdate
            ? "Change the name or description of this list."
            : "Give your new list a name."
        }
        onBack={() => navigate("/")}
        backLabel="Go back to Task Lists"
      />
      {error.length > 0 && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="glass-card p-6 flex flex-col gap-5">
        <Input
          label="Title"
          labelPlacement="outside"
          placeholder="e.g. Groceries"
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
          placeholder="Enter task list description (optional)"
          variant="bordered"
          radius="lg"
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <div className="flex gap-3 pt-1">
          <Button
            variant="flat"
            radius="lg"
            className="flex-1"
            onPress={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            radius="lg"
            className="flex-1 font-semibold shadow-lg shadow-primary/25"
            onClick={createUpdateTaskList}
          >
            {isUpdate ? "Update Task List" : "Create Task List"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUpdateTaskListScreen;
