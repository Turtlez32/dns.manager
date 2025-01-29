"use server"
import { api } from "~/trpc/server";

export default async function DeleteDNSEndpoint(key: string, token: string, csrf: string) {
   await api.post.deleteDns({key, token, csrf});
}
