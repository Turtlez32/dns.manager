"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button";

export function CreateDNSEntry(props: {token: string, csrf: string}) {
  const utils = api.useUtils();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [recordType, setRecordType] = useState("");
  const createDNSEntry = api.post.addDns.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      window.location.reload();
    },
  });
  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createDNSEntry.mutate({
            token: props.token,
            csrf: props.csrf,
            key: key,
            value: value,
            recordType: recordType,
          });
        }}
        className="flex flex-col gap-2"
      >
        <Label>FDQN:</Label>
            <Input 
              value={key} 
              onChange={(e) => setKey(e.target.value)}
              type="text" placeholder="unifi.turtleware.au"/>
            <br />
            <Label>IP Adress:</Label>
            <Input 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              type="text" placeholder="10.0.40.1"/>
            <br />
            <Label>Record Type:</Label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="AAAA">AAAA</SelectItem>
              </SelectContent>
            </Select>
            <Button className="p-4" type="submit" disabled={createDNSEntry.isPending}>
                {createDNSEntry.isPending ? "Submitting..." : "Add DNS Entry"}
            </Button>
      </form>
    </div>
  );
}
