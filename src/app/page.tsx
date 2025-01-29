import { api, HydrateClient } from "~/trpc/server";
import { create } from 'zustand';
import { DataTable } from "../components/helpers/data-table";
import { columns } from "~/components/helpers/dns-columns";
import { CreateDNSEntry } from "./_components/create";
import type {DNS} from "~/components/helpers/dns-columns";

type LoginData = {
  token: string;
  csrf: string;
}

export default async function Home() {
  const useStore = create((set) => ({
    user: null,
    setUser: (user: LoginData) => set({ user }),
  }));

  let user = null;
  let dnsData: DNS[] = [];

  async function getDNSData(token: string, csrf: string) {
    "use server"
    const response = await api.post.getdns({token, csrf});
    return response.jsonData.jsonData as DNS[];
  }

  async function getUser() {
    "use server"
    const data = await api.post.login();
    return data;
  }

  if (user === null) {
    user = await getUser()
    if (user.loginData?.token && user.loginData?.csrf) {
      dnsData = await getDNSData(user.loginData.token, user.loginData.csrf);
    }        
  }  

  useStore.setState({ user });  

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center 
                       bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 text-teal-200">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            DNS<span className="text-teal-200 "> Manager</span> App
          </h1>
        </div>
        <div className="container flex flex-row items-start justify-center gap-12 px-4 py-16">
          {user !== null && (
            <div className="flex flex-col items-center justify-center gap-12">
              {user.loginData?.token && user.loginData?.csrf && (
                <CreateDNSEntry token={user.loginData.token} csrf={user.loginData.csrf} />
              )}
            </div>
          )}
          <div className="flex flex-col items-center justify-center gap-12">
            <DataTable columns={columns} data={dnsData || []} />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}