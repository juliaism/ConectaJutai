import type { Request, Response } from "express";

export async function getClasses(req: Request, res: Response) {
  const mockClasses = [
    {
      id: "1",
      classes_date: "2026-06-27",
      course: "Cultivo de Milho",
      horario: "15:00",
      local: "Escola",
    },
    {
      id: "2",
      classes_date: "2026-07-01",
      course: "Cultivo de Mandioca",
      horario: "10:00",
      local: "Escola",
    },
  ];

  return res.json(mockClasses);
}
