"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Exam, Task } from "@/types";
import { CreateExamDialog } from "@/components/create-exam-dialog";
import { useRouter } from "next/navigation";
import * as gtag from "@/utils/gtag";

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

export default function Home() {
  const [exams, setExams] = useState<Exam[]>(examsData);
  const router = useRouter();

  useEffect(() => {
    setExams(examsData);
  }, []);

  const handleExamClick = (examId: string) => {
    const selectedExam = exams.find((exam) => exam.id === examId);

    if (selectedExam) {
      gtag.event({
        action: "click_exam_card",
        category: "navigation",
        label: selectedExam.name,
        value: 1,
      });
    }

    router.push(`/exam/${examId}`);
  };

  const handleCreateExam = (newExam: Exam) => {
    setExams([...exams, newExam]);

    gtag.event({
      action: "create_exam",
      category: "engagement",
      label: newExam.name,
      value: 1,
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10">
      <h1 className="text-4xl font-bold mb-4 text-primary">Exam AI Grader</h1>
      <section className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Exams</h2>
          <CreateExamDialog onCreateExam={handleCreateExam} />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleExamClick(exam.id)}
            >
              <CardHeader>
                <CardTitle>{exam.name}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Tasks: {exam.tasks.length}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
