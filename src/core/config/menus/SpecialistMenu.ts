import icons from "@/core/data/icons";
const SpecialistMenu = [
  {
    heading: "Bookings",
    route: "/employee-booking-dashboard",
    svgIcon: icons.calender,
  },
  {
    heading: "HRM",
    role: ["admin", "org_manager"],
    route: "/human-resource-management",
    svgIcon: icons.person_circle,
    pages: [
      {
        heading: "Bulletin Board",
        route: "/hrm/bulletin-board",
      },
      {
        heading: "My Schedule",
        route: "/hrm/my-schedule",
      },
      {
        heading: "My availability",
        route: "/hrm/my-availability",
      },
    ],
  },
  {
    heading: "Patients",
    route: "/patients",
    svgIcon: icons.heart_pulse,
  },
  {
    heading: "Communication",
    route: "/third-party-comms",
    svgIcon: icons.paper_plane,
    fontIcon: "bi-send",
    pages: [
      {
        heading: "Outgoing",
        route: "/outgoing-log",
      },
    ],
  },
  {
    heading: "Incoming",
    route: "/specialist/incoming-documents",
    svgIcon: "media/icons/duotune/general/gen016.svg",
  },
];

export default SpecialistMenu;
