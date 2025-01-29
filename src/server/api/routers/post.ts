import { z } from "zod";
import { DNS } from "~/components/helpers/dns-columns";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const hostname = "https://unifi.turtleware.au"
const unifiURL = `${hostname}/proxy/network/v2/api/site/default/`
const unifiAuthUrl = `${hostname}/api/auth/login`
const unifiUser = process.env.UNIFI_USER
const unifiPass = process.env.UNIFI_PASS

export const postRouter = createTRPCRouter({
  login: publicProcedure
    .query(async ({ }) => {
      const data = fetch(`${unifiAuthUrl}`, {
        method: "POST",
        headers:  {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: unifiUser,
          password: unifiPass
        })
      })

      const token = (await data).headers.get("set-cookie")
      const csrf = (await data).headers.get("x-csrf-token")

      const loginData = {
        token: token,
        csrf: csrf
      }

      return {
        loginData
      }
    }),
  getdns: publicProcedure
    .input(
      z.object({ 
        token: z.string(), 
        csrf: z.string() 
      }))
    .query(async({ input }) => {
      const data = await fetch(`${unifiURL}static-dns`, {
        headers: {
          "Content-Type": "application/json",
          "Cookie": input.token,
          "x-csrf-token": input.csrf
        }        
      })
      const dnsData: DNS[] = await data.json() as DNS[];

      const jsonData = {
        jsonData: dnsData.map((entry: DNS) => {
          return {
            enabled: entry.enabled,
            key: entry.key,
            value: entry.value,
            record_type: entry.record_type,
            delete: {
              url: `${unifiURL}static-dns/${entry.key}`,
              _id: entry._id,
              token: input.token,
              csrf: input.csrf
            },
            actions: "delete"
          }
        }
      )}

      return {
        jsonData
      }
    }),
  addDns: publicProcedure
    .input(
      z.object({
        token: z.string(),
        csrf: z.string(),
        key: z.string(),
        value: z.string(),
        recordType: z.string()
      }))
    .mutation(async({ input }) => {
      const data = await fetch(`${unifiURL}static-dns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": input.token,
          "x-csrf-token": input.csrf
        },
        body: JSON.stringify({
          enabled: true,
          record_type: input.recordType,
          value: input.value,
          key: input.key
        })
      })

      const jsonData: DNS = await data.json() as DNS

      return {
        jsonData
      }      
    }),
  deleteDns: publicProcedure  
    .input(
      z.object({
        key: z.string(),
        token: z.string(),
        csrf: z.string()
      }))
    .mutation(async({ input }) => {
      const data = await fetch(`${unifiURL}static-dns/${input.key}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Cookie": input.token,
          "x-csrf-token": input.csrf
        }
      })
    })
});
