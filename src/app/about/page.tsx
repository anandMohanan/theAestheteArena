import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Taa About Page",
  description:
    "The aesthete's arena is a community to portray writing,visual art,internet culture research and beyond.",
};

export default function About() {
  return (
    <>
      {/* <img src="https://toppng.com/uploads/preview/apollo-head-11552730006n3ckukfriy.png" /> */}
      <section className="hero container max-w-screen-lg mx-auto p-10 flex justify-center">
        <Image
          src="https://www.greekmythology.com/images/mythology/apollo_large_image_8.jpg"
          width={300}
          height={300}
          alt="apollo"
          //   className="mx-auto"
        />
      </section>
      <p className="ml-4 italic text-text-secondary text-center ">
        &quot;Apollo is the god of music, poetry, art, oracles, archery, plague,
        medicine, sun, light, and, knowledge.&quot;
      </p>

      <div className="p-10">
        <p className="text-text font-bold text-lg">
          The aesthete’s arena is a community to portray writing,visual
          art,internet culture research and beyond. <br /> This site is still in
          development.
        </p>
      </div>
    </>
  );
}
