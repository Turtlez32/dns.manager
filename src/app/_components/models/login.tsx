import { api } from "~/trpc/server";

export default async function Login() {
  const data = await api.post.login();

  return {
    data,
  }
}
