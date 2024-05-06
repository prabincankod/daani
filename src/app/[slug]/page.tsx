import { LucidePhoneCall, MapPin } from "lucide-react";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { AppRouter } from "~/server/api/root";
import { inferRouterOutputs } from "@trpc/server";
import { cacheMandir, getCachedMandir, kvClient } from "../../lib/redis";

export type MandirProp =
  inferRouterOutputs<AppRouter>["mandir"]["getMandirBySlug"];

interface IMandirPageProps {
  params: { slug: string };
}

export const fetchCache = "force-no-store";

export const dynamic = "force-dynamic";

const MandirPage: NextPage<IMandirPageProps> = async (props) => {
  const mandir =
    (await getCachedMandir(props.params.slug)) ??
    (await cacheMandir(props.params.slug));

  if (!mandir) {
    notFound();
  }

  return (
    <>
      <nav className="mt-4 text-center text-3xl font-bold uppercase ">
        {mandir.name_in_native ?? mandir.name}
      </nav>

      <main className="flex  flex-col items-center justify-center gap-12 px-4 py-12 md:px-6 md:py-24">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {mandir.config?.primaryHeadLineText}
          </h1>
          <p className="mx-auto max-w-[700px] text-center align-middle text-gray-500 dark:text-gray-400 md:text-xl">
            {mandir.config?.secondaryHeadLineText}
          </p>
          <Button className={`bg-[${mandir.config?.primaryColor}]`}>
            {mandir.config?.ctaBtnText}
          </Button>
        </div>

        {mandir.images && mandir.images.length > 0 && (
          <Carousel className="w-full max-w-4xl">
            <CarouselContent>
              {mandir.images.map((image) => (
                <CarouselItem key={image.id}>
                  <img
                    alt={image.name ?? `image-${image.mandirId}`}
                    className="m-auto aspect-[2/1] rounded-lg object-cover"
                    height="400"
                    src={image.url}
                    width="800"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">
              Explore the Wonders of Nepotism
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              I might implement markdown here as it is going to be content
              heavy.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">
              Plan Your Visit to Nepotism
            </h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin />
                <p className="text-gray-500 dark:text-gray-400">
                  Somewhere around madhumara
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <LucidePhoneCall />
                <p className="text-gray-500 dark:text-gray-400">
                  Nepali Phone Number
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MandirPage;
