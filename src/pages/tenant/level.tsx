import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, PlusCircle } from "lucide-react";
import AddLevelModal from "./modals/add-level-modal";
import EditLevelModal from "./modals/edit-level-modal";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLevels } from "@/api/level.api";
import { Loader } from "@/components/loader";

interface Level {
  _id: string;
  name: string;
}

export default function Levels() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>(
    {}
  );

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const { data, isPending } = useQuery({
    queryKey: ["levels"],
    queryFn: () => getLevels({ page, limit: 10, search }),
  });

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (level: Level) => {
    setSelectedLevel(level);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedLevel(null);
    setIsEditModalOpen(false);
  };

  const toggleExpand = (levelId: string) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [levelId]: !prev[levelId],
    }));
  };

  if (isPending) {
    return <Loader isLoading={isPending} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Levels</h1>
        <Button onClick={openAddModal}>
          <PlusCircle size={16} className="mr-2" />
          Add Level
        </Button>
      </div>

      <table className="min-w-full bg-white border rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Level Name</th>
            {/* <th className="text-left p-2 border">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {data?.levels?.length > 0 ? (
            data?.levels.map((level: any) => (
              <React.Fragment key={level._id}>
                <tr className="hover:bg-gray-50 border-gray-200 border-2">
                  <td className="text-left p-2 border flex items-center gap-2 capitalize">
                    <Button
                      className="flex items-center"
                      onClick={() => toggleExpand(level._id)}
                    >
                      {expandedLevels[level._id] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </Button>
                    {level.name}
                  </td>
                  <td className="text-left p-2 border flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(level)}
                    >
                      Edit
                    </Button>
                  </td>
                  {expandedLevels[level._id] && level.leaveTypes.length > 0 && (
                    <td className="flex flex-wrap">
                      <td colSpan={2} className="p-2 border bg-gray-50 w-full">
                        <ul className="pl-6 list-disc">
                          {level.leaveTypes.map(
                            (leaveType: {
                              _id: string;
                              name: string;
                              defaultBalance: string;
                            }) => (
                              <li key={leaveType._id} className="mb-1">
                                <strong className="capitalize">
                                  {leaveType.name}
                                </strong>
                                : {leaveType.defaultBalance}
                              </li>
                            )
                          )}
                        </ul>
                      </td>
                    </td>
                  )}
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr className="py-4">
              <td>No Level Found</td>
            </tr>
          )}
        </tbody>
      </table>

      <AddLevelModal isOpen={isAddModalOpen} onClose={closeAddModal} />

      {selectedLevel && (
        <EditLevelModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          level={selectedLevel}
        />
      )}
    </div>
  );
}
