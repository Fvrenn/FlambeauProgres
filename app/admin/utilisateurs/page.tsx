"use client" 
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import React from "react";
import { Eye, TrashBinTrash, Pen2 } from "@solar-icons/react";


type Status = "active" | "paused" | "vacation";


export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
] as const;

const statusColorMap: Record<Status, "success" | "danger" | "warning"> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export const columns = [
  {
    name: "NAME",
    uid: "name",
    render: (user: (typeof users)[number]) => (
      <User
        avatarProps={{ radius: "lg", src: user.avatar }}
        description={user.email}
        name={user.name}
      >
        {user.email}
      </User>
    ),
  },
  {
    name: "ROLE",
    uid: "role",
    render: (user: (typeof users)[number]) => (
      <div className="flex flex-col">
        <p className="text-bold text-sm capitalize">{user.role}</p>
        <p className="text-bold text-sm capitalize text-default-400">
          {user.team}
        </p>
      </div>
    ),
  },
  {
    name: "STATUS",
    uid: "status",
    render: (user: (typeof users)[number]) => (
      <Chip
        className="capitalize"
        color={statusColorMap[user.status]}
        size="sm"
        variant="flat"
      >
        {user.status}
      </Chip>
    ),
  },
  {
    name: "ACTIONS",
    uid: "actions",
    render: (user: (typeof users)[number]) => (
      <div className="relative flex items-center gap-2">
        <Tooltip content="Details">
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <Eye weight="BoldDuotone" size={64} color="#0f4159" />
          </span>
        </Tooltip>
        <Tooltip content="Edit user">
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <Pen2 weight="BoldDuotone" size={64} color="#0f4159" />
          </span>
        </Tooltip>
        <Tooltip color="danger" content="Delete user">
          <span className="text-lg text-danger cursor-pointer active:opacity-50">
            <TrashBinTrash weight="BoldDuotone" size={64} color="#0f4159" />
          </span>
        </Tooltip>
      </div>
    ),
  },
];

export default function App() {
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={column.uid}>{column.render(item)}</TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
