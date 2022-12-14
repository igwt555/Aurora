<template>
  <CardSection class="mt-2">
    <template v-if="calendarOptions">
      <FullCalendar
        ref="appointmentCalendarRef"
        class="demo-app-calendar"
        :options="calendarOptions"
      >
        <template v-slot:eventContent="event">
          <template v-if="event.event.display != 'background'">
            <AppointmentTableData
              :appointment="event.event.extendedProps.appointment"
            />
          </template>
          <template v-else>
            {{ event.event.extendedProps.text }}
          </template>
        </template>
      </FullCalendar>
    </template>
  </CardSection>
  <MoveModal :isDisableAptTypeList="true" />
</template>
<style>
.fc-non-business {
  background-color: #f4f4f4 !important;
}

.fc .fc-timegrid-slot {
  height: 3em !important;
}
</style>
<script>
import {
  defineComponent,
  ref,
  computed,
  watchEffect,
  watch,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { DrawerComponent } from "@/assets/ts/components/_DrawerComponent";
import moment from "moment";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import {
  AppointmentActions,
  AppointmentMutations,
} from "@/store/enums/StoreAppointmentEnums";
import AppointmentTableData from "./partials/AppointmentTableData.vue";
import { Modal } from "bootstrap";
import MoveModal from "@/components/appointments/AppointmentMoveModal.vue";
export default defineComponent({
  components: {
    FullCalendar,
    AppointmentTableData,
    MoveModal,
  },
  props: {
    visibleDate: { type: Object, required: true },
    visibleSpecialists: { type: Object, required: true },
    organization: { type: Object, required: true },
  },
  setup(props) {
    const store = useStore();
    const calendarOptions = ref(null);
    const appointmentCalendarRef = ref(null); //this.$refs.refAppointmentCalendar.getApi();
    const appointmentsRaw = computed(() => store.getters.getAptList);
    const appointments = ref([]);
    const allSpecialists = computed(() => store.getters.getSpecialistList);

    onMounted(() => {
      var check = moment(props.visibleDate.date, "YYYY/MM/DD");
      var day = check.format("ddd").toUpperCase();
      allSpecialists.value.forEach((specialist) => {
        specialist.hrm_weekly_schedule.forEach((timeslot) => {
          if (timeslot.week_day == day) {
            let date = moment(props.visibleDate.date, "YYYY/MM/DD").format(
              "YYYY-MM-DD"
            );
            let start_time = date + "T" + timeslot.start_time;
            let end_time = date + "T" + timeslot.end_time;

            let color = "";
            if (timeslot.restriction == "CONSULTATION") {
              color = "#DDC1F0";
            } else if (timeslot.restriction == "PROCEDURE") {
              color = "#F0E9C1";
            } else {
              color = "#C1F0C1";
            }

            appointments.value.push({
              id: appointments.value.length,
              resourceId: specialist.id,
              start: start_time,
              end: end_time,
              display: "background",
              backgroundColor: color,
              text: timeslot.clinic_name,
            });
          }
        });
      });

      const duration = moment()
        .startOf("day")
        .add(props.organization.appointment_length, "minutes")
        .format("HH:mm:ss")
        .toString();
      calendarOptions.value = {
        schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
          resourceTimeGridPlugin,
        ],
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "",
        },
        resources: props.visibleSpecialists,
        nowIndicator: true,
        slotEventOverlap: false,
        initialView: "resourceTimeGridDay",
        navLinks: false, // can click day/week names to navigate views
        selectable: true,
        selectMirror: false,
        allDaySlot: false,
        height: 700,
        contentHeight: 700,
        expandRows: true,
        slotMinTime: props.organization.start_time,
        slotMaxTime: props.organization.end_time,
        slotDuration: duration,
        views: {
          timeGridDay: { buttonText: "day" },
        },
        editable: false,
        dayMaxEvents: false,
        events: [],
        selectConstraint: "businessHours",
        eventClick: handleShowAppointmentDrawer,
        select: handleCreateAppointment,
      };
    });

    watch(appointments, () => {
      if (appointmentCalendarRef.value) {
        let calenderAPI = appointmentCalendarRef.value.getApi();
        calenderAPI.removeAllEvents();
        for (let index = 0; index < appointments.value.length; index++) {
          appointmentCalendarRef.value
            .getApi()
            .addEvent(appointments.value[index]);
        }
      }
    });

    watch(props.visibleDate, () => {
      if (appointmentCalendarRef.value) {
        appointmentCalendarRef.value
          .getApi()
          .gotoDate(moment(props.visibleDate.date).format("YYYY-MM-DD"));
      }
    });

    watch(props, () => {
      calendarOptions.value.resources = props.visibleSpecialists;
    });

    watch(appointmentsRaw, () => {
      appointments.value = [];
      appointmentsRaw.value.forEach((appointment) => {
        appointments.value.push({
          id: appointment.id,
          resourceId: appointment.specialist_id,
          start: appointment.date + "T" + appointment.start_time,
          end: appointment.date + "T" + appointment.end_time,
          appointment: appointment,
        });
      });

      var check = moment(props.visibleDate.date, "YYYY/MM/DD");
      var day = check.format("ddd").toUpperCase();
      allSpecialists.value.forEach((specialist) => {
        specialist.schedule_timeslots.forEach((timeslot) => {
          if (timeslot.week_day == day) {
            let date = moment(props.visibleDate.date, "YYYY/MM/DD").format(
              "YYYY-MM-DD"
            );
            let start_time = date + "T" + timeslot.start_time;
            let end_time = date + "T" + timeslot.end_time;
            let color = "";
            if (timeslot.restriction == "CONSULTATION") {
              color = "#DDC1F0";
            } else if (timeslot.restriction == "PROCEDURE") {
              color = "#F0E9C1";
            } else {
              color = "#C1F0C1";
            }
            appointments.value.push({
              id: appointments.value.length,
              resourceId: specialist.id,
              start: start_time,
              end: end_time,
              display: "background",
              backgroundColor: color,
              text: timeslot.clinic_name,
            });
          }
        });
      });
    });

    watchEffect(() => {
      if (
        DrawerComponent?.getInstance(
          "appointment-drawer"
        )?.isBookingDrawerShown() === true
      ) {
        DrawerComponent?.getInstance("appointment-drawer")?.show();
      }
    });

    const handleShowAppointmentDrawer = (info) => {
      info.jsEvent.preventDefault();
      let appointment = info.event.extendedProps.appointment;
      store.commit(AppointmentMutations.SET_APT.SELECT, appointment);
      DrawerComponent?.getInstance("appointment-drawer")?.toggle();
    };

    const handleCreateAppointment = (info) => {
      info.jsEvent.preventDefault();
      const date = moment(info.start).format("YYYY-MM-DD").toString();
      const time = moment(info.start).format("HH:mm").toString();
      const timeF = moment(info.start).format("HH:mm:ss").toString();
      const weekDay = moment(info.start).format("ddd").toUpperCase();
      // filter correct specialist base on info
      let specialists = [];
      allSpecialists.value.map((specialist) => {
        if (specialist.id == info.resource.id) {
          specialists = { ...specialist };
        }
      });
      let restriction = null;
      specialists.hrm_weekly_schedule = specialists.hrm_weekly_schedule.filter(
        (slot) => {
          //make this more accurate filter this by clinic ID as well
          if (
            slot.week_day == weekDay &&
            slot.start_time <= timeF &&
            slot.end_time > timeF
          ) {
            restriction = slot.restriction;
            return slot;
          }
        }
      );
      const item = {
        time_slot: [date + "T" + time],
        date: date,
        selected_specialist: specialists,
        restriction: restriction,
      };
      store.commit(AppointmentMutations.SET_BOOKING.SELECT, item);
      store.commit(AppointmentMutations.SET_APT.SELECT_SPECIALIST, specialists);
      const modal = new Modal(document.getElementById("modal_create_apt"));
      modal.show();
    };

    //Check specialist clinic is selected one in filter or not
    const filterClinics = (id) => {
      return props.filteredClinics.includes(id, 0);
    };
    return {
      handleShowAppointmentDrawer,
      filterClinics,
      calendarOptions,
      appointments,
      appointmentCalendarRef,
      AppointmentTableData,
    };
  },
});
</script>
