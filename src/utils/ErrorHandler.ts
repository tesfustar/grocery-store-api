import { Response } from "express";

interface ErrorProps {
  statusCode: number;
  message: string;
  res: Response;
}
export const ErrorHandler = ({ statusCode, message, res }: ErrorProps) => {
  if (!statusCode) return res.status(500).json({ message: message });
  res.status(statusCode).json({ message: message });
};
