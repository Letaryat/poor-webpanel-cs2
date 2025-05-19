import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import AddAdmin from "./tasks/addadmin"
export default function Satabs() {
    return (
        <div>
            <Tabs defaultValue="addadmin">
                <TabsList>
                    <TabsTrigger value="addadmin">Add administrator</TabsTrigger>
                    <TabsTrigger value="addgroup">Add group</TabsTrigger>
                    <TabsTrigger value="addserver">Add server</TabsTrigger>
                    <TabsTrigger value="addpunishment">Add ban / mute / gag</TabsTrigger>
                </TabsList>
                <TabsContent value="addadmin">
                    <AddAdmin/>
                </TabsContent>
                <TabsContent value="addgroup">Change your password here.</TabsContent>
                <TabsContent value="addserver">Make changes to your account here.</TabsContent>
                <TabsContent value="addpunishment">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
}