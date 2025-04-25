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
import {Exam} from "@/types";
import {v4 as uuidv4} from 'uuid';

interface CreateExamDialogProps {
  onCreateExam: (exam: Exam) => void;
}

export function CreateExamDialog({onCreateExam}: CreateExamDialogProps) {
  const [open, setOpen] = useState(false);
  const [examName, setExamName] = useState("");
  const [examDescription, setExamDescription] = useState("");

  const handleCreateExam = () => {
    if (examName && examDescription) {
      const newExam: Exam = {
        id: uuidv4(),
        name: examName,
        description: examDescription,
        tasks: [],
      };
      onCreateExam(newExam);
      setExamName("");
      setExamDescription("");
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Create Exam</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Exam</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the new exam.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right font-medium">
              Name
            </label>
            <Input
              id="name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right font-medium">
              Description
            </label>
            <Input
              id="description"
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateExam}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
