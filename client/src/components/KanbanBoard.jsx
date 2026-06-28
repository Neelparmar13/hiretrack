import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import JobCard from "./JobCard";
import { updateJob } from "../api/jobs";

const COLUMNS = ["Applied", "Interview", "Offer", "Rejected"];

const colStyles = {
  Applied:   { header: "#E6F1FB", text: "#0C447C", border: "#B5D4F4" },
  Interview: { header: "#EEEDFE", text: "#3C3489", border: "#CECBF6" },
  Offer:     { header: "#EAF3DE", text: "#27500A", border: "#C0DD97" },
  Rejected:  { header: "#FCEBEB", text: "#791F1F", border: "#F7C1C1" },
};

export default function KanbanBoard({ jobs, setJobs, onUpdated }) {
  const getColJobs = (status) => jobs.filter((j) => j.status === status);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;

    // Optimistic update
    setJobs((prev) =>
      prev.map((j) => (j._id === draggableId ? { ...j, status: newStatus } : j))
    );

    try {
      await updateJob(draggableId, { status: newStatus });
    } catch {
      // Revert on failure
      setJobs((prev) =>
        prev.map((j) => (j._id === draggableId ? { ...j, status: source.droppableId } : j))
      );
    }
  };

  const handleDeleted  = (id)      => setJobs((prev) => prev.filter((j) => j._id !== id));
  const handleUpdated  = (updated) => {
    setJobs((prev) => prev.map((j) => j._id === updated._id ? updated : j));
    if (onUpdated) onUpdated(updated);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={board}>
        {COLUMNS.map((col) => {
          const colJobs = getColJobs(col);
          const s = colStyles[col];
          return (
            <div key={col} style={column}>
              <div style={{ ...colHeader, background: s.header, borderBottom: `1.5px solid ${s.border}` }}>
                <span style={{ fontWeight: 500, fontSize: 13, color: s.text }}>{col}</span>
                <span style={{ ...countBadge, background: s.border, color: s.text }}>{colJobs.length}</span>
              </div>

              <Droppable droppableId={col} isDropDisabled={false}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ ...dropZone, background: snapshot.isDraggingOver ? "#f8f8ff" : "#fafafa" }}
                  >
                    {colJobs.map((job, index) => (
                      <Draggable key={job._id} draggableId={job._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.85 : 1 }}
                          >
                            <JobCard
                              job={job}
                              onDeleted={handleDeleted}
                              onUpdated={handleUpdated}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {colJobs.length === 0 && (
                      <p style={{ fontSize: 12, color: "#bbb", textAlign: "center", marginTop: 24 }}>
                        Drop cards here
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

const board      = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, alignItems: "start" };
const column     = { background: "#fafafa", border: "0.5px solid #e8e8e8", borderRadius: 10, overflow: "hidden", minHeight: 200 };
const colHeader  = { padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" };
const countBadge = { fontSize: 11, fontWeight: 500, padding: "1px 7px", borderRadius: 10 };
const dropZone   = { padding: "10px 8px", minHeight: 160, transition: "background 0.15s" };