import Image from "next/image"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export function AgentStats({ weaponStats, shots }) {
    return(
        <div>
            <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Type</TableHead>
      <TableHead>Percentage</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-bold">Headshots:</TableCell>
      <TableCell>{Math.round((weaponStats[0].headshots / weaponStats[0].shots) * 100)}%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-bold">Chest:</TableCell>
      <TableCell>{Math.round((weaponStats[0].chest_hits / weaponStats[0].shots) * 100)}%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-bold">Stomach:</TableCell>
      <TableCell>{Math.round((weaponStats[0].stomach_hits / weaponStats[0].shots) * 100)}%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-bold">Left arm:</TableCell>
      <TableCell>{Math.round((weaponStats[0].left_arm_hits / weaponStats[0].shots) * 100)}%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-bold">Right arm:</TableCell>
      <TableCell>{Math.round((weaponStats[0].right_arm_hits / weaponStats[0].shots) * 100)}%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-bold">Left leg:</TableCell>
      <TableCell>{Math.round((weaponStats[0].left_leg_hits / weaponStats[0].shots) * 100)}%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-bold">Right leg:</TableCell>
      <TableCell>{Math.round((weaponStats[0].right_leg_hits / weaponStats[0].shots) * 100)}%</TableCell>
    </TableRow>
  </TableBody>
</Table>

        </div>
    )
}