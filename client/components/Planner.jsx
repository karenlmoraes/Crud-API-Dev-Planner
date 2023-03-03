import axios from "axios";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog } from "@mui/material";
import Cookies from "js-cookie";
import Modal from "react-modal";
import Datepicker from "flowbite-datepicker/Datepicker";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);

  function AddEventModal(props) {
    const { open, onClose, onSubmit } = props;
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());

    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };

    const handleDateChange = (date) => {
      setDate(date);
    };

    const handleSubmit = () => {
      onSubmit({
        start: date,
        end: date,
        title: title,
      });
      onClose();
    };

    return (
      <Modal open={open} onClose={onClose}>
        <div style={{ backgroundColor: "white", padding: "1rem" }}>
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <Datepicker
            label="Date and Time"
            value={date}
            onChange={handleDateChange}
            sx={{ marginBottom: "1rem" }}
          />
          <button
            variant="contained"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Event
          </button>
        </div>
      </Modal>
    );
  }

  useEffect(() => {
    const userId = "5613e7a0-4708-46d8-9f26-d8f6d1cdc281";
    Cookies.set("id_user", userId);
    if (userId) {
      axios
        .get(`https://apicrudplanner.onrender.com/planner/user/${userId}`)
        .then((response) => {
          setEvents(response.data.planners);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  function handleSelectEvent(event) {
    setSelectedEvent(event);
    setEditTitle(event.title);
    setSelectedStart(event.start);
    setSelectedEnd(event.end);
    setOpenDialog(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
  }

  function handleEditEvent() {
    const updatedEvent = {
      ...selectedEvent,
      title: editTitle,
      start: selectedStart,
      end: selectedEnd,
    };

    axios
      .patch(`https://apicrudplanner.onrender.com/planner/${selectedEvent.id}`, updatedEvent)
      .then((response) => {
        const updatedEvents = events.map((event) => {
          if (event.id === selectedEvent.id) {
            return updatedEvent;
          }
          return event;
        });
        setEvents(updatedEvents);
        setSelectedEvent(updatedEvent);
        setOpenDialog(false);
      })
      .catch((error) => console.error(error));
  }

  function handleTitleChange(event) {
    setEditTitle(event.target.value);
  }

  function handleSelectSlot(slotInfo) {
    const title = window.prompt("Enter a title for your event");
    if (title) {
      const newEvent = {
        start: slotInfo.start,
        end: slotInfo.end,
        title: title,
      };

      const userId = Cookies.get("id_user");
      if (userId) {
        axios
          .post("https://apicrudplanner.onrender.com/planner", {
            user_Id: userId,
            conteudo: "Conteudo",
            start: slotInfo.start,
            end: slotInfo.end,
            title: title,
          })
          .then((response) => {
            setEvents([...events, response.data]);
          })
          .catch((error) => console.error(error));
      }
    }
  }

  function handleDeleteEvent() {
    axios
      .delete(`https://apicrudplanner.onrender.com/planner/${selectedEvent._id}`)
      .then(() => {
        const updatedEvents = events.filter(
          (event) => event.id !== selectedEvent.id
        );
        setEvents(updatedEvents);
        setSelectedEvent(null);
        setOpenDialog(false);
        console.log("Deletado com sucesso!!");
      })
      .catch((error) => console.error(error));
  }

  const [modalOpen, setModalOpen] = useState(false);
  function handleAddEvent(eventData) {
    const { title, start, end } = eventData;
    const userId = Cookies.get("id_user");
    if (userId) {
      axios
        .post("https://apicrudplanner.onrender.com/planner", {
          userID: userId,
          conteudo: "Conteudo",
          start: start,
          end: end,
          title: title,
        })
        .then((response) => {
          setEvents([...events, response.data]);
          setModalOpen(false);
        })
        .catch((error) => console.error(error));
    }
  }

  function handleEventDrop({ event, start, end, allDay }) {
    const updatedEvent = { ...event, start, end, allDay };
    const updatedEvents = events.map((e) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setEvents(updatedEvents);

    axios
      .patch(`https://apicrudplanner.onrender.com/planner/${updatedEvent.id}`, updatedEvent)
      .then((response) => {
        //...
      })
      .catch((error) => console.error(error));
  }

  function handleEventResize({ event, start, end }) {
    const updatedEvent = { ...event, start, end };

    axios
      .patch(`https://apicrudplanner.onrender.com/planner/${updatedEvent.id}`, updatedEvent)
      .then((response) => {
        const updatedEvents = events.map((e) =>
          e.id === updatedEvent.id ? updatedEvent : e
        );
        setEvents(updatedEvents);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div>
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        resizable
        onEventResize={handleEventResize}
      />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <h2 id="modal-title" className="text-xl font-medium mb-2 p-2 flex">
          Edite o Evento
        </h2>
        <div className="py-4 px-6">
          <h2 className="text-xl font-medium mb-2">
            Preencha as informações do evento:
          </h2>
          <label className="block font-medium mb-1">Titulo</label>
          <input
            className="border border-gray-400 p-2 mb-4 rounded w-full"
            type="text"
            value={editTitle}
            onChange={handleTitleChange}
          />

          <label className="block font-medium mb-1">Data de início</label>
          <input
            className="border border-gray-400 p-2 mb-4 rounded w-full"
            type="datetime-local"
          />

          <label className="block font-medium mb-1">Data de término</label>
          <input
            className="border border-gray-400 p-2 mb-4 rounded w-full"
            type="datetime-local"
          />
        </div>

        <div className="flex justify-between p-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleDeleteEvent}
          >
            Deletar
          </button>

          <div className="space-x-2">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleDialogClose}
            >
              Cancelar
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleEditEvent}
            >
              Salvar
            </button>

            <AddEventModal
              open={open}
              onClose={handleDialogClose}
              onSubmit={handleAddEvent}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default MyCalendar;
