"use client";
import { ColumnDef } from "@tanstack/react-table"
import DeleteDNSEndpoint from "~/app/_components/models/delete";

export type DNS = {
  _id: string;
  key: string;
  value: string;
  record_type: string;
  enabled: boolean;
  actions: string;
  delete: {
    url: string;
    _id: string;
    token: string;
    csrf: string;
  }
}

export async function deleteDns(id: string, token: string, csrf: string) {
  await DeleteDNSEndpoint(id, token, csrf);
  window.location.reload();
}

export const columns: ColumnDef<DNS>[] = [
  {
    header: "Enabled",
    accessorKey: "enabled",
  },
  {
    accessorKey:"key",
    header: "Key",
  },
  {
    header: "Value",
    accessorKey: "value",
  },
  {
    header: "Type",
    accessorKey: "record_type",
  },
  {
    header: "Actions",
    accessorKey: "delete",
    cell: ({row}) => {
      const deleteData = row.original.delete
      return (
        <button id={deleteData._id} onClick={async (e) => {
          e.preventDefault();
          await deleteDns(deleteData._id, deleteData.token, deleteData.csrf);}
        }>Delete</button>
      )
    }
  },
];