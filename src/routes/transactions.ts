import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { checkSessionIdExist } from "../middlewares/check-session-id-exist";

export async function transcationsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select("*");

      return { transactions };
    }
  );

  app.get("/:id", { preHandler: [checkSessionIdExist] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { sessionId } = request.cookies;

    const { id } = getTransactionParamsSchema.parse(request.params);
    const transaction = await knex("transactions")
      .where({ id, session_id: sessionId })
      .first();
    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExist] },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    }
  );

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });
    console.log(request.body);
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId),
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        };
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      type,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
