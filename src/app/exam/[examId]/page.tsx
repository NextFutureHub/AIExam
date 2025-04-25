"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Exam, Task } from "@/types";
import { generateGradingReport } from "@/ai/flows/generate-grading-report";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { CreateTaskDialog } from "@/components/create-task-dialog";

const examsData: Exam[] = [
  {
    id: "1",
    name: "Midterm Exam",
    description: "Mathematics Midterm Exam for Grade 10",
    tasks: [
      {
        id: "1",
        name: "Question 1",
        criteria: "Show all work and explain your reasoning clearly.",
      },
      {
        id: "2",
        name: "Question 2",
        criteria: "Correctly apply the Pythagorean theorem.",
      },
    ],
  },
  {
    id: "2",
    name: "Final Exam",
    description: "Science Final Exam for Grade 12",
    tasks: [
      {
        id: "3",
        name: "Part 1",
        criteria: "Clearly explain the concept of thermodynamics.",
      },
      {
        id: "4",
        name: "Part 2",
        criteria: "Provide accurate examples of chemical reactions.",
      },
    ],
  },
];

export default function ExamPage() {
  const { toast } = useToast();
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [gradingReport, setGradingReport] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const exam = examsData.find((exam) => exam.id === examId);
    setExam(exam);
  }, [examId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateReport = async () => {
    if (!image) {
      toast({
        title: "Error",
        description: "Please upload an image first.",
      });
      return;
    }
    if (!selectedTask) {
      toast({
        title: "Error",
        description: "Please select a task first.",
      });
      return;
    }

    try {
      const report = await generateGradingReport({
        photoDataUri: image,
        taskCriteria: selectedTask.criteria,
      });
      setGradingReport(report.report);
      toast({
        title: "Success",
        description: "Grading report generated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate grading report.",
      });
    }
  };

  const handleCreateTask = (newTask: Task) => {
    if (exam) {
      const updatedExam: Exam = {
        ...exam,
        tasks: [...exam.tasks, newTask],
      };
      const examIndex = examsData.findIndex((e) => e.id === examId);
      if (examIndex !== -1) {
        examsData[examIndex] = updatedExam;
      }

      setExam(updatedExam);
    }
  };

  if (!exam) {
    return <div>Exam not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10">
      <h1 className="text-4xl font-bold mb-4 text-primary">{exam.name}</h1>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">
        {exam.description}
      </h2>
      <section className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-foreground">Tasks</h3>
          <CreateTaskDialog onCreateTask={handleCreateTask} examId={examId} />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {exam.tasks.map((task) => (
            <Card
              key={task.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedTask?.id === task.id ? "bg-secondary" : ""
              }`}
              onClick={() => setSelectedTask(task)}
            >
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{task.criteria}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-foreground">
            Upload Student Work
          </h3>
          {/* Скрытый инпут с возможностью выбора изображения только из галереи */}
          <label className="inline-block">
            <Button asChild>
              <span>Выбрать изображение из галереи</span>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {image && (
            <img
              src={image}
              alt="Student Work"
              className="mt-2 rounded-md max-h-64 object-contain"
            />
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold text-foreground">
            Grading Report
          </h3>
          <Button
            onClick={handleGenerateReport}
            disabled={!image || !selectedTask}
            className="mt-2"
          >
            Generate Report
          </Button>
          {gradingReport && (
            <Card className="mt-2">
              <CardContent>
                <Textarea
                  value={gradingReport}
                  readOnly
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
