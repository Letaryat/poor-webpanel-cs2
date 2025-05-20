import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import AddAdmin from "./forms/addadmin"
import SaAdmins from "./data/showadmins"
import AddGroup from "./forms/addgroup"
import ShowSaGroups from "./data/showgroups"
export default function Satabs() {
    return (
        <div>
            <Tabs defaultValue="addadmin">
                <TabsList>
                    <TabsTrigger value="addadmin">Manage admins</TabsTrigger>
                    <TabsTrigger value="addgroup">Manage groups</TabsTrigger>
                    <TabsTrigger value="addserver">Manage servers</TabsTrigger>
                    <TabsTrigger value="addpunishment">Add ban / mute / gag</TabsTrigger>
                </TabsList>
                <TabsContent value="addadmin">
                    <div className="flex">
                        <AddAdmin />
                        <SaAdmins />
                    </div>
                </TabsContent>
                <TabsContent value="addgroup">
                    <div className="flex">
                        <AddGroup/>
                        <ShowSaGroups/>
                    </div>
                </TabsContent>
                <TabsContent value="addserver">Make changes to your account here.</TabsContent>
                <TabsContent value="addpunishment">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
}