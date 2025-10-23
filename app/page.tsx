import { Metadata } from "next";
import ClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Brandon & Caryn Wedding",
  description: "RSVP for Brandon & Caryn's Wedding",
};

export default async function Page() {
  return <ClientPage />;
}
