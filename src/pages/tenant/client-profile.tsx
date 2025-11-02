import { Button } from "@/components/ui/button";
import { useClientStore } from "@/store/use-client-store";
import { Link } from "react-router-dom";

export default function ClientProfile() {
  const { client } = useClientStore();

  console.log({ client });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-start">Client Profile</h1>
      <div className="flex justify-end gap-4 my-4">
        <Button>
          <Link to={"/dashboard/client/profile/update"}>Update Profile</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-2 text-start">
        <img className="w-44 h-44 rounded-lg" src={client?.logo} alt="" />

        <h2 className="text-xl font-semibold">Client Information</h2>
        <p className="text-gray-600">
          <span className="font-semibold">Name: </span>
          {client?.name ?? "N/A"}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Email: </span>
          {client?.email ?? "N/A"}
        </p>

        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-semibold">Color: </span>
          <div
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: client?.color ?? "#ddd" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
