import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mandirRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });
  //   }),

  getMandirBySlug: publicProcedure
    .input(z.object({ mandirSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const mandir = await ctx.db.mandir.findUnique({
        where: { slug: input.mandirSlug },
        include: { images: true, packages: true, config: true },
      });
      return mandir;
    }),
});


export type MandirResponse = typeof mandirRouter.getMandirBySlug
