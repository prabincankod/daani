import Redis from "ioredis";
import { MandirProp } from "~/app/[slug]/page";
import { env } from "~/env";
import { api } from "~/trpc/server";

export const kvClient = new Redis(env.REDIS_URL);

export const cacheMandir = async (slug: string) => {
  const mandir = await api.mandir.getMandirBySlug({ mandirSlug: slug });
  if (mandir)
    await kvClient.set(`mandir-${slug}`, JSON.stringify(mandir), "EX", 120);

  return mandir;
};
export const getCachedMandir = async (slug: string) => {
  const mandirFromRedis = await kvClient.get(`mandir-${slug}`);
  if (!mandirFromRedis) return null;
  return JSON.parse(mandirFromRedis) as MandirProp;
};
