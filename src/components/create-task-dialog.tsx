"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Task} from "@/types";
import {v4 as uuidv4} from 'uuid';

interface CreateTaskDialogProps {
  onCreateTask: (task: Task) => void;
  examId: string | string[] | undefined;
}

export function CreateTaskDialog({onCreateTask, examId}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskCriteria, setTaskCriteria] = useState("");

  const handleCreateTask = () => {
    if (taskName && taskCriteria) {
      const newTask: Task = {
        id: uuidv4(),
        name: taskName,
        criteria: taskCriteria,
      };
      onCreateTask(newTask);
      setTaskName("");
      setTaskCriteria("");
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Create Task</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Task</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the new task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right font-medium">
              Name
            </label>
            <Input
              id="name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="criteria" className="text-right font-medium">
              Criteria
            </label>
            <Input
              id="criteria"
              value={taskCriteria}
              onChange={(e) => setTaskCriteria(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateTask}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
