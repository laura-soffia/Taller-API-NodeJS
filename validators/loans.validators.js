import { check } from "express-validator";

export const bookBody = check("book")
  .notEmpty().withMessage("El libro es obligatorio").bail()
  .isMongoId().withMessage("El id del libro no es válido");

export const loanId = check("id").isMongoId().withMessage("El id no es válido");

export const statusQuery = check("status")
  .optional()
  .isIn(["ACTIVE", "RETURNED"]).withMessage("status debe ser ACTIVE o RETURNED");

export const pagination = [
  check("page").optional().isInt({ min: 1 }).withMessage("page debe ser entero >= 1"),
  check("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit debe estar entre 1 y 100"),
];
